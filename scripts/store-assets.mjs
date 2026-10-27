import {chromium} from 'playwright';
import {mkdtemp,mkdir,readFile,writeFile,copyFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
const output='distribution/assets';await mkdir(output,{recursive:true});
const profile=await mkdtemp(tmpdir()+'/flush-store-'),extension=resolve('extension');
const browser=await chromium.launchPersistentContext(profile,{channel:'chromium',headless:true,viewport:{width:390,height:650},deviceScaleFactor:1,args:['--no-sandbox','--disable-extensions-except='+extension,'--load-extension='+extension]});
try{
 const worker=browser.serviceWorkers()[0]||await browser.waitForEvent('serviceworker'),page=await browser.newPage();
 await page.goto(`chrome-extension://${new URL(worker.url()).host}/popup.html`);await page.getByRole('button',{name:'Create a wallet',exact:true}).waitFor();await page.evaluate(()=>document.fonts.ready);
 const actual=(await page.screenshot()).toString('base64');
 const font=(await readFile('assets/fonts/barlow-300.woff2')).toString('base64');
 const mark='<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 6h24M8 12.5h17M12 19h10M15 25.5h4"/></svg>';
 const base=`@font-face{font-family:Barlow;src:url(data:font/woff2;base64,${font});font-weight:300}*{box-sizing:border-box}body{margin:0;background:#000;color:#f5f6f7;font-family:Barlow; font-weight:300}svg{display:block}`;
 await page.setViewportSize({width:1280,height:800});
 await page.setContent(`<style>${base}main{height:800px;display:flex;align-items:center;padding:60px 90px;gap:110px}.copy{flex:1}.brand{display:flex;align-items:center;gap:16px;text-transform:uppercase;letter-spacing:.2em;font-size:21px}.brand svg{width:30px;height:30px}h1{font-size:56px;line-height:1.2;letter-spacing:.14em;text-transform:uppercase;font-weight:300;margin:60px 0 28px}p{font-size:22px;color:#adb3bb;line-height:1.6}.network{font-size:12px;letter-spacing:.14em;text-transform:uppercase;margin-top:48px;color:#8d939b}img{width:350px;height:auto;border:1px solid #30343a}</style><main><div class="copy"><div class="brand">${mark}Flush Wallet</div><h1>Your wallet.<br>On Flush.</h1><p>eCash, Flush and your tokens.<br>Keys kept on your device.</p><div class="network">Chrome · Betanet</div></div><img src="data:image/png;base64,${actual}" alt="Actual wallet onboarding"></main>`);
 await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:output+'/onboarding-1280x800.png'});
 await page.setViewportSize({width:440,height:280});
 await page.setContent(`<style>${base}main{height:280px;display:flex;align-items:center;justify-content:center;gap:29px;border:1px solid #30343a}.logo{width:64px;height:64px}.word{font-size:27px;letter-spacing:.2em;text-transform:uppercase}.sub{font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:#8d939b;margin-top:6px}</style><main><div class="logo">${mark}</div><div><div class="word">Flush</div><div class="sub">Wallet</div></div></main>`);
 await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:output+'/promo-440x280.png'});
 await copyFile('assets/icons/128.png',output+'/icon-128.png');
 await writeFile(output+'/README.md','These listing assets use the official Flush mark and bundled Barlow font. The screenshot contains the actual empty-wallet onboarding UI: no generated account, recovery phrase, fake balance or transaction. Regenerate with `node scripts/store-assets.mjs` after building the extension. Dimensions follow [Chrome listing guidance](https://developer.chrome.com/docs/webstore/images). These assets are not included in the extension ZIP.\n');
 console.log('Store icon, promotional tile and actual onboarding screenshot generated.');
}finally{await browser.close();await rm(profile,{recursive:true,force:true});}
