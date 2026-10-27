// Follow the real regtest swap by sending 100 of its FLUX back to the funding wallet.
// Requires the original playground data and browser profile; never uses a public network.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {parseRpcJSON} from '../src/rpc.js';
import {decimal,units} from '../src/core.js';

const root=resolve('runtime/regtest-wallet'),extension=root+'/extension';
const playground=resolve(process.env.FLUSH_PLAYGROUND_DIR||'runtime/regtest-playground');
const state=JSON.parse(await readFile(playground+'/state.json','utf8'));
const previous=JSON.parse(await readFile('output/regtest-swap.json','utf8'));
assert(previous.passed&&previous.network==='local regtest');
const urls={ecash:'http://127.0.0.1:'+state.ports.main_rpc+'/',flush:'http://127.0.0.1:'+state.ports.rpc0+'/'};
const auth='Basic '+Buffer.from('playground:playground').toString('base64');
const genesis='0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206';
async function rpc(chain,method,params=[],wallet=''){
 const response=await fetch(urls[chain]+(wallet?'wallet/'+wallet:''),{method:'POST',headers:{Authorization:auth,'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params}),signal:AbortSignal.timeout(15000)});
 const result=parseRpcJSON(await response.text());if(result.error)throw Error(method+': '+result.error.message);return result.result;
}
async function until(check,label){const start=Date.now();while(Date.now()-start<60000){const value=await check();if(value)return value;await new Promise(resolve=>setTimeout(resolve,500));}throw Error('Timed out: '+label);}
for(const chain of ['ecash','flush']){
 assert.equal((await rpc(chain,'getblockchaininfo')).chain,'regtest','Refusing to use a real network');
 assert.equal(await rpc(chain,'getblockhash',[0]),genesis);
}
assert.equal((await rpc('flush','getmainchaininfo')).slot,46);
const recipient=await rpc('flush','getnewaddress',['browser-wallet-return-test'],'w');
assert((await rpc('flush','getaddressinfo',[recipient],'w')).ismine,'Recipient must belong to the original funding wallet');
const amount='100',sentUnits=units(amount,2);
async function tokenBalance(address){
 const scan=await rpc('flush','scantxoutset',['start',['addr('+address+')']]);let total=0n;
 for(const coin of scan.unspents){const output=await rpc('flush','gettxout',[coin.txid,coin.vout,true]);if(output?.token?.id===previous.tokenId)total+=BigInt(output.token.amount_units);}
 return total;
}
assert.equal(await tokenBalance(previous.address),BigInt(previous.receivedUnits),'Original swap balance changed; refuse an accidental repeat');
assert.equal(await tokenBalance(recipient),0n);
const profiles=(await readdir(root)).filter(file=>/^profile-\d+$/.test(file)).sort();assert(profiles.length);
const password=await readFile(root+'/password','utf8');
const browser=await chromium.launchPersistentContext(root+'/'+profiles.at(-1),{channel:'chromium',headless:true,viewport:{width:390,height:760},deviceScaleFactor:2,args:['--no-sandbox','--disable-extensions-except='+extension,'--load-extension='+extension]});
const requests=[],errors=[];browser.on('request',request=>{if(/^https?:/.test(request.url()))requests.push({url:request.url(),rpc:request.postDataJSON()?.method});});browser.on('page',page=>page.on('pageerror',error=>errors.push(error.message)));
try{
 const worker=browser.serviceWorkers()[0]||await browser.waitForEvent('serviceworker'),id=new URL(worker.url()).host,page=await browser.newPage();
 await page.goto(`chrome-extension://${id}/popup.html`);await page.locator('#password').fill(password);await page.locator('#unlock').click();await page.getByText('Your tokens',{exact:true}).waitFor({timeout:45000});
 const status=await page.evaluate(()=>chrome.runtime.sendMessage({type:'STATE'}));assert.equal(status.result.account.address,previous.address);
 const before=await page.evaluate(()=>chrome.runtime.sendMessage({type:'DASHBOARD'}));assert(before.ok,before.error);assert.equal(before.result.holdings.find(item=>item.asset_id===previous.tokenId)?.amount_units,previous.receivedUnits);
 await page.locator('#send').click();await page.locator('#asset').selectOption(previous.tokenId);await page.locator('#to').fill(recipient);await page.locator('#amount').fill(amount);await page.locator('#review').click();
 await until(async()=>await page.locator('#approve').count()||await page.getByRole('alert').count(),'transfer review');
 if(await page.getByRole('alert').count())throw Error(await page.getByRole('alert').innerText());
 const review=await page.locator('.card').innerText();assert(review.includes('100 FLUX'));assert(review.includes(recipient));assert(review.includes('Flush regtest'));
 await page.mouse.move(0,0);await page.screenshot({path:'output/regtest-send-review.png'});
 await page.locator('#approve').click();
 await until(async()=>await page.getByRole('heading',{name:'Transaction sent',exact:true}).count()||await page.getByRole('alert').count(),'token transfer broadcast');
 if(await page.getByRole('alert').count())throw Error(await page.getByRole('alert').innerText());
 const txid=(await page.locator('.card.break').innerText()).trim();assert(/^[a-f0-9]{64}$/.test(txid));console.log('Browser signed token transfer:',txid);
 await page.screenshot({path:'output/regtest-send-sent.png'});
 const received=await until(async()=>{const output=await rpc('flush','gettxout',[txid,0,true]);return output?.confirmations>0&&output.token?.id===previous.tokenId?output:false;},'confirmed token receipt');
 assert.equal(received.token.amount_units,sentUnits.toString());
 const senderAfter=await tokenBalance(previous.address),recipientAfter=await tokenBalance(recipient);
 assert.equal(recipientAfter,sentUnits);assert.equal(senderAfter,BigInt(previous.receivedUnits)-sentUnits);assert.equal(senderAfter+recipientAfter,BigInt(previous.receivedUnits));
 assert.equal(await rpc('flush','gettxout',[previous.swapTx,0,true]),null,'Original token output was spent');
 await page.locator('#done').click();await page.locator('[data-token="'+previous.tokenId+'"]').waitFor();
 const after=await page.evaluate(()=>chrome.runtime.sendMessage({type:'DASHBOARD'}));assert(after.ok,after.error);assert.equal(after.result.holdings.find(item=>item.asset_id===previous.tokenId)?.amount_units,senderAfter.toString());
 const feeSat=BigInt(before.result.balance_sat)-BigInt(after.result.balance_sat);assert(feeSat>0n&&feeSat<=100000n);
 await page.mouse.move(0,0);await page.screenshot({path:'output/regtest-wallet-after-send.png'});
 assert(requests.every(request=>Object.values(urls).includes(request.url)));assert.equal(requests.filter(request=>request.rpc==='sendrawtransaction').length,1);assert.deepEqual(errors,[]);
 const report={passed:true,network:'local regtest',slot:46,checkedAt:new Date().toISOString(),txid,token:'FLUX',tokenId:previous.tokenId,amount,sender:previous.address,recipient,recipientControlledBy:'Original playground funding wallet',senderTokensBefore:previous.received,senderTokensAfter:decimal(senderAfter,2),recipientTokensAfter:decimal(recipientAfter,2),feeECX:decimal(feeSat),nativeBalanceAfter:decimal(after.result.balance_sat),confirmations:received.confirmations,originalSwapOutputSpent:true,tokenUnitsConserved:true,externalRequests:0,realNodeBroadcast:true,mockedResponses:false};
 await writeFile('output/regtest-send.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
