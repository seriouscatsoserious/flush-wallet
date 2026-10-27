import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,rm,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {account,hex,signPlan} from '../src/core.js';
import {BETANET_CHECKPOINT,FLUSH_GENESIS} from '../src/rpc.js';
const profile=await mkdtemp(tmpdir()+'/flush-advanced-e2e-'),extension=resolve('extension');
await mkdir('output',{recursive:true});
const c=await chromium.launchPersistentContext(profile,{channel:'chromium',headless:true,viewport:{width:390,height:600},args:['--no-sandbox','--disable-extensions-except='+extension,'--load-extension='+extension]});
const errors=[],requests=[];c.on('request',r=>{if(/^https?:/.test(r.url()))requests.push({url:r.url(),body:r.postData()});});c.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
try{
 const worker=c.serviceWorkers()[0]||await c.waitForEvent('serviceworker'),id=new URL(worker.url()).host,p=await c.newPage();await p.goto(`chrome-extension://${id}/popup.html`);
 await p.evaluate(()=>{window.__permissionCalls=[];chrome.permissions.request=async args=>{window.__permissionCalls.push(args);return window.__grantNodes===true;};});
 await p.locator('#new').click();const words=await p.locator('.words span').evaluateAll(nodes=>nodes.map(n=>n.lastChild.textContent));assert.equal(words.length,12);const phrase=words.join(' ');
 await p.locator('#continue').click();const positions=await p.locator('label[for^="word-"]').allTextContents();const indices=positions.map(t=>Number(t.match(/\d+/)[0])-1);assert.equal(new Set(indices).size,3);
 await p.locator('#password').fill('test unlock password 123');await p.locator('#repeat').fill('test unlock password 123');for(let i=0;i<3;i++)await p.locator('#word-'+i).fill('wrong');await p.locator('#create').click();await p.getByRole('alert').waitFor();assert.match(await p.getByRole('alert').innerText(),/Recovery words/);
 assert.equal((await p.evaluate(()=>chrome.storage.local.get('vault'))).vault,undefined);
 for(let i=0;i<3;i++)await p.locator('#word-'+i).fill(words[indices[i]]);await p.locator('#create').click();await p.getByText('Your tokens',{exact:true}).waitFor({timeout:45000});
 assert.equal(await p.locator('#mode-rpc').count(),0);assert.equal((await p.evaluate(()=>window.__permissionCalls)).length,0);
 await p.locator('#settings').click();assert.equal(await p.locator('#advanced').getAttribute('open'),null);assert(!await p.locator('#connection').isVisible());
 await p.screenshot({path:'output/wallet-settings-advanced.png'});
 await p.locator('#advanced summary').click();await p.locator('#connection').click();assert(await p.locator('#mode-explorer').isChecked());assert(!await p.locator('#rpc-fields').isVisible());assert.equal((await p.evaluate(()=>window.__permissionCalls)).length,0);
 await p.locator('#mode-rpc').check();assert(await p.locator('#rpc-fields').isVisible());assert.equal((await p.evaluate(()=>window.__permissionCalls)).length,0);
 await p.locator('#ecash-url').fill('http://127.0.0.1:8332/');await p.locator('#flush-url').fill('https://node.example/flush');await p.locator('#ecash-auth').fill('rpc-user:node-secret-l1');await p.locator('#flush-auth').fill('__cookie__:node-secret-l2');
 await p.locator('#pair-rpc').click();await p.getByRole('alert').waitFor();assert.match(await p.getByRole('alert').innerText(),/not granted/);assert.equal((await p.evaluate(()=>chrome.runtime.sendMessage({type:'STATE'}))).result.connectionMode,'explorer');
 const accounts={ecash:account(phrase,'ecash'),flush:account(phrase)},assetId='44'.repeat(32);
 await worker.evaluate(({scripts,checkpoint,genesis,logo,assetId})=>{
  globalThis.__rpcCalls=[];globalThis.__badNode=true;globalThis.__removed=[];globalThis.__expected=null;
  chrome.permissions.contains=async()=>true;chrome.permissions.remove=async args=>{globalThis.__removed.push(args);return true;};
  const original=globalThis.fetch;globalThis.fetch=async(input,options={})=>{
   const url=String(input);if(!['http://127.0.0.1:8332/','https://node.example/flush'].includes(url))return original(input,options);
   const chain=url.startsWith('http:')?'ecash':'flush',request=JSON.parse(options.body);globalThis.__rpcCalls.push({chain,request,auth:options.headers.Authorization});let result;
   switch(request.method){
    case 'getblockchaininfo':result={chain:chain==='ecash'?'main':'ecashbeta',blocks:chain==='ecash'?974013:19000,headers:chain==='ecash'?974013:19000,initialblockdownload:false};break;
    case 'getblockhash':result=globalThis.__badNode?'ff'.repeat(32):chain==='ecash'?checkpoint:genesis;break;
    case 'getmainchaininfo':result={slot:99};break;
    case 'scantxoutset':result={success:true,height:19000,unspents:[{txid:'11'.repeat(32),vout:0},...(chain==='flush'?[{txid:'22'.repeat(32),vout:0}]:[])]};break;
    case 'gettxout':result={value:request.params[0].startsWith('11')?'0.10000000':'0',scriptPubKey:{hex:scripts[chain]},coinbase:false,confirmations:100,token:request.params[0].startsWith('22')?{kind:0,id:assetId,amount_units:'123400000'}:null};break;
    case 'listassets':result=[{asset:assetId,name:'TEST',display_name:'Test asset',decimals:6,supply:'1000000',fixed:true,data:{info:'A test asset'},logo:{mime:'image/png'}}];break;
    case 'getassetlogo':result={mime:'image/png',base64:logo};break;
    case 'sendrawtransaction':if(!globalThis.__expected||request.params[0]!==globalThis.__expected.hex)throw Error('Unexpected signed transaction');result=globalThis.__expected.txid;break;
    default:throw Error('Unexpected RPC method '+request.method);
   }
   return new Response(JSON.stringify({jsonrpc:'2.0',id:request.id,result}));
  };
 },{scripts:{ecash:hex(accounts.ecash.script),flush:hex(accounts.flush.script)},checkpoint:BETANET_CHECKPOINT.hash,genesis:FLUSH_GENESIS,assetId,logo:(await readFile('test/fixtures/token-logo.png')).toString('base64')});
 await p.evaluate(()=>{window.__grantNodes=true;});await p.locator('#pair-rpc').click();await p.getByRole('alert').waitFor();assert.match(await p.getByRole('alert').innerText(),/not eCash betanet|not betanet slot/);assert.equal((await p.evaluate(()=>chrome.runtime.sendMessage({type:'STATE'}))).result.connectionMode,'explorer');
 await worker.evaluate(()=>{globalThis.__badNode=false;});await p.locator('#pair-rpc').click();await p.getByText('Nodes paired',{exact:true}).waitFor();
 assert.equal((await p.evaluate(()=>chrome.runtime.sendMessage({type:'STATE'}))).result.connectionMode,'rpc');
 const stored=await p.evaluate(()=>chrome.storage.local.get());assert(stored.rpcConnection.ciphertext);assert(!JSON.stringify(stored).includes('node-secret'));assert(!JSON.stringify(stored).includes('node.example'));assert(!JSON.stringify(stored).includes(phrase));
 assert.equal(await p.locator('#ecash-auth').inputValue(),'');assert.equal(await p.locator('#flush-auth').inputValue(),'');await p.screenshot({path:'output/wallet-connection-rpc.png'});
 const permissionCalls=await p.evaluate(()=>window.__permissionCalls);assert.equal(permissionCalls.length,3);assert.deepEqual(permissionCalls.at(-1).origins,['http://127.0.0.1/*','https://node.example/*']);
 const explorerBefore=requests.filter(r=>r.url.startsWith('https://explorer.blockfab.org')).length;
 await p.locator('#home').click();await p.getByText('Test asset',{exact:true}).waitFor();assert((await p.locator('.coin img').getAttribute('src')).startsWith('data:image/png;base64,'));await p.screenshot({path:'output/wallet-home-rpc.png'});
 assert.equal(requests.filter(r=>r.url.startsWith('https://explorer.blockfab.org')).length,explorerBefore);
 await p.locator('[data-native="ecash"]').click();await p.locator('#send').click();await p.locator('#to').fill(accounts.ecash.address);await p.locator('#amount').fill('0.001');await p.locator('#review').click();await p.locator('#approve').waitFor();
 const prepared=await p.evaluate(({to})=>chrome.runtime.sendMessage({type:'PREPARE_SEND',chain:'ecash',asset:'ECX',to,amount:'0.001'}),{to:accounts.ecash.address});assert(prepared.ok,prepared.error);
 const signed=signPlan(prepared.result,phrase);await worker.evaluate(signed=>{globalThis.__expected=signed;},signed);
 // Re-render the review using the same inputs, so the UI owns the current plan ID.
 await p.locator('#cancel').click();await p.locator('#send').click();await p.locator('#asset').selectOption('L1_ECX');await p.locator('#to').fill(accounts.ecash.address);await p.locator('#amount').fill('0.001');await p.locator('#review').click();await p.locator('#approve').click();await p.getByRole('heading',{name:'Transaction sent'}).waitFor();
 assert.equal((await worker.evaluate(()=>globalThis.__rpcCalls.filter(c=>c.request.method==='sendrawtransaction'))).length,1);
 await p.locator('#settings').click();await p.locator('#advanced summary').click();await p.locator('#connection').click();await p.locator('#lock').click();await p.locator('#password').fill('test unlock password 123');await p.locator('#unlock').click();await p.locator('#mode-rpc').waitFor();assert(await p.locator('#mode-rpc').isChecked());
 await p.locator('#mode-explorer').check();await p.locator('#use-explorer').click();await p.getByText('Using explorer',{exact:true}).waitFor();assert.equal((await p.evaluate(()=>chrome.storage.local.get('rpcConnection'))).rpcConnection,undefined);assert.equal((await p.evaluate(()=>chrome.runtime.sendMessage({type:'STATE'}))).result.connectionMode,'explorer');
 assert(!requests.some(r=>(r.body||'').includes(phrase)||(r.body||'').includes('node-secret')));assert.deepEqual(errors,[]);
 await writeFile('output/advanced-test.json',JSON.stringify({passed:true,tests:['recovery word challenge','RPC buried under Advanced','no permissions before Pair','permission denial preserves Explorer','wrong network refused','credentials encrypted','RPC data and images avoid Explorer','local signing and RPC broadcast with fixture','unlock restores connection','Explorer reset clears credentials'],liveRpcBroadcast:false},null,2));
 console.log('PASS: recovery challenge, advanced-only RPC settings, opt-in permissions, network validation, encrypted credentials, RPC-only data/images, local-signing fixture broadcast, reset to Explorer');
}finally{await c.close();await rm(profile,{recursive:true,force:true});}
