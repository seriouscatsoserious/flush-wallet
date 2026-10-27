import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {randomBytes} from 'node:crypto';
import {environment,buildRegtest,until,pause} from './support/regtest-env.mjs';
import {sealConnection} from '../src/connection.js';
import {decimal,units} from '../src/core.js';
const env=await environment(),{rpc,balance,coins,config}=env;
const root=resolve('runtime/wallet-qa'),extension=root+'/extension';await mkdir(root,{recursive:true,mode:0o700});
const report={startedAt:new Date().toISOString(),network:'local regtest',checks:[],passed:false};
async function save(){await writeFile('output/wallet-qa.json',JSON.stringify(report,null,2)+'\n');}
async function check(name,fn){console.log('TEST:',name);try{const result=await fn();report.checks.push({name,status:'passed',...result});console.log('PASS:',name);await save();return result;}catch(error){report.checks.push({name,status:'failed',error:error.message});await save();throw error;}}
const options=directory=>({channel:'chromium',headless:true,viewport:{width:390,height:760},deviceScaleFactor:2,args:['--no-sandbox','--disable-extensions-except='+directory,'--load-extension='+directory]});
async function call(page,type,args={}){const response=await page.evaluate(message=>chrome.runtime.sendMessage(message),{type,...args});if(!response.ok)throw Error(response.error);return response.result;}
async function idle(page){await page.waitForFunction(()=>!document.querySelector('button:disabled'));}
async function home(page){await page.locator('#home').click();await page.getByText('Your tokens',{exact:true}).waitFor();await idle(page);}
async function unlock(page,password){await page.locator('#password').fill(password);await page.locator('#unlock').click();await page.locator('#password').waitFor({state:'hidden',timeout:45000});await idle(page);if(!await page.getByText('Your tokens',{exact:true}).isVisible())await home(page);}
async function refresh(page,password){await page.locator('#lock').click();await unlock(page,password);await home(page);return call(page,'DASHBOARD');}
async function reviewed(page){await until(async()=>await page.locator('#approve').count()||await page.getByRole('alert').count(),'review');if(await page.getByRole('alert').count())throw Error(await page.getByRole('alert').innerText());}
async function approve(page){await page.locator('#approve').click();await until(async()=>await page.getByRole('heading',{name:'Transaction sent',exact:true}).count()||await page.getByRole('alert').count(),'broadcast');if(await page.getByRole('alert').count())throw Error(await page.getByRole('alert').innerText());const txid=(await page.locator('.card.break').innerText()).trim();assert(/^[a-f0-9]{64}$/.test(txid));return txid;}
async function confirmed(chain,txid,index=0){return until(async()=>{const output=await rpc(chain,'gettxout',[txid,index,true]);return output?.confirmations>0?output:false;},'confirmed '+txid);}
let mnemonic,expected,browser,page,password,profile;
try{
 await check('Read recovery words from the existing funded wallet after password authentication',async()=>{
  const oldRoot=resolve('runtime/regtest-wallet'),oldExtension=oldRoot+'/extension';
  const profiles=(await readdir(oldRoot)).filter(name=>/^profile-\d+$/.test(name)).sort();
  const old=await chromium.launchPersistentContext(oldRoot+'/'+profiles.at(-1),options(oldExtension));
  try{const worker=old.serviceWorkers()[0]||await old.waitForEvent('serviceworker'),p=await old.newPage();await p.goto(`chrome-extension://${new URL(worker.url()).host}/popup.html`);const secret=await readFile(oldRoot+'/password','utf8');await unlock(p,secret);expected=await call(p,'STATE');const result=await call(p,'RECOVERY',{password:secret});mnemonic=result.mnemonic;assert(mnemonic.split(' ').length===12);return {address:expected.account.address};}finally{await old.close();}
 });
 await buildRegtest(extension);
 const initialTokens=await balance('flush',expected.account.address,(await rpc('flush','getasset',['FLUX'])).asset);
 const initialNative=await balance('flush',expected.account.address);
 password=randomBytes(24).toString('base64url');profile=root+'/restored-'+Date.now();
 await writeFile(root+'/session.json',JSON.stringify({profile,password}),{mode:0o600});
 browser=await chromium.launchPersistentContext(profile,options(extension));
 const worker=browser.serviceWorkers()[0]||await browser.waitForEvent('serviceworker'),id=new URL(worker.url()).host;
 await worker.evaluate(values=>chrome.storage.local.set(values),{connectionMode:'rpc',rpcConnection:await sealConnection(config,mnemonic)});
 page=await browser.newPage();await page.goto(`chrome-extension://${id}/popup.html`);
 await check('Restore a funded 12-word seed in a fresh Chrome profile',async()=>{
  await page.locator('#import').click();await page.locator('#seed').fill(mnemonic);await page.locator('#password').fill(password);await page.locator('#repeat').fill(password);await page.locator('#create').click();await page.getByText('Your tokens',{exact:true}).waitFor({timeout:45000});await idle(page);
  const restored=await call(page,'STATE');assert.equal(restored.account.address,expected.account.address);assert.deepEqual(restored.account.accounts,expected.account.accounts);
  const d=await call(page,'DASHBOARD');assert.equal(d.balance_sat,initialNative.toString());assert.equal(d.holdings[0].amount_units,initialTokens.toString());await page.screenshot({path:'output/qa-restored-wallet.png'});
  return {address:restored.account.address,tokenUnits:initialTokens.toString(),nativeSat:initialNative.toString()};
 });
 const flux=await rpc('flush','getasset',['FLUX']);
 await check('Receive native L1 ECX into the recovered browser wallet',async()=>{
  const address=expected.account.accounts.ecash.address,before=await balance('ecash',address);const txid=await rpc('ecash','sendtoaddress',[address,'2'],'miner');await confirmed('ecash',txid);
  const d=await refresh(page,password);assert.equal(BigInt(d.l1_balance_sat),before+200000000n);return {txid,receivedECX:'2',address};
 });
 for(const chain of ['ecash','flush'])await check('Send native ECX on '+chain+' with confirmed change',async()=>{
  const recipient=await rpc(chain,'getnewaddress',[],chain==='ecash'?'miner':'w'),address=expected.account.accounts[chain].address,before=await balance(chain,address);
  await home(page);await page.locator('#send').click();await page.locator('#asset').selectOption(chain==='ecash'?'L1_ECX':'ECX');await page.locator('#to').fill(recipient);await page.locator('#amount').fill('0.01');await page.locator('#review').click();await reviewed(page);const txid=await approve(page);const output=await confirmed(chain,txid);assert.equal(units(output.value),1000000n);const after=await balance(chain,address);const fee=before-after-1000000n;assert(fee>0n&&fee<100000n);await page.locator('#done').click();await page.getByText('Your tokens',{exact:true}).waitFor();return {txid,amountECX:'0.01',feeECX:decimal(fee)};
 });
 await check('Deposit generated L1 ECX into the exact browser receive address',async()=>{
  await home(page);await page.locator('#receive').click();await page.locator('#deposit').click();const destination=(await page.locator('.address').innerText()).trim();assert(destination.startsWith('s46_'+expected.account.address+'_'));
  const before=await balance('flush',expected.account.address);const deposit=await rpc('ecash','createsidechaindeposit',[46,destination,'0.2'],'miner');
  await until(async()=>await balance('flush',expected.account.address)===before+20000000n,'sidechain deposit credited',90000);
  const d=await refresh(page,password);assert.equal(d.balance_sat,(before+20000000n).toString());return {txid:deposit.txid,destination,receivedECX:'0.2'};
 });
 await check('Sell FLUX back to ECX through the wallet',async()=>{
  const address=expected.account.address,beforeNative=await balance('flush',address),beforeTokens=await balance('flush',address,flux.asset);
  await home(page);await page.locator('#swap').click();await page.locator('#asset').selectOption(flux.asset);await page.locator('#to-asset').selectOption('ECX');await page.locator('#amount').fill('50');await page.locator('#review').click();await reviewed(page);await page.screenshot({path:'output/qa-sell-review.png'});const txid=await approve(page);await confirmed('flush',txid,1);
  const afterNative=await balance('flush',address),afterTokens=await balance('flush',address,flux.asset);assert.equal(beforeTokens-afterTokens,5000n);assert(afterNative>beforeNative,'Selling tokens must increase ECX');await page.locator('#done').click();await page.getByText('Your tokens',{exact:true}).waitFor();await page.screenshot({path:'output/qa-after-sell.png'});return {txid,soldFLUX:'50',netReceivedECX:decimal(afterNative-beforeNative)};
 });
 report.passed=true;await save();console.log(JSON.stringify(report,null,2));
}finally{if(browser)await browser.close();}
