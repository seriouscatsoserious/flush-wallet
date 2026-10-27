// Opt-in public betanet checks using the existing funded development profiles.
// No server, fixtures, seed logging or mainnet support. Never included in the extension ZIP.
import {chromium} from 'playwright';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {explorerCoins,explorerTransactionStatus,api} from '../src/api.js';
import {decimal,units} from '../src/core.js';
assert.equal(process.env.FLUSH_PUBLIC_BETANET_RUN,'1','Explicit funded-betanet opt-in is required');
const source='bflx1qvwgqgsq8g8mxjjvqgm7f6spcm0vj2vaaj7ftxr',destination='bflx1qmtkdefx6keeyx0wc7l5lfg64mq000mkka0l552';
const from='617a6ad47771d6161d35023a90e7b5134ee6317c4f3d38475ec2cde540acb04f',to='f2aa8424ca44b42255817563d1170fb105b96c88b9920aad8308c825ff64e789';
const journal='runtime/live-wallet-test/route-run.json';let report;try{report=JSON.parse(await readFile(journal,'utf8'));}catch{report={network:'public betanet slot 99',startedAt:new Date().toISOString(),source,destination,stages:{},passed:false};}
assert(!report.active,'An earlier submission needs manual Activity inspection before resuming: '+report.active);
if(report.passed){console.log('This run already passed; refusing to repeat public spending.');process.exit(0);}
const save=()=>writeFile(journal,JSON.stringify(report,null,2)+'\n',{mode:0o600});
async function until(fn,label){const end=Date.now()+180000;while(Date.now()<end){try{const r=await fn();if(r)return r;}catch{}await new Promise(r=>setTimeout(r,3000));}throw Error('Timed out: '+label);}
async function balance(address,id){const coins=await explorerCoins('flush',address);return coins.utxos.filter(u=>id?u.token?.id===id:!u.token).reduce((n,u)=>n+BigInt(id?u.token.amount_units:u.value_sat),0n);}
const contexts=[];
async function open(profile,passwordFile,address){const extension=resolve('extension'),context=await chromium.launchPersistentContext(resolve(profile),{channel:'chromium',headless:true,viewport:{width:390,height:760},args:['--no-sandbox','--disable-extensions-except='+extension,'--load-extension='+extension]});contexts.push(context);const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker'),page=await context.newPage();const url=`chrome-extension://${new URL(worker.url()).host}/popup.html`,password=await readFile(passwordFile,'utf8');
 const call=async(type,args={})=>{const r=await page.evaluate(m=>chrome.runtime.sendMessage(m),{type,...args});assert(r.ok,r.error);return r.result;};
 async function home(){await page.goto(url);const s=await call('STATE');assert.equal(s.account?.address,address);assert.equal(s.connectionMode,'explorer');if(!s.unlocked){await page.locator('#password').fill(password);await page.locator('#unlock').click();}await page.getByText('Your tokens',{exact:true}).waitFor({timeout:45000});}
 await home();return {page,call,home,context};}
async function stage(name,fn){if(report.stages[name])return report.stages[name];report.active=name;await save();console.log('START '+name);const result=await fn();report.stages[name]=result;delete report.active;await save();console.log(JSON.stringify({stage:name,...result}));return result;}
async function approve(wallet,name){await wallet.page.locator('#approve').click();await wallet.page.waitForFunction(()=>document.querySelector('h1.success')||document.querySelector('[role=alert]'),{timeout:45000});if(await wallet.page.getByRole('alert').count())throw Error(await wallet.page.getByRole('alert').innerText());const txid=(await wallet.page.locator('.card.break').innerText()).trim();assert(/^[a-f0-9]{64}$/.test(txid));report.stages[name]={txid,submitted:true};await save();await until(async()=>{const s=await explorerTransactionStatus('flush',txid);return s.status==='confirmed';},name+' confirmation');return {txid,confirmed:true};}
try{
 const initial={sourceNative:await balance(source),sourceFrom:await balance(source,from),sourceTo:await balance(source,to),destinationTo:await balance(destination,to)};
 assert(initial.sourceFrom>=3000000n);assert(initial.sourceNative>=100000n);assert(await balance(destination)>=2000n);assert.equal(initial.sourceTo,0n,'Target asset already exists; inspect before spending');assert.equal(initial.destinationTo,0n);
 report.before=Object.fromEntries(Object.entries(initial).map(([k,v])=>[k,v.toString()]));await save();
 const sender=await open('runtime/live-wallet-test/profile','runtime/live-wallet-test/password',source),metadata=await api('/api/v1/assets/'+to);assert.equal(metadata.id,to);assert.equal(metadata.ticker,'SOON');
 const quote=await api('/api/v1/quote/swap?'+new URLSearchParams({from,to,amount:'3',slippage_bps:'100'}));assert.equal(quote.best.pools.length,2);assert.equal(quote.from_id,from);assert.equal(quote.to_id,to);report.route={pools:quote.best.pools,path:quote.best.path};await save();
 const swap=await stage('two-pool-swap',async()=>{await sender.page.locator('#swap').click();await sender.page.locator('#asset').selectOption(from);await sender.page.locator('#to-asset').selectOption(to);await sender.page.locator('#amount').fill('3');await sender.page.locator('#review').click();await sender.page.locator('#approve').waitFor();const minimum=await sender.page.locator('.split').filter({hasText:'Minimum received'}).locator('strong').innerText();const floor=units(minimum.split(' ')[0],metadata.decimals);report.minimumOutputUnits=floor.toString();await save();await sender.page.screenshot({path:'output/public-two-pool-review.png'});return approve(sender,'two-pool-swap');});
 const received=await until(async()=>{const n=await balance(source,to);return n>0n&&n;},'resolved routed output');assert(received>=BigInt(report.minimumOutputUnits));assert.equal(await balance(source,from),initial.sourceFrom-3000000n);report.receivedUnits=received.toString();await save();
 async function sendAll(wallet,name,address){await wallet.home();await wallet.page.locator('#send').click();await wallet.page.locator('#asset').selectOption(to);await wallet.page.locator('#to').fill(address);await wallet.page.locator('#amount').fill(decimal(received,metadata.decimals));await wallet.page.locator('#review').click();await wallet.page.locator('#approve').waitFor();return approve(wallet,name);}
 await stage('full-token-balance-send',()=>sendAll(sender,'full-token-balance-send',destination));
 await until(async()=>await balance(source,to)===0n&&await balance(destination,to)===received,'entire token balance received with no token change');
 const recipient=await open('runtime/betanet-receiver/profile','runtime/betanet-receiver/password',destination);
 await stage('full-token-balance-return',()=>sendAll(recipient,'full-token-balance-return',source));
 await until(async()=>await balance(source,to)===received&&await balance(destination,to)===0n,'exact returned balance and no duplicated tokens');
 await sender.home();const dashboard=await sender.call('DASHBOARD');assert.equal(dashboard.holdings.find(h=>h.asset_id===to)?.amount_units,received.toString());
 report.after={sourceNative:(await balance(source)).toString(),sourceFrom:(await balance(source,from)).toString(),sourceTo:received.toString(),destinationTo:'0'};assert(initial.sourceNative-BigInt(report.after.sourceNative)<50000n,'Native fees exceeded the small-run budget');
 report.finishedAt=new Date().toISOString();report.passed=true;await save();await writeFile('output/betanet-route.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:true,received:decimal(received,metadata.decimals)+' SOON',stages:report.stages,after:report.after}));
}finally{for(const c of contexts.reverse())await c.close();}
