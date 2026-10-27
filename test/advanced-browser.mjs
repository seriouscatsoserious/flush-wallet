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
  globalThis.__rpcCalls=[];globalThis.__badNode=true;globalThis.__removed=[];globalThis.__expected=null;globalThis.__launchState='curve';globalThis.__granted=['http://127.0.0.1/*','https://node.example/*','https://obsolete.example/*'];
  chrome.permissions.contains=async()=>true;chrome.permissions.getAll=async()=>({origins:[...chrome.runtime.getManifest().host_permissions,...globalThis.__granted]});chrome.permissions.remove=async args=>{globalThis.__removed.push(args);globalThis.__granted=globalThis.__granted.filter(origin=>!args.origins.includes(origin));return true;};
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
    case 'getasset':result={asset:assetId,name:'TEST',decimals:6,fixed:true,data:{}};break;
    case 'getlaunch':result={token:assetId,status:globalThis.__launchState,pool:'55'.repeat(32)};break;
    case 'getpool':result={id:'55'.repeat(32),asset_a_id:'0'.repeat(64),asset_b_id:assetId};break;
    case 'quoteroute':result={routes:[{amount_out:'10',pools:['55'.repeat(32)],path_ids:[null,assetId]}]};break;
    case 'getassetlogo':result={mime:'image/png',base64:logo};break;
    case 'sendrawtransaction':if(globalThis.__intent){const key=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(globalThis.__intent))),b=>b.toString(16).padStart(2,'0')).join('');if(!(await chrome.storage.local.get('usedUris')).usedUris?.[key])throw Error('Website intent was not recorded before broadcast');globalThis.__intentRecorded=true;}if(!globalThis.__expected||request.params[0]!==globalThis.__expected.hex)throw Error('Unexpected signed transaction');result=globalThis.__expected.txid;break;
    default:throw Error('Unexpected RPC method '+request.method);
   }
   return new Response(JSON.stringify({jsonrpc:'2.0',id:request.id,result}));
  };
 },{scripts:{ecash:hex(accounts.ecash.script),flush:hex(accounts.flush.script)},checkpoint:BETANET_CHECKPOINT.hash,genesis:FLUSH_GENESIS,assetId,logo:(await readFile('test/fixtures/token-logo.png')).toString('base64')});
 await p.evaluate(()=>{window.__grantNodes=true;});await p.locator('#pair-rpc').click();await p.getByRole('alert').waitFor();assert.match(await p.getByRole('alert').innerText(),/not eCash betanet|not betanet slot/);assert.equal((await p.evaluate(()=>chrome.runtime.sendMessage({type:'STATE'}))).result.connectionMode,'explorer');
 assert.deepEqual(await worker.evaluate(()=>globalThis.__granted),[]);
 await worker.evaluate(()=>{globalThis.__badNode=false;globalThis.__granted=['http://127.0.0.1/*','https://node.example/*','https://obsolete.example/*'];});await p.locator('#pair-rpc').click();await p.getByText('Nodes paired',{exact:true}).waitFor();
 assert.equal((await p.evaluate(()=>chrome.runtime.sendMessage({type:'STATE'}))).result.connectionMode,'rpc');assert.deepEqual(await worker.evaluate(()=>globalThis.__granted),['http://127.0.0.1/*','https://node.example/*']);
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
 // Real extension provider + actual site origin; RPC state remains a controlled fixture.
 const site=await c.newPage();await site.goto('https://flush.markets/',{waitUntil:'networkidle'});
 const uri=exp=>'flush:buy?'+new URLSearchParams({v:'1',network:'ecashbeta',exp:String(exp),launch:'TEST',asset:assetId,ecx:'0.001',min_tokens:'0.000001',slippage_bps:'100'});
 async function requestTrade(value){const opening=c.waitForEvent('page');await site.evaluate(uri=>{window.__tradeResult=null;window.flush.request({method:'flush_submit',params:{uri}}).then(result=>window.__tradeResult={ok:true,result}).catch(error=>window.__tradeResult={ok:false,error:error.message});},value);const approval=await opening;await approval.locator('#approve').waitFor();return approval;}
 const expiry=Math.floor(Date.now()/1000)+600;
 const stale=await requestTrade(uri(expiry));assert.match(await stale.locator('#app').innerText(),/9\.9 TEST/);
 await worker.evaluate(()=>{globalThis.__launchState='graduated';});await stale.locator('#approve').click();await stale.getByRole('alert').waitFor();assert.match(await stale.getByRole('alert').innerText(),/graduated/);
 assert.equal(await worker.evaluate(()=>globalThis.__rpcCalls.filter(c=>c.request.method==='sendrawtransaction').length),1);
 await stale.locator('#cancel').click();await site.waitForFunction(()=>window.__tradeResult!==null);assert.equal((await site.evaluate(()=>window.__tradeResult)).ok,false);
 await worker.evaluate(()=>{globalThis.__launchState='curve';});const acceptedUri=uri(expiry+1),approval=await requestTrade(acceptedUri);
 const trade=await approval.evaluate(()=>chrome.runtime.sendMessage({type:'PREPARE_PENDING'}));assert(trade.ok,trade.error);assert.equal(trade.result.summary.minOut,'9.9');
 await worker.evaluate(({signed,uri})=>{globalThis.__expected=signed;globalThis.__intent=uri;},{signed:signPlan(trade.result,phrase),uri:acceptedUri});
 await approval.reload();await approval.locator('#approve').click();await approval.getByRole('heading',{name:'Transaction sent'}).waitFor();await site.waitForFunction(()=>window.__tradeResult!==null);
 assert.equal((await site.evaluate(()=>window.__tradeResult)).ok,true);assert.equal(await worker.evaluate(()=>globalThis.__intentRecorded),true);await approval.close();
 const replay=await site.evaluate(async uri=>{try{await window.flush.request({method:'flush_submit',params:{uri}});return '';}catch(error){return error.message;}},acceptedUri);assert.match(replay,/already completed/);await site.close();
 await p.locator('#history').click();await p.getByRole('note').waitFor();assert.match(await p.getByRole('note').innerText(),/Incoming transfers are included in your balance/);
 await p.locator('#settings').click();await p.locator('#advanced summary').click();await p.locator('#connection').click();await p.locator('#lock').click();await p.locator('#password').fill('test unlock password 123');await p.locator('#unlock').click();await p.locator('#mode-rpc').waitFor();assert(await p.locator('#mode-rpc').isChecked());
 await p.locator('#mode-explorer').check();await p.locator('#use-explorer').click();await p.getByText('Using explorer',{exact:true}).waitFor();assert.equal((await p.evaluate(()=>chrome.storage.local.get('rpcConnection'))).rpcConnection,undefined);assert.equal((await p.evaluate(()=>chrome.runtime.sendMessage({type:'STATE'}))).result.connectionMode,'explorer');
 assert.deepEqual(await worker.evaluate(()=>globalThis.__granted),[]);
 assert(!requests.some(r=>(r.body||'').includes(phrase)||(r.body||'').includes('node-secret')));assert.deepEqual(errors,[]);
 await writeFile('output/advanced-test.json',JSON.stringify({passed:true,tests:['recovery word challenge','RPC buried under Advanced','no permissions before Pair','permission denial preserves Explorer','wrong network refused','credentials encrypted','RPC data and images avoid Explorer','local signing and RPC broadcast with fixture','unlock restores connection','Explorer reset clears credentials','failed/replaced node permissions released','own-node Activity limitation visible','graduated launch blocked before signing','website minimum cannot weaken wallet quote','website intent persisted before broadcast and replay refused'],liveRpcBroadcast:false},null,2));
 console.log('PASS: recovery challenge, advanced-only RPC settings, opt-in permissions, network validation, encrypted credentials, RPC-only data/images, local-signing fixture broadcast, reset to Explorer, launch graduation guard, strict minimum, durable intent replay protection');
}finally{await c.close();await rm(profile,{recursive:true,force:true});}
