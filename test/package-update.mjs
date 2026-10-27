import {chromium} from 'playwright';
import {mkdtemp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash,randomBytes} from 'node:crypto';
import assert from 'node:assert/strict';
import {BETANET_CHECKPOINT,FLUSH_GENESIS} from '../src/rpc.js';
const oldVersion='0.3.2',version=JSON.parse(await readFile('package.json','utf8')).version;
assert.notEqual(version,oldVersion,'An update needs a different package version');
await mkdir('output',{recursive:true});
const root=await mkdtemp(join(tmpdir(),'flush-package-update-')),folder=join(root,'flush-wallet'),profile=join(root,'profile');
let browser;
try{
 const base='https://github.com/seriouscatsoserious/flush-wallet/releases/download/v'+oldVersion+'/flush-wallet-'+oldVersion+'.zip';
 const [archive,checksum]=await Promise.all([fetch(base),fetch(base+'.sha256')]);assert(archive.ok&&checksum.ok,'Previous public package is unavailable');
 const bytes=Buffer.from(await archive.arrayBuffer());assert.equal(createHash('sha256').update(bytes).digest('hex'),(await checksum.text()).split(/\s/)[0]);
 const previous=join(root,'previous.zip');await writeFile(previous,bytes);execFileSync('python3',['-m','zipfile','-e',previous,root]);
 const launch=()=>chromium.launchPersistentContext(profile,{channel:'chromium',headless:true,args:['--no-sandbox','--disable-extensions-except='+folder,'--load-extension='+folder]});
 browser=await launch();let worker=browser.serviceWorkers()[0]||await browser.waitForEvent('serviceworker');const id=new URL(worker.url()).host;let page=await browser.newPage();await page.goto(`chrome-extension://${id}/popup.html`);await page.locator('#new').waitFor();
 const password=randomBytes(24).toString('base64url');
 // Public BIP39 vector in a temporary browser; it is never funded or broadcast.
 const phrase='abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
 const created=await page.evaluate(({mnemonic,password})=>chrome.runtime.sendMessage({type:'CREATE',mnemonic,password,imported:true}),{mnemonic:phrase,password});assert(created.ok,created.error);
 await worker.evaluate(({checkpoint,genesis})=>{
  chrome.permissions.contains=async()=>true;
  globalThis.fetch=async(url,options)=>{
   const {method}=JSON.parse(options.body),l1=String(url).includes('l1.example');
   const result=method==='getblockchaininfo'?{chain:l1?'main':'ecashbeta',blocks:1000000,headers:1000000,initialblockdownload:false}:method==='getblockhash'?(l1?checkpoint:genesis):method==='getmainchaininfo'?{slot:99}:null;
   if(result===null)throw Error('Unexpected update-check request');return new Response(JSON.stringify({result}));
  };
 },{checkpoint:BETANET_CHECKPOINT.hash,genesis:FLUSH_GENESIS});
 const config={ecash:{url:'https://l1.example/rpc',auth:'update-user:test-only-l1'},flush:{url:'https://l2.example/rpc',auth:'update-user:test-only-l2'}};
 const paired=await page.evaluate(connection=>chrome.runtime.sendMessage({type:'PAIR_RPC',connection}),config);assert(paired.ok,paired.error);
 const before=await page.evaluate(()=>chrome.storage.local.get(['vault','rpcConnection','connectionMode']));assert(before.vault.ciphertext&&before.rpcConnection.ciphertext);
 assert(!JSON.stringify(before).includes(phrase));assert(!JSON.stringify(before).includes('test-only-l1'));
 await browser.close();browser=null;
 execFileSync('python3',['-m','zipfile','-e',resolve('output/flush-wallet-'+version+'.zip'),root]);
 browser=await launch();worker=browser.serviceWorkers()[0]||await browser.waitForEvent('serviceworker');assert.equal(new URL(worker.url()).host,id);assert.equal(await worker.evaluate(()=>chrome.runtime.getManifest().version),version);
 page=await browser.newPage();await page.goto(`chrome-extension://${id}/popup.html`);await page.locator('#password').waitFor();
 const state=await page.evaluate(()=>chrome.runtime.sendMessage({type:'STATE'}));assert.equal(state.result.unlocked,false);assert.equal(state.result.connectionMode,'rpc');assert.deepEqual(state.result.account.accounts,created.result.account.accounts);
 assert.deepEqual(await page.evaluate(()=>chrome.storage.local.get(['vault','rpcConnection','connectionMode'])),before);
 const locked=await page.evaluate(()=>chrome.runtime.sendMessage({type:'CONNECTION'}));assert.equal(locked.ok,false);
 const unlock=await page.evaluate(password=>chrome.runtime.sendMessage({type:'UNLOCK',password}),password);assert(unlock.ok,unlock.error);
 const connection=await page.evaluate(()=>chrome.runtime.sendMessage({type:'CONNECTION'}));assert(connection.ok,connection.error);assert.equal(connection.result.ecash.url,config.ecash.url);assert.equal(connection.result.flush.url,config.flush.url);assert(connection.result.ecash.hasAuth&&connection.result.flush.hasAuth);
 const result={passed:true,previousVersion:oldVersion,version,identityPreserved:true,bothAddressesPreserved:true,encryptedVaultPreserved:true,encryptedRpcConnectionPreserved:true,restartLocked:true,unlockAndConnectionRestore:true,broadcasts:0};await writeFile('output/package-update.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await browser?.close();await rm(root,{recursive:true,force:true});}
