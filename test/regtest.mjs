// Real-node integration test. Run the official Flush playground first; see README.
// Only the compiled test copy changes network parameters. Production code stays betanet-only.
import {chromium} from 'playwright';
import {build} from 'esbuild';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {randomBytes} from 'node:crypto';
import {sealConnection} from '../src/connection.js';
import {parseRpcJSON} from '../src/rpc.js';

const playground=resolve(process.env.FLUSH_PLAYGROUND_DIR||'runtime/regtest-playground');
const runtime=resolve('runtime/regtest-wallet'),extension=runtime+'/extension';
const state=JSON.parse(await readFile(playground+'/state.json','utf8'));
const auth='Basic '+Buffer.from('playground:playground').toString('base64');
const urls={ecash:'http://127.0.0.1:'+state.ports.main_rpc+'/',flush:'http://127.0.0.1:'+state.ports.rpc0+'/'};
const REGTEST_GENESIS='0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206';
async function rpc(chain,method,params=[],wallet=''){
 const response=await fetch(urls[chain]+(wallet?'wallet/'+wallet:''),{method:'POST',headers:{Authorization:auth,'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params}),signal:AbortSignal.timeout(15000)});
 const result=parseRpcJSON(await response.text());if(result.error)throw Error(method+': '+result.error.message);return result.result;
}
async function until(check,label,timeout=60000){const start=Date.now();while(Date.now()-start<timeout){const value=await check();if(value)return value;await new Promise(resolve=>setTimeout(resolve,500));}throw Error('Timed out: '+label);}
for(const chain of ['ecash','flush']){
 assert.equal((await rpc(chain,'getblockchaininfo')).chain,'regtest','Refusing to use a real network');
 assert.equal(await rpc(chain,'getblockhash',[0]),REGTEST_GENESIS,'Unexpected regtest genesis');
}
assert.equal((await rpc('flush','getmainchaininfo')).slot,46);
const asset=await rpc('flush','getasset',['FLUX']);assert.equal(asset.name,'FLUX');
await mkdir(runtime,{recursive:true,mode:0o700});await mkdir('output',{recursive:true});
await cp(resolve('extension'),extension,{recursive:true});
const manifest=JSON.parse(await readFile(extension+'/manifest.json','utf8'));
manifest.name='Flush Wallet — LOCAL REGTEST';manifest.host_permissions=['http://127.0.0.1/*'];
manifest.optional_host_permissions=['http://127.0.0.1/*'];delete manifest.content_scripts;
await writeFile(extension+'/manifest.json',JSON.stringify(manifest,null,2)+'\n');
function replace(source,find,value){assert(source.includes(find),'Test-build anchor missing: '+find);return source.replace(find,value);}
const regtestPlugin={name:'local-regtest-only',setup(builder){
 builder.onLoad({filter:/\/src\/(core|rpc|popup)\.js$/},async args=>{
  let source=await readFile(args.path,'utf8');
  if(args.path.endsWith('/core.js')){
   source=replace(source,"bech32:'bflx',bip32:{public:0x0488b21e,private:0x0488ade4},pubKeyHash:28,scriptHash:88,wif:156","bech32:'rsc',bip32:{public:0x043587cf,private:0x04358394},pubKeyHash:111,scriptHash:196,wif:239");
   source=replace(source,"bech32:'bc',bip32:{public:0x0488b21e,private:0x0488ade4},pubKeyHash:0,scriptHash:5,wif:128","bech32:'rchn',bip32:{public:0x043587cf,private:0x04358394},pubKeyHash:111,scriptHash:196,wif:239");
   source=source.replaceAll("'bflx1'","'rsc1'").replaceAll("'s99_'","'s46_'");
  }else if(args.path.endsWith('/rpc.js')){
   source=replace(source,"height:967680,hash:'00000000000000030101ba5cfea54b22becc79f95dc6040beb76e01dd9d04042'",`height:0,hash:'${REGTEST_GENESIS}'`);
   source=replace(source,"'04dfb01bef61e44d679132f9e830719c64241f7052880418a350ff6d3c90b561'",`'${REGTEST_GENESIS}'`);
   source=replace(source,"!['main','ecashbeta'].includes(l1.chain)","l1.chain!=='regtest'");
   source=source.replaceAll("'ecashbeta'","'regtest'").replaceAll('slot!==99','slot!==46').replaceAll('slot:99','slot:46');
  }else{
   source=source.replaceAll('Betanet','Local regtest').replaceAll('betanet','regtest').replaceAll('bflx1','rsc1').replaceAll('slot 99','slot 46');
  }
  return {contents:source,loader:'js',resolveDir:dirname(args.path)};
 });
}};
for(const name of ['background','popup'])await build({entryPoints:['src/'+name+'.js'],bundle:true,outfile:extension+'/'+name+'.js',format:name==='background'?'esm':'iife',platform:'browser',target:'chrome111',plugins:[regtestPlugin]});
await build({entryPoints:['src/core.js'],bundle:true,outfile:runtime+'/core.mjs',format:'esm',platform:'node',plugins:[regtestPlugin]});
const core=await import(pathToFileURL(runtime+'/core.mjs').href);
const mnemonic=core.newMnemonic(),password=randomBytes(24).toString('base64url');
const vault=await core.encryptVault(mnemonic,password),address=vault.address;
const config={ecash:{url:urls.ecash,auth:'playground:playground'},flush:{url:urls.flush,auth:'playground:playground'}};
const encryptedConnection=await sealConnection(config,mnemonic);
await writeFile(runtime+'/password',password,{mode:0o600});
console.log('Regtest wallet:',address);
const fundingTx=await rpc('flush','sendtoaddress',[address,1],'w');
await until(async()=>((await rpc('flush','gettransaction',[fundingTx],'w')).confirmations>0),'wallet funding confirmed');
console.log('Funded browser wallet with 1 generated test ECX.');
const browser=await chromium.launchPersistentContext(runtime+'/profile-'+Date.now(),{channel:'chromium',headless:true,viewport:{width:390,height:760},deviceScaleFactor:2,args:['--no-sandbox','--disable-extensions-except='+extension,'--load-extension='+extension]});
const requests=[],errors=[];browser.on('request',request=>{if(/^https?:/.test(request.url()))requests.push({url:request.url(),method:request.method(),rpc:request.postDataJSON()?.method});});browser.on('page',page=>page.on('pageerror',error=>errors.push(error.message)));
try{
 const worker=browser.serviceWorkers()[0]||await browser.waitForEvent('serviceworker');
 await worker.evaluate(values=>chrome.storage.local.set(values),{vault,connectionMode:'rpc',rpcConnection:encryptedConnection});
 const id=new URL(worker.url()).host,page=await browser.newPage();
 await page.goto(`chrome-extension://${id}/popup.html`);await page.locator('#password').fill(password);await page.locator('#unlock').click();
 await page.getByText('Your tokens',{exact:true}).waitFor({timeout:45000});
 await page.screenshot({path:'output/regtest-wallet-funded.png'});
 const initial=await page.evaluate(()=>chrome.runtime.sendMessage({type:'DASHBOARD'}));assert(initial.ok,initial.error);assert.equal(initial.result.balance_sat,'100000000');
 assert.equal(initial.result.holdings.length,0);
 await page.locator('#swap').click();await page.locator('#to-asset').selectOption(asset.asset);await page.locator('#amount').fill('0.1');await page.locator('#review').click();
 await until(async()=>await page.locator('#approve').count()||await page.getByRole('alert').count(),'swap review available');
 if(await page.getByRole('alert').count())throw Error(await page.getByRole('alert').innerText());
 const review=await page.locator('.card .split').evaluateAll(rows=>rows.map(row=>({label:row.querySelector('span')?.textContent,value:row.querySelector('strong')?.textContent})));
 assert.equal(review.find(row=>row.label==='You pay')?.value,'0.1 ECX');
 const minimum=review.find(row=>row.label==='Minimum received')?.value;assert(minimum?.endsWith(' FLUX'));assert(Number(minimum.split(' ')[0])>0);
 await page.screenshot({path:'output/regtest-swap-review.png'});
 await page.locator('#approve').click();
 await until(async()=>await page.getByRole('heading',{name:'Transaction sent',exact:true}).count()||await page.getByRole('alert').count(),'swap broadcast');
 if(await page.getByRole('alert').count())throw Error(await page.getByRole('alert').innerText());
 const swapTx=(await page.locator('.card.break').innerText()).trim();assert(/^[a-f0-9]{64}$/.test(swapTx));
 await page.screenshot({path:'output/regtest-swap-sent.png'});
 console.log('Browser signed and broadcast swap:',swapTx);
 const received=await until(async()=>{
  const scan=await rpc('flush','scantxoutset',['start',['addr('+address+')']]);
  for(const coin of scan.unspents){const output=await rpc('flush','gettxout',[coin.txid,coin.vout,true]);if(output?.token?.id===asset.asset&&BigInt(output.token.amount_units)>0n)return {...coin,...output};}
  return false;
 },'confirmed token output');
 assert.equal(received.txid,swapTx);assert(received.confirmations>0);assert(BigInt(received.token.amount_units)>=core.units(minimum.split(' ')[0],asset.decimals));
 // Wait for the backend's short UTXO cache, then verify the actual UI shows the received tokens.
 await new Promise(resolve=>setTimeout(resolve,8500));await page.locator('#done').click();await page.locator('[data-token="'+asset.asset+'"]').waitFor();
 await page.screenshot({path:'output/regtest-wallet-tokens.png'});
 const dashboard=await page.evaluate(()=>chrome.runtime.sendMessage({type:'DASHBOARD'}));assert(dashboard.ok,dashboard.error);
 const holding=dashboard.result.holdings.find(item=>item.asset_id===asset.asset);assert.equal(holding.amount_units,received.token.amount_units);
 assert(requests.every(request=>Object.values(urls).includes(request.url)),'External requests in local regtest');assert.deepEqual(errors,[]);
 assert.equal(requests.filter(request=>request.rpc==='sendrawtransaction').length,1,'Exactly one wallet swap broadcast');
 const report={passed:true,network:'local regtest',slot:46,checkedAt:new Date().toISOString(),address,fundingTx,swapTx,paidECX:'0.1',token:'FLUX',tokenId:asset.asset,receivedUnits:received.token.amount_units,received:core.decimal(received.token.amount_units,asset.decimals),minimum,confirmations:received.confirmations,balanceAfterSat:dashboard.result.balance_sat,externalRequests:0,realNodeBroadcast:true,mockedResponses:false,testBuild:'Network/address parameters only; production stays betanet-only',review};
 await writeFile('output/regtest-swap.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
