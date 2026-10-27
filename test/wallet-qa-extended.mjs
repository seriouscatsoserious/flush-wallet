import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {environment,buildRegtest,until,pause} from './support/regtest-env.mjs';
import {units,decimal} from '../src/core.js';
const env=await environment(),{rpc,balance}=env,root=resolve('runtime/wallet-qa');
const previous=JSON.parse(await readFile(root+'/session.json','utf8'));
const extension=root+'/extended-extension';await buildRegtest(extension);
const options=dir=>({channel:'chromium',headless:true,viewport:{width:390,height:760},deviceScaleFactor:2,args:['--no-sandbox','--disable-extensions-except='+dir,'--load-extension='+dir]});
const report={startedAt:new Date().toISOString(),network:'local regtest',checks:[],passed:false};
async function save(){await writeFile('output/wallet-qa-extended.json',JSON.stringify(report,null,2)+'\n');}
async function check(name,fn){console.log('TEST:',name);try{const result=await fn();report.checks.push({name,status:'passed',...result});console.log('PASS:',name);await save();return result;}catch(error){report.checks.push({name,status:'failed',error:error.message});await save();throw error;}}
async function call(page,type,args={}){const response=await page.evaluate(message=>chrome.runtime.sendMessage(message),{type,...args});if(!response.ok)throw Error(response.error);return response.result;}
async function idle(p){await p.waitForFunction(()=>!document.querySelector('button:disabled'));}
async function unlock(p){await p.locator('#password').fill(previous.password);await p.locator('#unlock').click();await p.locator('#password').waitFor({state:'hidden',timeout:45000});await idle(p);}
async function home(p){await p.locator('#home').click();await p.getByText('Your tokens',{exact:true}).waitFor();await idle(p);}
async function reviewed(p){await until(async()=>await p.locator('#approve').count()||await p.getByRole('alert').count(),'review');if(await p.getByRole('alert').count())throw Error(await p.getByRole('alert').innerText());}
async function approve(p){await p.locator('#approve').click();await until(async()=>await p.getByRole('heading',{name:'Transaction sent',exact:true}).count()||await p.getByRole('alert').count(),'broadcast');if(await p.getByRole('alert').count())throw Error(await p.getByRole('alert').innerText());return (await p.locator('.card.break').innerText()).trim();}
async function confirmed(chain,txid,count=1){return until(async()=>{for(let i=0;i<count;i++){const o=await rpc(chain,'gettxout',[txid,i,true]);if(o?.confirmations>0)return o;}return false;},'confirmation');}
let values;
const old=await chromium.launchPersistentContext(previous.profile,options(root+'/extension'));
try{const worker=old.serviceWorkers()[0]||await old.waitForEvent('serviceworker');values=await worker.evaluate(()=>chrome.storage.local.get(['vault','rpcConnection','connectionMode','history']));}finally{await old.close();}
const profile=root+'/extended-'+Date.now(),browser=await chromium.launchPersistentContext(profile,options(extension));
await writeFile(root+'/extended-session.json',JSON.stringify({profile,password:previous.password,extension}),{mode:0o600});
const worker=browser.serviceWorkers()[0]||await browser.waitForEvent('serviceworker'),id=new URL(worker.url()).host;
await worker.evaluate(values=>chrome.storage.local.set(values),values);
const p=await browser.newPage();
try{
 await p.goto(`chrome-extension://${id}/popup.html`);await unlock(p);await home(p);
 const state=await call(p,'STATE'),address=state.account.address,flux=await rpc('flush','getasset',['FLUX']),prism=await rpc('flush','getasset',['PRISM']);
 await check('Trade across two real pools into an asset with six decimal places',async()=>{
  const beforeIn=await balance('flush',address,flux.asset),beforeOut=await balance('flush',address,prism.asset);
  await p.locator('#swap').click();await p.locator('#asset').selectOption(flux.asset);await p.locator('#to-asset').selectOption(prism.asset);await p.locator('#amount').fill('25');await p.locator('#review').click();await reviewed(p);
  const text=await p.locator('.card').innerText();assert(text.includes('25 FLUX'));assert(text.includes('PRISM'));
  const txid=await approve(p);await confirmed('flush',txid,3);const afterIn=await balance('flush',address,flux.asset),afterOut=await balance('flush',address,prism.asset);
  assert.equal(beforeIn-afterIn,2500n);assert(afterOut>beforeOut);await p.locator('#done').click();await p.locator('[data-token="'+prism.asset+'"]').waitFor();
  assert.equal(await p.locator('.coin img').count(),1);assert.equal(await p.locator('[data-token="'+prism.asset+'"] .name img').count(),0,'Metadata must stay plain text');
  assert((await p.locator('[data-token="'+prism.asset+'"] .name').innerText()).includes('<img'));await p.screenshot({path:'output/qa-multi-pool.png'});
  return {txid,spentFLUX:'25',receivedPRISM:decimal(afterOut-beforeOut,6),metadataEscaped:true,logoLoaded:true};
 });
 await check('Reject malformed amounts and wrong-network recipients before signing',async()=>{
  const target=await rpc('flush','getnewaddress',[],'w');
  for(const entry of [{asset:flux.asset,amount:'0.001',to:target,pattern:/Invalid amount/},{asset:'ECX',amount:'-1',to:target,pattern:/Invalid amount/},{asset:'ECX',amount:'1e2',to:target,pattern:/Invalid amount/},{asset:'ECX',amount:'0.01',to:state.account.accounts.ecash.address,pattern:/Flush.*address/},{asset:'ECX',amount:'999999',to:target,pattern:/Insufficient ECX/}]){
   await home(p);await p.locator('#send').click();await p.locator('#asset').selectOption(entry.asset);await p.locator('#to').fill(entry.to);await p.locator('#amount').fill(entry.amount);await p.locator('#review').click();await p.getByRole('alert').waitFor();assert.match(await p.getByRole('alert').innerText(),entry.pattern);assert.equal(await p.locator('#approve').count(),0);await idle(p);
  }
  return {cases:5};
 });
 await check('Submit a minimum-denomination token transfer with exact token change',async()=>{
  const target=await rpc('flush','getnewaddress',[],'w'),before=await balance('flush',address,prism.asset);
  await home(p);await p.locator('#send').click();await p.locator('#asset').selectOption(prism.asset);await p.locator('#to').fill(target);await p.locator('#amount').fill('0.000001');await p.locator('#review').click();await reviewed(p);const txid=await approve(p);const output=await confirmed('flush',txid);
  assert.equal(output.token.amount_units,'1');assert.equal(await balance('flush',target,prism.asset),1n);assert.equal(await balance('flush',address,prism.asset),before-1n);await p.locator('#done').click();return {txid,receivedUnits:'1'};
 });
 await check('Keep a durable transaction record when the node accepts but the response is lost',async()=>{
  const target=await rpc('flush','getnewaddress',[],'w');await home(p);
  await worker.evaluate(()=>{const original=globalThis.fetch;globalThis.__qaAccepted=null;globalThis.fetch=async(input,options)=>{const request=options?.body?JSON.parse(options.body):null;if(request?.method==='sendrawtransaction'){const response=await original(input,options);const body=await response.json();if(body.result){globalThis.__qaAccepted=body.result;throw new TypeError('Deliberately lost accepted response');}return new Response(JSON.stringify(body),{status:response.status});}return original(input,options);};});
  await call(p,'LOCK');await call(p,'UNLOCK',{password:previous.password});await home(p);
  await p.locator('#send').click();await p.locator('#to').fill(target);await p.locator('#amount').fill('0.000123');await p.locator('#review').click();await reviewed(p);
  await p.locator('#approve').click();await until(async()=>Boolean(await worker.evaluate(()=>globalThis.__qaAccepted))||await p.getByRole('alert').count(),'accepted transaction');const txid=await worker.evaluate(()=>globalThis.__qaAccepted);assert(txid,'No successful node acceptance during injected failure');await confirmed('flush',txid);
  const history=await call(p,'HISTORY');assert(history.items.some(tx=>tx.txid===txid),'Accepted transaction is missing from Activity after a lost response');return {txid};
 });
 report.passed=true;await save();console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
