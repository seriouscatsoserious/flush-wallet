// Real Chrome permission bubbles, controlled on an isolated Xvfb display.
// No permission methods are mocked. The controller denies and grants only loopback access.
import {chromium} from 'playwright';
import {spawn,execFileSync} from 'node:child_process';
import {readFile,writeFile,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {buildRegtest,pause} from './support/regtest-env.mjs';
const root=resolve('runtime/wallet-qa'),session=JSON.parse(await readFile(root+'/session.json','utf8')),extension=root+'/permissions-extension';
await buildRegtest(extension,{optionalOnly:true});
const options=dir=>({channel:'chromium',headless:true,args:['--no-sandbox','--disable-extensions-except='+dir,'--load-extension='+dir]});
let values;const old=await chromium.launchPersistentContext(session.profile,options(root+'/extension'));try{const w=old.serviceWorkers()[0]||await old.waitForEvent('serviceworker');values=await w.evaluate(()=>chrome.storage.local.get(['vault','rpcConnection','connectionMode']));}finally{await old.close();}
assert(!await access('/tmp/.X11-unix/X101').then(()=>true,()=>false),'Display :101 is in use; refuse to control another desktop');
const display=spawn('Xvfb',[':101','-screen','0','1280x1000x24','-nolisten','tcp'],{stdio:'ignore'});await pause(500);
const profile=root+'/permissions-'+Date.now();
let browser;const report={startedAt:new Date().toISOString(),display:':101',actualChromePermissions:true,checks:[],passed:false};
async function save(){await writeFile('output/wallet-qa-permissions.json',JSON.stringify(report,null,2)+'\n');}
try{
 const chromeOptions={channel:'chromium',headless:false,env:{...process.env,DISPLAY:':101'},viewport:{width:900,height:850},args:['--no-sandbox','--window-position=0,0','--window-size=1000,950','--disable-extensions-except='+extension,'--load-extension='+extension]};
 browser=await chromium.launchPersistentContext(profile,chromeOptions);
 const worker=browser.serviceWorkers()[0]||await browser.waitForEvent('serviceworker'),id=new URL(worker.url()).host;
 await worker.evaluate(values=>chrome.storage.local.set(values),values);
 let p=await browser.newPage();await p.goto(`chrome-extension://${id}/popup.html`);await p.locator('#password').fill(session.password);await p.locator('#unlock').click();await p.getByRole('alert').waitFor({timeout:45000});
 await p.locator('#settings').click();await p.locator('#advanced summary').click();await p.locator('#connection').click();await p.locator('#pair-rpc').waitFor();
 assert(!await p.evaluate(()=>chrome.permissions.contains({origins:['http://127.0.0.1/*']})));
 await p.locator('#pair-rpc').click();await pause(700);execFileSync('xdotool',['key','--clearmodifiers','Escape'],{env:{...process.env,DISPLAY:':101'}});
 await p.getByRole('alert').waitFor({timeout:60000});assert.match(await p.getByRole('alert').innerText(),/not granted/);assert(!await p.evaluate(()=>chrome.permissions.contains({origins:['http://127.0.0.1/*']})));
 report.checks.push({name:'Actual Chrome permission denial keeps the prior connection',status:'passed'});await save();
 await p.getByRole('alert').evaluate(el=>el.remove());await p.locator('#pair-rpc').click();await pause(700);execFileSync('xdotool',['key','--clearmodifiers','Tab','Return'],{env:{...process.env,DISPLAY:':101'}});
 await p.getByText('Nodes paired',{exact:true}).waitFor({timeout:60000});assert(await p.evaluate(()=>chrome.permissions.contains({origins:['http://127.0.0.1/*']})));
 const stored=await p.evaluate(()=>chrome.storage.local.get());assert(stored.rpcConnection.ciphertext);assert(!JSON.stringify(stored).includes('playground:playground'));
 report.checks.push({name:'Actual Chrome permission grant pairs real local nodes',status:'passed'});await save();
 await p.locator('#mode-explorer').check();await p.locator('#use-explorer').click();await p.getByText('Using explorer',{exact:true}).waitFor();assert(!await p.evaluate(()=>chrome.permissions.contains({origins:['http://127.0.0.1/*']})));assert.equal((await p.evaluate(()=>chrome.storage.local.get('rpcConnection'))).rpcConnection,undefined);
 report.checks.push({name:'Switching back deletes RPC credentials and revokes real Chrome host access',status:'passed'});await save();
 const manifest=JSON.parse(await readFile(extension+'/manifest.json','utf8'));manifest.version=manifest.version.split('.').map((part,index)=>index===2?Number(part)+1:Number(part)).join('.');const updatedVersion=manifest.version;await writeFile(extension+'/manifest.json',JSON.stringify(manifest,null,2));
 const manager=await browser.newPage();await manager.goto('chrome://extensions/');await manager.locator('extensions-item').getByRole('button',{name:'Reload',exact:true}).click();await pause(500);
 await browser.close();browser=await chromium.launchPersistentContext(profile,chromeOptions);
 p=await browser.newPage();await p.goto(`chrome-extension://${id}/popup.html`);await p.locator('#unlock').waitFor();const data=await p.evaluate(()=>chrome.storage.local.get('vault'));assert.equal(data.vault.ciphertext,values.vault.ciphertext);assert.equal(await p.evaluate(()=>chrome.runtime.getManifest().version),updatedVersion);
 report.checks.push({name:'Unpacked extension update across Chrome restart preserves the encrypted wallet and locks the signer',status:'passed'});report.passed=true;await save();console.log(JSON.stringify(report,null,2));
}finally{if(browser)await browser.close();display.kill('SIGTERM');}
