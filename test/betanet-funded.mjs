// Manual, opt-in real betanet transfers. Uses only the existing funded test profile.
// No fixtures or node services. Never run this in CI or against a user's mainnet wallet.
import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {randomBytes} from 'node:crypto';
import assert from 'node:assert/strict';
import {newMnemonic,account,encryptVault,decryptVault,decimal} from '../src/core.js';
import {explorerCoins,explorerTransactionStatus,explorerHistory} from '../src/api.js';
assert.equal(process.env.FLUSH_PUBLIC_BETANET_RUN,'1','Set FLUSH_PUBLIC_BETANET_RUN=1 for this explicitly funded betanet run');
const root='runtime/live-wallet-test',asset='617a6ad47771d6161d35023a90e7b5134ee6317c4f3d38475ec2cde540acb04f';
const expected='bflx1qvwgqgsq8g8mxjjvqgm7f6spcm0vj2vaaj7ftxr',journal=root+'/funded-run.json',receiverRoot='runtime/betanet-receiver';
let report;try{report=JSON.parse(await readFile(journal,'utf8'));}catch{report={startedAt:new Date().toISOString(),network:'public betanet slot 99',source:expected,stages:{},passed:false};}
assert(!report.active,'Previous stage may have submitted a transaction. Inspect its Activity before resuming: '+report.active);
if(report.passed){console.log('The funded run already completed; refusing to spend again.');process.exit(0);}
const save=()=>writeFile(journal,JSON.stringify(report,null,2)+'\n',{mode:0o600});
const contexts=[];let primary,receiver,restored,worker,site;
const launch=async profile=>{const extension=resolve('extension'),c=await chromium.launchPersistentContext(resolve(profile),{channel:'chromium',headless:true,viewport:{width:390,height:760},args:['--no-sandbox','--disable-extensions-except='+extension,'--load-extension='+extension]});contexts.push(c);return c;};
const call=async(page,type,args={})=>{const r=await page.evaluate(m=>chrome.runtime.sendMessage(m),{type,...args});assert(r.ok,r.error);return r.result;};
const pageFor=async c=>{const w=c.serviceWorkers()[0]||await c.waitForEvent('serviceworker'),p=await c.newPage();await p.goto(`chrome-extension://${new URL(w.url()).host}/popup.html`);return {worker:w,page:p};};
async function until(fn,label,timeout=180000){const end=Date.now()+timeout;while(Date.now()<end){try{const value=await fn();if(value)return value;}catch{}await new Promise(r=>setTimeout(r,3000));}throw Error('Timed out: '+label);}
const balance=async(addr,id)=>{const coins=await explorerCoins('flush',addr);return coins.utxos.filter(u=>id?u.token?.id===id&&!u.coinbase:!u.token).reduce((n,u)=>n+BigInt(id?u.token.amount_units:u.value_sat),0n);};
async function stage(name,fn){if(report.stages[name])return report.stages[name];report.active=name;await save();console.log('START '+name);const result=await fn();report.stages[name]=result;delete report.active;await save();console.log(JSON.stringify({stage:name,...result}));return result;}
async function approve(name,page){await page.locator('#approve').click();await page.waitForFunction(()=>document.querySelector('h1.success')||document.querySelector('[role=alert]'),{timeout:45000});const error=page.getByRole('alert');if(await error.count())throw Error(await error.innerText());const txid=(await page.locator('.card.break').innerText()).trim();assert(/^[a-f0-9]{64}$/.test(txid));report.stages[name]={txid,submitted:true};await save();await until(async()=>{const status=await explorerTransactionStatus('flush',txid);return status.status==='confirmed'&&status;},name+' confirmation');return {txid,confirmed:true};}
async function transfer(name,page,id,to,amount){await page.reload();await page.getByText('Your tokens',{exact:true}).waitFor({timeout:45000});await page.locator('#send').click();await page.locator('#asset').selectOption(id);await page.locator('#to').fill(to);await page.locator('#amount').fill(amount);await page.locator('#review').click();await page.locator('#approve').waitFor();await page.screenshot({path:'output/public-'+name+'-review.png'});return approve(name,page);}
try{
 primary=await launch(root+'/profile');const entry=await pageFor(primary);worker=entry.worker;const wallet=entry.page,password=await readFile(root+'/password','utf8');
 let state=await call(wallet,'STATE');assert.equal(state.account?.address,expected,'This is not the explicitly funded test wallet');if(!state.unlocked){await wallet.locator('#password').fill(password);await wallet.locator('#unlock').click();}
 await wallet.getByText('Your tokens',{exact:true}).waitFor({timeout:45000});assert.equal((await call(wallet,'STATE')).connectionMode,'explorer');
 const phrase=(await call(wallet,'RECOVERY',{password})).mnemonic;const starting=await balance(expected);assert(starting>=1000000n,'Not enough betanet coins for the capped run');report.startingNativeSat=starting.toString();await save();
 await mkdir(receiverRoot,{recursive:true});let receiverVault,receiverPassword;
 try{receiverVault=JSON.parse(await readFile(receiverRoot+'/vault.json','utf8'));receiverPassword=await readFile(receiverRoot+'/password','utf8');}catch{receiverPassword=randomBytes(24).toString('base64url');receiverVault=await encryptVault(newMnemonic(),receiverPassword);await writeFile(receiverRoot+'/vault.json',JSON.stringify(receiverVault),{mode:0o600});await writeFile(receiverRoot+'/password',receiverPassword,{mode:0o600});}
 const receiverPhrase=await decryptVault(receiverVault,receiverPassword),target=account(receiverPhrase).address;report.recipient=target;await save();
 site=await primary.newPage();await site.goto('https://flush.markets/token/'+asset,{waitUntil:'networkidle'});
 if(await site.getByRole('button',{name:'Connect',exact:true}).count()){
  await site.getByRole('button',{name:'Connect',exact:true}).first().click();const opening=primary.waitForEvent('page');await site.getByRole('button',{name:'Use the browser extension',exact:true}).click();const approval=await opening;await approval.locator('#approve').click();await approval.getByRole('heading',{name:'Connected',exact:true}).waitFor();await approval.close();
 }
 await until(()=>site.evaluate(address=>localStorage.getItem('flush.address')===address,expected),'site connection');
 async function trade(name,side,amount){await site.reload();await site.locator('#trade').getByRole('button',{name:side==='buy'?'Buy':'Sell',exact:true}).click();await site.locator('#amt').fill(amount);const button=site.getByRole('button',{name:(side==='buy'?'Buy':'Sell')+' FLUSH in the Flush app',exact:true});await until(()=>button.isEnabled(),'site '+side+' quote',45000);
  const opening=primary.waitForEvent('page');await button.click();const approval=await opening;await approval.locator('#approve').waitFor();const pending=(await worker.evaluate(()=>chrome.storage.session.get('pending'))).pending;assert(pending.uri.startsWith('flush:'+side+'?'));await approval.screenshot({path:'output/public-'+name+'-review.png'});const result=await approve(name,approval);await approval.close();return {...result,requestedAmount:amount,websiteBuilt:true};}
 await stage('launch-buy',()=>trade('launch-buy','buy','0.001'));
 const bought=await until(async()=>{const n=await balance(expected,asset);return n>0n&&n;},'confirmed bought tokens');report.boughtTokenUnits=bought.toString();assert(bought>=35000000n);await save();
 await stage('token-send',()=>transfer('token-send',wallet,asset,target,'5'));
 await until(async()=>await balance(target,asset)===5000000n,'exact recipient token balance');
 await stage('recipient-fee-funding',()=>transfer('recipient-fee-funding',wallet,'ECX',target,'0.00005'));
 receiver=await launch(receiverRoot+'/profile');const rp=(await pageFor(receiver)).page;let rs=await call(rp,'STATE');if(!rs.account)await call(rp,'CREATE',{mnemonic:receiverPhrase,password:receiverPassword,imported:true});else if(!rs.unlocked)await call(rp,'UNLOCK',{password:receiverPassword});await rp.reload();await rp.getByText('Your tokens',{exact:true}).waitFor({timeout:45000});assert.equal((await call(rp,'STATE')).account.address,target);
 await stage('token-return',()=>transfer('token-return',rp,asset,expected,'2'));
 await until(async()=>await balance(target,asset)===3000000n,'exact remaining recipient token balance');
 await stage('launch-sell',()=>trade('launch-sell','sell','30'));
 const expectedTokens=bought-33000000n;await until(async()=>await balance(expected,asset)===expectedTokens,'exact final original token balance');
 restored=await launch(root+'/restored-public-profile');const restoredPage=(await pageFor(restored)).page;const restoredState=await call(restoredPage,'STATE');if(!restoredState.account)await call(restoredPage,'CREATE',{mnemonic:phrase,password,imported:true});else if(!restoredState.unlocked)await call(restoredPage,'UNLOCK',{password});await restoredPage.reload();await restoredPage.getByText('Your tokens',{exact:true}).waitFor({timeout:45000});
 const recovered=await call(restoredPage,'STATE'),original=await call(wallet,'STATE');assert.deepEqual(recovered.account.accounts,original.account.accounts);const dash=await call(restoredPage,'DASHBOARD');assert.equal(dash.holdings.find(h=>h.asset_id===asset)?.amount_units,expectedTokens.toString());
 report.recovery={bothAddressesMatch:true,tokenUnits:expectedTokens.toString(),nativeSat:dash.balance_sat};report.history=(await explorerHistory('flush',expected)).map(row=>({txid:row.txid,status:row.status,tokenDetailsUnavailable:row.tokenDetailsUnavailable,changes:row.changes,fee_sat:row.fee_sat}));report.finalNativeSat=(await balance(expected)).toString();report.finalTokenUnits=expectedTokens.toString();report.finishedAt=new Date().toISOString();report.passed=true;await save();await writeFile('output/betanet-funded.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:true,stages:report.stages,recovery:report.recovery}));
}finally{for(const context of contexts.reverse())await context.close();}
