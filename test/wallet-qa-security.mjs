import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {environment,buildRegtest,pause} from './support/regtest-env.mjs';
import {generateMnemonic} from '@scure/bip39';
import {wordlist} from '@scure/bip39/wordlists/english.js';
import {sealConnection} from '../src/connection.js';
const env=await environment(),root=resolve('runtime/wallet-qa'),extension=root+'/security-extension';
const session=JSON.parse(await readFile(root+'/session.json','utf8')),password=session.password;
const {core}=await buildRegtest(extension);
const options=dir=>({channel:'chromium',headless:true,viewport:{width:390,height:760},args:['--no-sandbox','--disable-extensions-except='+dir,'--load-extension='+dir]});
const report={startedAt:new Date().toISOString(),checks:[],passed:false};
async function save(){await writeFile('output/wallet-qa-security.json',JSON.stringify(report,null,2)+'\n');}
async function check(name,fn){console.log('TEST:',name);try{const result=await fn();report.checks.push({name,status:'passed',...result});console.log('PASS:',name);await save();return result;}catch(error){report.checks.push({name,status:'failed',error:error.message});await save();throw error;}}
async function call(p,type,args={}){const r=await p.evaluate(m=>chrome.runtime.sendMessage(m),{type,...args});if(!r.ok)throw Error(r.error);return r.result;}
let values;
const old=await chromium.launchPersistentContext(session.profile,options(root+'/extension'));
try{const worker=old.serviceWorkers()[0]||await old.waitForEvent('serviceworker');values=await worker.evaluate(()=>chrome.storage.local.get(['vault','rpcConnection','connectionMode','history']));}finally{await old.close();}
const profile=root+'/security-'+Date.now();let browser=await chromium.launchPersistentContext(profile,options(extension));
let worker=browser.serviceWorkers()[0]||await browser.waitForEvent('serviceworker');const id=new URL(worker.url()).host;
await worker.evaluate(values=>chrome.storage.local.set(values),values);
let p=await browser.newPage();const requests=[];browser.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.postData()||'');});
try{
 await p.goto(`chrome-extension://${id}/popup.html`);
 await check('Cold installation keeps the encrypted funded wallet locked',async()=>{assert(await p.locator('#unlock').isVisible());const s=await call(p,'STATE');assert(!s.unlocked);assert.equal(s.account.address,values.vault.address);return {address:s.account.address};});
 await check('Wrong password cannot unlock or change the vault',async()=>{await p.locator('#password').fill('incorrect QA password');await p.locator('#unlock').click();await p.getByRole('alert').waitFor();assert.match(await p.getByRole('alert').innerText(),/Wrong password/);const v=await p.evaluate(()=>chrome.storage.local.get('vault'));assert.equal(v.vault.ciphertext,values.vault.ciphertext);});
 await p.locator('#password').fill(password);await p.locator('#unlock').click();await p.getByText('Your tokens',{exact:true}).waitFor({timeout:45000});
 const target=await env.rpc('flush','getnewaddress',[],'w');
 const prepared=await call(p,'PREPARE_SEND',{chain:'flush',asset:'ECX',to:target,amount:'0.001'});
 const started=Date.now();let phrase;
 await check('Recovery reveal requires authentication and hides again after 30 seconds',async()=>{
  await p.locator('#settings').click();await p.locator('#recovery').click();await p.locator('#password').fill(password);await p.locator('#reveal').click();await p.locator('#hide').waitFor();assert.equal(await p.locator('.words span').count(),12);
  phrase=(await call(p,'RECOVERY',{password})).mnemonic;
  while(Date.now()-started<32000){await call(p,'STATE');await pause(4000);}
  assert.equal(await p.locator('.words').count(),0);return {hiddenAfterSeconds:Math.round((Date.now()-started)/1000)};
 });
 await check('Real two-minute auto-lock invalidates an outstanding transaction',async()=>{
  while(Date.now()-started<123000){const s=await call(p,'STATE');if(Date.now()-started<110000)assert(s.unlocked);await pause(8000);}
  const s=await call(p,'STATE');assert(!s.unlocked);
  const rejected=await p.evaluate(planId=>chrome.runtime.sendMessage({type:'APPROVE',planId}),prepared.id);assert(!rejected.ok);assert.match(rejected.error,/Unlock/);
  await p.locator('#lock').click();await p.locator('#password').fill(password);await p.locator('#unlock').click();await p.locator('#password').waitFor({state:'hidden'});
  const expired=await p.evaluate(planId=>chrome.runtime.sendMessage({type:'APPROVE',planId}),prepared.id);assert(!expired.ok);assert.match(expired.error,/expired|changed/);assert.equal(await env.balance('flush',target),0n);return {elapsedSeconds:Math.round((Date.now()-started)/1000),noFundsMoved:true};
 });
 await check('Secrets remain encrypted and never appear in RPC request bodies',async()=>{const stored=await p.evaluate(()=>chrome.storage.local.get());const text=JSON.stringify(stored);assert(stored.vault.ciphertext);assert(stored.rpcConnection.ciphertext);assert(!text.includes(phrase)&&!text.includes(password));assert(!requests.some(body=>body.includes(phrase)||body.includes(password)));return {vaultEncrypted:true,credentialsEncrypted:true,seedSent:false,passwordSent:false};});
 await check('Service-worker termination locks the signer and preserves wallet data',async()=>{
  const cdp=await browser.browser().newBrowserCDPSession();const targets=await cdp.send('Target.getTargets');const sw=targets.targetInfos.find(t=>t.type==='service_worker'&&t.url.startsWith('chrome-extension://'+id+'/'));assert(sw);await cdp.send('Target.closeTarget',{targetId:sw.targetId});await p.close();p=await browser.newPage();await p.goto(`chrome-extension://${id}/popup.html`);await p.locator('#unlock').waitFor();const state=await call(p,'STATE');assert(!state.unlocked);assert.equal(state.account.address,values.vault.address);await p.locator('#password').fill(password);await p.locator('#unlock').click();await p.locator('#password').waitFor({state:'hidden'});
 });
 await browser.close();browser=await chromium.launchPersistentContext(profile,options(extension));worker=browser.serviceWorkers()[0]||await browser.waitForEvent('serviceworker');p=await browser.newPage();await p.goto(`chrome-extension://${id}/popup.html`);
 await check('Full Chrome restart preserves both chain identities and requires unlocking',async()=>{await p.locator('#unlock').waitFor();const s=await call(p,'STATE');assert(!s.unlocked);assert.deepEqual(s.account.accounts,values.vault.accounts);});
 await browser.close();
 // A separate empty profile exercises 24-word import and invalid phrase handling.
 browser=await chromium.launchPersistentContext(root+'/import24-'+Date.now(),options(extension));worker=browser.serviceWorkers()[0]||await browser.waitForEvent('serviceworker');p=await browser.newPage();await p.goto(`chrome-extension://${id}/popup.html`);await p.locator('#import').click();
 await check('Invalid recovery phrases cannot create a wallet',async()=>{await p.locator('#seed').fill('wrong '.repeat(12));await p.locator('#password').fill(password);await p.locator('#repeat').fill(password);await p.locator('#create').click();await p.getByRole('alert').waitFor();assert.match(await p.getByRole('alert').innerText(),/Invalid recovery phrase/);assert.equal((await p.evaluate(()=>chrome.storage.local.get('vault'))).vault,undefined);});
 await check('Import a valid 24-word seed into both chain accounts',async()=>{const phrase24=generateMnemonic(wordlist,256),expected=core.publicAccounts(phrase24);await worker.evaluate(values=>chrome.storage.local.set(values),{connectionMode:'rpc',rpcConnection:await sealConnection(env.config,phrase24)});await p.locator('#seed').fill(phrase24);await p.locator('#create').click();await p.getByText('Your tokens',{exact:true}).waitFor({timeout:45000});const s=await call(p,'STATE');assert.deepEqual(s.account.accounts,expected);return {wordCount:24};});
 report.passed=true;await save();console.log(JSON.stringify(report,null,2));
}finally{if(browser)await browser.close();}
