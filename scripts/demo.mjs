import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,readFile,writeFile,copyFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {account,hex,signPlan} from '../src/core.js';

// Public BIP39 test vector. Never fund any address shown in these demos.
const phrase='abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const password='public demo password 123';
const accounts={ecash:account(phrase,'ecash'),flush:account(phrase)};
const recipient=account('legal winner thank year wave sausage worth useful legal winner thank yellow');
const asset='44'.repeat(32),pool='55'.repeat(32);
const output=resolve('docs/demo'),screens=output+'/screens';
await mkdir(screens,{recursive:true});
await mkdir('docs/assets/fonts',{recursive:true});
for(const file of ['barlow-300.woff2','barlow-400.woff2','barlow-500.woff2','jetbrains-mono.woff2'])await copyFile('assets/fonts/'+file,'docs/assets/fonts/'+file);
const version=JSON.parse(await readFile('package.json','utf8')).version;
const profile=await mkdtemp(tmpdir()+'/flush-demo-');
const browser=await chromium.launchPersistentContext(profile,{
 channel:'chromium',headless:true,viewport:{width:390,height:760},deviceScaleFactor:2,
 locale:'en-US',timezoneId:'UTC',
 args:['--no-sandbox','--disable-extensions-except='+resolve('extension'),'--load-extension='+resolve('extension')]
});
const frames=[],errors=[],requests=[];
browser.on('page',p=>p.on('pageerror',err=>errors.push(err.message)));
browser.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
try{
 const worker=browser.serviceWorkers()[0]||await browser.waitForEvent('serviceworker');
 const extensionId=new URL(worker.url()).host;
 const logo=(await readFile('test/fixtures/token-logo.png')).toString('base64');
 await browser.route('https://explorer.blockfab.org/**',route=>{
  if(new URL(route.request().url()).pathname.startsWith('/betanet/flush/api/v1/flush/logo/'))return route.fulfill({contentType:'image/png',body:Buffer.from(logo,'base64')});
  return route.abort('blockedbyclient');
 });
 // Intercept data in the extension worker. No node, API server, or live broadcast.
 await worker.evaluate(({scripts,addresses,logo,asset,pool})=>{
  globalThis.__demoRequests=[];globalThis.__expectedBroadcast=null;
  const assetInfo={id:asset,ticker:'FLUSH',display_name:'Flush',decimals:6,info:'An asset on Flush.',has_logo:true};
  const nativeIds={ecash:'11'.repeat(32),flush:'22'.repeat(32)},tokenId='33'.repeat(32);
  const heights={ecash:978544,flush:19231};
  const nativeValues={ecash:1250000000,flush:325000000};
  const status={confirmed:true,block_height:19000,block_time:1793059200};
  const response=(body,plain=false)=>new Response(plain?String(body):JSON.stringify(body),{status:200,headers:{'content-type':plain?'text/plain':'application/json'}});
  chrome.permissions.request=async()=>{throw Error('Demo must not request node access');};
  globalThis.fetch=async(input,options={})=>{
   const url=new URL(String(input));globalThis.__demoRequests.push({url:url.href,method:options.method||'GET'});
   if(url.hostname==='flush.markets'&&url.pathname==='/api/v1/quote/swap')return response({amount_out:'250',amount_out_units:'250000000',min_out_units:'247500000',best:{pools:[pool],path_ids:[null,asset]}});
   if(url.hostname!=='explorer.blockfab.org')throw Error('Demo blocked unexpected host: '+url.hostname);
   const chain=url.pathname.startsWith('/betanet/flush/')?'flush':'ecash';
   const path=url.pathname.replace(chain==='flush'?'/betanet/flush':'/betanet','');
   if(path==='/api/blocks/tip/height')return response(heights[chain],true);
   if(path==='/api/v1/chain')return response({network:'ecashbeta',mainchain:true});
   if(path==='/api/v1/flush/rpc/getblockchaininfo')return response({chain:'ecashbeta',blocks:heights.flush,headers:heights.flush,initialblockdownload:false});
   if(path.startsWith('/api/v1/flush/logo/'))return new Response(Uint8Array.from(atob(logo),c=>c.charCodeAt(0)),{headers:{'content-type':'image/png'}});
   if(path==='/api/v1/flush/market/assets')return response({items:[assetInfo]});
   if(path==='/api/v1/flush/market/assets/'+asset)return response(assetInfo);
   if(path.startsWith('/api/v1/flush/market/addresses/'))return response({items:[{kind:'asset',asset_id:asset,ticker:'FLUSH',amount_units:'2750000000'}]});
   if(path==='/api/v1/flush/market/pools/'+pool)return response({id:pool,asset_a_id:null,asset_b_id:asset});
   if(path.endsWith('/utxo'))return response([
    {txid:nativeIds[chain],vout:0,value:nativeValues[chain],status,token:null},
    ...(chain==='flush'?[{txid:tokenId,vout:0,value:0,status,token:{kind:0,id:asset,amount_units:'2750000000'}}]:[])
   ]);
   if(path.endsWith('/txs'))return response([{txid:nativeIds[chain],vin:[{is_coinbase:false}],vout:[{scriptpubkey_address:addresses[chain],value:nativeValues[chain]}],status}]);
   if(path.startsWith('/api/address/'))return response({address:addresses[chain],chain_stats:{funded_txo_sum:nativeValues[chain],spent_txo_sum:0},mempool_stats:{funded_txo_sum:0,spent_txo_sum:0}});
   if(path.startsWith('/api/tx/')){const txid=path.split('/').at(-1);return response({txid,vin:[{is_coinbase:false}],vout:[{scriptpubkey:scripts[chain],scriptpubkey_address:addresses[chain],value:txid===tokenId?0:nativeValues[chain]}],status});}
   if(path==='/api/tx'&&options.method==='POST'){
    if(!globalThis.__expectedBroadcast||options.body!==globalThis.__expectedBroadcast.hex)throw Error('Unexpected demo broadcast');
    return response(globalThis.__expectedBroadcast.txid,true);
   }
   throw Error('Missing demo fixture: '+url.pathname);
  };
 },{scripts:{ecash:hex(accounts.ecash.script),flush:hex(accounts.flush.script)},addresses:{ecash:accounts.ecash.address,flush:accounts.flush.address},logo,asset,pool});
 const p=await browser.newPage();
 await p.goto(`chrome-extension://${extensionId}/popup.html`);
 await p.evaluate(({phrase})=>{
  const send=chrome.runtime.sendMessage.bind(chrome.runtime);
  chrome.runtime.sendMessage=(message,...rest)=>message.type==='GENERATE'?Promise.resolve({ok:true,result:{mnemonic:phrase}}):send(message,...rest);
 },{phrase});
 async function capture(number,title,category,page=p){
  await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>Promise.all([...document.images].map(img=>img.decode().catch(()=>{}))));
  await page.mouse.move(0,0);await page.evaluate(()=>document.activeElement?.blur());
  await page.evaluate(()=>document.querySelector('#toast')?.style.setProperty('display','none'));
  const height=await page.evaluate(()=>Math.max(760,document.documentElement.scrollHeight));
  await page.setViewportSize({width:390,height});await page.evaluate(()=>window.scrollTo(0,0));
  const name=String(number).padStart(2,'0')+'-'+title.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.png';
  await page.screenshot({path:screens+'/'+name,animations:'disabled'});
  frames.push({number,title,category,file:'screens/'+name,width:390,height,pixelWidth:780,pixelHeight:height*2});
  await page.setViewportSize({width:390,height:760});
 }
 async function idle(){await p.waitForFunction(()=>!document.querySelector('button:disabled'));}
 async function home(){await p.locator('#home').click();await p.getByText('Your tokens',{exact:true}).waitFor();await idle();}
 async function settings(){await p.locator('#settings').click();await p.getByRole('heading',{name:'Settings',exact:true}).waitFor();await idle();}
 await p.locator('#new').waitFor();await capture(1,'Welcome','Onboarding');
 await p.locator('#new').click();await capture(2,'Save recovery phrase','Onboarding');
 await p.locator('#continue').click();await capture(3,'Confirm recovery words','Onboarding');
 await p.locator('#back').click();await p.locator('#back').click();await p.locator('#import').click();await capture(4,'Import wallet','Onboarding');
 await p.locator('#seed').fill(phrase);await p.locator('#password').fill(password);await p.locator('#repeat').fill(password);await p.locator('#create').click();
 await p.getByText('Your tokens',{exact:true}).waitFor();await idle();await capture(6,'Wallet overview','Wallet');
 await p.locator('#lock').click();await p.locator('#unlock').waitFor();await capture(5,'Unlock wallet','Onboarding');
 await p.locator('#password').fill(password);await p.locator('#unlock').click();await p.getByText('Your tokens',{exact:true}).waitFor();await idle();
 await p.locator('[data-native="ecash"]').click();await capture(7,'eCash account','Wallet');
 await home();await p.locator('[data-token]').click();await capture(8,'Token account','Wallet');
 await p.locator('#receive').click();await p.locator('#qr').waitFor();
 await p.locator('#l1').click();await capture(9,'Receive eCash','Receive');
 await p.locator('#native').click();await capture(10,'Receive on Flush','Receive');
 await p.locator('#deposit').click();await capture(11,'Deposit to Flush','Receive');
 await home();await p.locator('#send').click();await p.locator('#to').fill(recipient.address);await p.locator('#amount').fill('0.05');await capture(12,'Send ECX','Send');
 await p.locator('#asset').selectOption(asset);await p.locator('#amount').fill('100');await capture(13,'Send a token','Send');
 await p.locator('#asset').selectOption('ECX');await p.locator('#amount').fill('0.05');
 const prepared=await p.evaluate(to=>chrome.runtime.sendMessage({type:'PREPARE_SEND',chain:'flush',asset:'ECX',to,amount:'0.05'}),recipient.address);assert(prepared.ok,prepared.error);
 const signed=signPlan(prepared.result,phrase);await worker.evaluate(signed=>{globalThis.__expectedBroadcast=signed;},signed);
 await p.locator('#review').click();await p.locator('#approve').waitFor();await capture(14,'Review transfer','Send');
 await p.locator('#approve').click();await p.getByRole('heading',{name:'Transaction sent',exact:true}).waitFor();await capture(15,'Transfer complete','Send');
 await p.locator('#done').click();await p.locator('#swap').click();await p.locator('#amount').fill('0.25');await capture(16,'Swap','Trade');
 await p.locator('#review').click();await p.locator('#approve').waitFor();await capture(17,'Review swap','Trade');
 await p.locator('#cancel').click();await p.locator('#history').click();await p.getByRole('heading',{name:'Activity',exact:true}).waitFor();await p.locator('.loading').waitFor({state:'hidden'});await idle();await capture(18,'Activity','Wallet');
 await settings();await capture(19,'Settings','Settings');
 await p.locator('#recovery').click();await capture(20,'Reveal recovery phrase','Settings');
 await p.locator('#password').fill(password);await p.locator('#reveal').click();await p.locator('#hide').waitFor();await capture(21,'Recovery phrase','Settings');
 await p.locator('#hide').click();await p.locator('#advanced summary').click();await p.locator('#connection').click();await p.locator('#mode-explorer').waitFor();await capture(22,'Explorer connection','Advanced');
 await p.locator('#mode-rpc').check();await p.locator('#ecash-url').fill('http://127.0.0.1:8332');await p.locator('#flush-url').fill('http://127.0.0.1:38994');await capture(23,'Own node connection','Advanced');
 // Render the real injected provider and approval UI on an intercepted site page.
 await browser.route('https://flush.markets/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><title>Flush demo connection</title><p>Wallet demo fixture</p>'}));
 const site=await browser.newPage();await site.goto('https://flush.markets/');
 const popupEvent=browser.waitForEvent('page');
 const connection=site.evaluate(()=>window.flush.request({method:'flush_requestAddress'}));
 const approval=await popupEvent;await approval.waitForLoadState('domcontentloaded');await approval.locator('#approve').waitFor();await capture(24,'Connect to flush.markets','Connect',approval);
 await approval.locator('#approve').click();assert.equal((await connection).address,accounts.flush.address);
 assert.equal(frames.length,24);assert.deepEqual(errors,[]);
 assert(requests.every(url=>url.startsWith('https://flush.markets/')||url.startsWith('https://explorer.blockfab.org/betanet/flush/api/v1/flush/logo/')),'Unexpected page request');
 frames.sort((a,b)=>a.number-b.number);
 const manifest={title:'Flush Wallet — screen demo',version,demo:true,notice:'Simulated balances and transactions. Public test seed — never fund these addresses. No live broadcast.',screens:frames};
 await writeFile(output+'/screens.json',JSON.stringify(manifest,null,2)+'\n');
 const fontCSS=(await Promise.all([300,400,500].map(async weight=>`@font-face{font-family:Barlow;font-weight:${weight};src:url(data:font/woff2;base64,${(await readFile('assets/fonts/barlow-'+weight+'.woff2')).toString('base64')})}`))).join('');
 const numberFont=`@font-face{font-family:Mono;src:url(data:font/woff2;base64,${(await readFile('assets/fonts/jetbrains-mono.woff2')).toString('base64')})}`;
 const mark='<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 6h24M8 12.5h17M12 19h10M15 25.5h4"/></svg>';
 const images=await Promise.all(frames.map(async f=>({...f,src:'data:image/png;base64,'+(await readFile(output+'/'+f.file)).toString('base64')})));
 const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
 const figures=images.map(f=>`<figure data-group="${f.category}"><figcaption><span class="number">${String(f.number).padStart(2,'0')}</span><span>${escape(f.title)}</span></figcaption><a href="${f.src}" target="_blank" title="Open full-size ${escape(f.title)}"><img src="${f.src}" alt="${escape(f.title)}" width="${f.width}" height="${f.height}"></a></figure>`).join('');
 const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Flush Wallet — all screens</title><style>${fontCSS}${numberFont}
 *{box-sizing:border-box}body{margin:0;background:#090b0e;color:#f5f6f7;font-family:Barlow,sans-serif;-webkit-font-smoothing:antialiased}main{max-width:2700px;padding:64px 64px 44px;margin:auto}.top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid #3a3f45;padding-bottom:32px;margin-bottom:36px}.brand{display:flex;gap:18px;align-items:center;font-size:28px;letter-spacing:.3em;font-weight:500}.brand svg{width:34px;height:34px}.eyebrow{font-size:12px;color:#7d94ab;letter-spacing:.24em;text-transform:uppercase;margin:25px 0 12px}h1{font-weight:300;text-transform:uppercase;letter-spacing:.17em;font-size:48px;line-height:1.2;margin:0}.meta{text-align:right;color:#adb3bb;font:12px/2 Mono,monospace}.note{color:#8d939b;font-size:16px;margin:20px 0 0}.grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:36px 28px}figure{min-width:0;margin:0}figcaption{height:42px;display:flex;gap:12px;align-items:flex-start;font-size:13px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;line-height:1.35}.number{font:11px/1.5 Mono,monospace;color:#7d94ab}figure a{display:flex;height:820px;align-items:flex-start;justify-content:center;overflow:hidden;background:#000;border:1px solid #3a3f45;border-radius:2px}figure img{display:block;width:100%;height:100%;object-fit:contain;object-position:top}footer{border-top:1px solid #3a3f45;margin-top:40px;padding-top:22px;display:flex;justify-content:space-between;font-size:13px;letter-spacing:.14em;color:#8d939b;text-transform:uppercase}nav{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 32px}button{font:12px Barlow;letter-spacing:.12em;text-transform:uppercase;padding:10px 16px;border:1px solid #3a3f45;color:#adb3bb;background:transparent;cursor:pointer}button.active{background:#d5dee7;color:#000;border-color:#d5dee7}figure[hidden]{display:none}.print nav{display:none}.print figure a{pointer-events:none}@media(max-width:1500px){main{padding:32px}.grid{grid-template-columns:repeat(4,minmax(0,1fr))}figure a{height:740px}h1{font-size:36px}}@media(max-width:1000px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}figure a{height:760px}.top{display:block}.meta{text-align:left;margin-top:20px}}@media(max-width:520px){main{padding:24px 16px}.grid{grid-template-columns:1fr}figure a{height:auto}figure img{height:auto}h1{font-size:30px}footer{display:block;font-size:11px;line-height:2}}
 dialog{padding:20px;background:#090b0e;color:#f5f6f7;border:1px solid #3a3f45;max-width:95vw;max-height:95vh}dialog::backdrop{background:#000d}dialog header{display:flex;align-items:center;justify-content:space-between;gap:25px;margin-bottom:16px}dialog img{display:block;max-width:100%;max-height:78vh;width:auto;height:auto;margin:auto}dialog a{color:#c6d4e2;font-size:12px}dialog strong{font-weight:400}
 </style><body><main><header class="top"><div><div class="brand">${mark}FLUSH</div><p class="eyebrow">Chrome wallet / Betanet preview</p><h1>Every screen.<br>One wallet.</h1><p class="note">eCash · ECX on Flush · Flush assets</p></div><div class="meta">24 SCREENS / v${version}<br>REAL EXTENSION INTERFACE<br>SIMULATED BALANCES &amp; TRANSACTIONS<br>PUBLIC TEST SEED · NEVER FUND</div></header><nav>${['All',...new Set(frames.map(f=>f.category))].map((g,i)=>`<button ${i===0?'class="active"':''} data-filter="${g}">${g}</button>`).join('')}</nav><div class="grid">${figures}</div><footer><span>Explorer by default · Sign on device</span><span>Demo only · No live transactions</span></footer></main><dialog id="viewer" aria-label="Full-size wallet screen"><header><strong id="screen-title"></strong><a id="download" download="wallet-screen.png">Download PNG</a><button id="close">Close</button></header><img id="zoom" alt=""></dialog><script>
 for(const button of document.querySelectorAll('[data-filter]'))button.onclick=()=>{for(const b of document.querySelectorAll('[data-filter]'))b.classList.toggle('active',b===button);for(const f of document.querySelectorAll('figure'))f.hidden=button.dataset.filter!=='All'&&f.dataset.group!==button.dataset.filter;};
 const viewer=document.querySelector('#viewer');document.querySelector('#close').onclick=()=>viewer.close();
 for(const link of document.querySelectorAll('figure a'))link.onclick=event=>{event.preventDefault();const img=link.querySelector('img');document.querySelector('#zoom').src=img.src;document.querySelector('#zoom').alt=img.alt;document.querySelector('#screen-title').textContent=img.alt;document.querySelector('#download').href=img.src;viewer.showModal();};
 </script></body></html>`;
 await writeFile(output+'/gallery.html',html);
 const sheet=await browser.newPage();await sheet.setViewportSize({width:2700,height:1800});await sheet.setContent(html);await sheet.evaluate(()=>document.fonts.ready);
 await sheet.locator('[data-filter="Receive"]').click();assert.equal(await sheet.locator('figure:visible').count(),3);
 await sheet.locator('[data-filter="All"]').click();assert.equal(await sheet.locator('figure:visible').count(),24);
 await sheet.locator('figure a').first().click();assert(await sheet.locator('#viewer').isVisible());await sheet.locator('#close').click();
 await sheet.evaluate(()=>{document.body.classList.add('print');window.scrollTo(0,0);});
 await sheet.screenshot({path:output+'/flush-wallet-collage.png',fullPage:true,scale:'css'});
 await sheet.pdf({path:output+'/flush-wallet-collage.pdf',width:'2700px',height:(await sheet.evaluate(()=>document.documentElement.scrollHeight))+'px',printBackground:true,margin:{top:0,right:0,bottom:0,left:0}});
 console.log(`Captured ${frames.length} actual extension screens with offline fixtures.`);
 console.log('Collage: docs/demo/flush-wallet-collage.png');console.log('Interactive gallery: docs/demo/gallery.html');
}finally{await browser.close();await rm(profile,{recursive:true,force:true});}
