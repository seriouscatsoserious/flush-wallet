// Actual Svelte site build + actual extension + actual regtest API/RPC. No data fixtures.
// HTTPS page requests are served from the local build without starting a web server.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {environment,buildRegtest,until,pause} from './support/regtest-env.mjs';
const env=await environment(),root=resolve('runtime/wallet-qa'),siteRoot=resolve(process.env.FLUSH_SITE_BUILD||'site-src/build');
const session=JSON.parse(await readFile(root+'/session.json','utf8')),extension=root+'/site-extension';await buildRegtest(extension);
const options=dir=>({channel:'chromium',headless:true,viewport:{width:1280,height:900},args:['--no-sandbox','--disable-extensions-except='+dir,'--load-extension='+dir]});
const report={startedAt:new Date().toISOString(),site:'Local production build of flush.markets on its real origin; real regtest API responses',checks:[],passed:false};
async function check(name,fn){console.log('TEST:',name);try{const result=await fn();report.checks.push({name,status:'passed',...result});console.log('PASS:',name);await writeFile('output/wallet-qa-site.json',JSON.stringify(report,null,2));return result;}catch(error){report.checks.push({name,status:'failed',error:error.message});await writeFile('output/wallet-qa-site.json',JSON.stringify(report,null,2));throw error;}}
let values;const old=await chromium.launchPersistentContext(session.profile,options(root+'/extension'));try{const w=old.serviceWorkers()[0]||await old.waitForEvent('serviceworker');values=await w.evaluate(()=>chrome.storage.local.get(['vault','rpcConnection','connectionMode','history']));}finally{await old.close();}
const browser=await chromium.launchPersistentContext(root+'/site-'+Date.now(),options(extension)),worker=browser.serviceWorkers()[0]||await browser.waitForEvent('serviceworker'),id=new URL(worker.url()).host;
await worker.evaluate(values=>chrome.storage.local.set(values),values);
const errors=[],uris=[];browser.on('page',page=>page.on('pageerror',error=>errors.push(error.message)));
await browser.route('https://flush.markets/**',async route=>{
 const url=new URL(route.request().url());
 if(url.pathname.startsWith('/api/v1/')){const response=await fetch('http://127.0.0.1:49830'+url.pathname+url.search,{headers:{origin:'https://flush.markets',accept:'application/json'}});return route.fulfill({status:response.status,contentType:response.headers.get('content-type')||'application/json',body:Buffer.from(await response.arrayBuffer())});}
 let path=url.pathname.replace(/\/$/,'')||'/index';if(!extname(path))path+='.html';const file=resolve(siteRoot,'.'+path);assert(file.startsWith(siteRoot+'/'));try{const bytes=await readFile(file);const contentType={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.woff2':'font/woff2','.woff':'font/woff','.png':'image/png','.svg':'image/svg+xml'}[extname(file)]||'application/octet-stream';return route.fulfill({contentType,body:bytes});}catch{return route.fulfill({status:404,body:'Missing local site file'});}
});
try{
 const wallet=await browser.newPage();await wallet.goto(`chrome-extension://${id}/popup.html`);await wallet.locator('#password').fill(session.password);await wallet.locator('#unlock').click();await wallet.getByText('Your tokens',{exact:true}).waitFor({timeout:45000});
 const site=await browser.newPage();await site.goto('https://flush.markets/swap?from=ECX&to=FLUX',{waitUntil:'networkidle'});await site.waitForFunction(()=>window.flush?.isFlush===true);
 async function popup(){const page=await browser.waitForEvent('page');await page.waitForLoadState('domcontentloaded');await page.locator('#unlock, #approve').first().waitFor({timeout:30000});if(await page.locator('#unlock').count()){await page.locator('#password').fill(session.password);await page.locator('#unlock').click();}await page.locator('#approve').waitFor({timeout:30000});return page;}
 await check('Reject a connection request from the actual website',async()=>{
  const before=await env.balance('flush',values.vault.address);await site.locator('header .connect').click();const pending=popup();await site.getByRole('button',{name:'Use the browser extension'}).click();const approval=await pending;await approval.locator('#cancel').click();await pause(400);assert.equal(await env.balance('flush',values.vault.address),before);assert.equal(await worker.evaluate(async()=>(await chrome.storage.session.get('pending')).pending),undefined);return {fundsMoved:false};
 });
 await check('Connect shares only a public address and grants no transaction authority',async()=>{
  await site.reload({waitUntil:'networkidle'});await site.locator('header .connect').click();const pending=popup();await site.getByRole('button',{name:'Use the browser extension'}).click();const approval=await pending;await approval.locator('#approve').click();await site.waitForFunction(()=>localStorage.getItem('flush.address')?.startsWith('rsc1'));assert.equal(await site.evaluate(()=>localStorage.getItem('flush.address')),values.vault.address);await approval.close();return {address:values.vault.address};
 });
 await check('A website cannot request seed export or unsupported wallet methods',async()=>{const response=await site.evaluate(()=>window.flush.request({method:'RECOVERY'}).then(()=>({ok:true}),error=>({ok:false,error:error.message})));assert(!response.ok);assert.match(response.error,/Unsupported/);return {blocked:true};});
 await check('Wrong-network and expired website requests are refused',async()=>{
  for(const network of ['ecashbeta','regtest']){const exp=network==='regtest'?Math.floor(Date.now()/1000)-1:Math.floor(Date.now()/1000)+120;const uri='flush:swap?'+new URLSearchParams({v:'1',network,exp:String(exp),pool:'ab'.repeat(32),from:'ECX',to:'FLUX',amount:'0.001',min_out:'1'});const response=await site.evaluate(uri=>window.flush.request({method:'flush_submit',params:{uri}}).then(()=>({ok:true}),error=>({ok:false,error:error.message})),uri);assert(!response.ok);assert.match(response.error,/network|expired/);}return {cases:2};
 });
 await check('Approve an actual website-built trade and verify its on-chain receipt',async()=>{
  await site.locator('#amt').fill('0.005');const button=site.getByRole('button',{name:'Swap in the Flush app',exact:true});await button.waitFor();await until(()=>button.isEnabled(),'real node quote');const pending=popup();await button.click();const approval=await pending;
  const request=await worker.evaluate(async()=>(await chrome.storage.session.get('pending')).pending);uris.push(request.uri);assert((await approval.locator('.card').first().innerText()).includes('https://flush.markets'));
  const before=await env.balance('flush',values.vault.address,(await env.rpc('flush','getasset',['FLUX'])).asset);await approval.screenshot({path:'output/qa-site-approval.png'});await approval.locator('#approve').click();await approval.getByRole('heading',{name:'Transaction sent',exact:true}).waitFor();const txid=(await approval.locator('.card.break').innerText()).trim();const asset=await env.rpc('flush','getasset',['FLUX']);
  await until(async()=>await env.balance('flush',values.vault.address,asset.asset)>before,'site trade confirmed');await site.screenshot({path:'output/qa-site-trade.png',fullPage:true});await approval.close();return {txid,actualSiteCode:true,actualNodeData:true};
 });
 await check('Completed website transaction requests cannot be replayed',async()=>{const response=await site.evaluate(uri=>window.flush.request({method:'flush_submit',params:{uri}}).then(()=>({ok:true}),error=>({ok:false,error:error.message})),uris[0]);assert(!response.ok);assert.match(response.error,/already completed/);return {blocked:true};});
 await check('A request that expires while its approval is open cannot be approved',async()=>{
  const pending=popup(),response=site.evaluate(()=>window.flush.request({method:'flush_requestAddress'}).then(result=>({ok:true,result}),error=>({ok:false,error:error.message})));const approval=await pending;
  await worker.evaluate(async()=>{const {pending}=await chrome.storage.session.get('pending');pending.expires=Date.now()-1;await chrome.storage.session.set({pending});});
  await approval.locator('#approve').click();await approval.getByRole('alert').waitFor();assert.match(await approval.getByRole('alert').innerText(),/expired/);const result=await response;assert(!result.ok);assert.match(result.error,/expired/);await approval.close();return {expiredDuringReview:true,requestRejected:true};
 });
 await check('A terminated approval worker does not leave a stale request blocking reconnection',async()=>{
  const pending=popup(),response=site.evaluate(()=>window.flush.request({method:'flush_requestAddress'}).then(result=>({ok:true,result}),error=>({ok:false,error:error.message})));const interrupted=await pending;
  const cdp=await browser.browser().newBrowserCDPSession(),targets=await cdp.send('Target.getTargets'),target=targets.targetInfos.find(t=>t.type==='service_worker'&&t.url.startsWith('chrome-extension://'+id+'/'));await cdp.send('Target.closeTarget',{targetId:target.targetId});const failed=await response;assert(!failed.ok);await interrupted.close();
  const next=popup(),retry=site.evaluate(()=>window.flush.request({method:'flush_requestAddress'}).then(result=>({ok:true,result}),error=>({ok:false,error:error.message})));const approval=await next;await approval.locator('#approve').click();const result=await retry;assert(result.ok);assert.equal(result.result.address,values.vault.address);await approval.close();return {interruptedRequestRejected:true,reconnectionSucceeded:true};
 });
 await check('Replay protection survives clearing volatile browser session state',async()=>{const current=browser.serviceWorkers().find(w=>w.url().includes(id));await current.evaluate(()=>chrome.storage.session.clear());const response=await site.evaluate(uri=>window.flush.request({method:'flush_submit',params:{uri}}).then(()=>({ok:true}),error=>({ok:false,error:error.message})),uris[0]);assert(!response.ok);assert.match(response.error,/already completed/);return {persistentReplayProtection:true};});
 await check('Simultaneous website requests cannot open competing approval windows',async()=>{const count=browser.pages().length,pending=popup();const responses=site.evaluate(()=>Promise.all([1,2].map(()=>window.flush.request({method:'flush_requestAddress'}).then(result=>({ok:true,result}),error=>({ok:false,error:error.message})))));const approval=await pending;await pause(400);assert.equal(browser.pages().length,count+1);await approval.locator('#approve').click();const results=await responses;assert.equal(results.filter(r=>r.ok).length,1);assert.equal(results.filter(r=>!r.ok&&/pending/.test(r.error)).length,1);await approval.close();return {approvalWindows:1,requestsAccepted:1,secondRequestRefused:true};});
 report.frontendErrors=errors;assert.deepEqual(errors,[]);report.passed=true;await writeFile('output/wallet-qa-site.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
