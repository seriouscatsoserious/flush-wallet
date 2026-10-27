import {build} from 'esbuild';
import {mkdir,copyFile,readFile,writeFile} from 'node:fs/promises';
import {generateKeyPairSync,createHash} from 'node:crypto';
await mkdir('extension/fonts',{recursive:true});
for(const w of [300,400,500])await copyFile('assets/fonts/barlow-'+w+'.woff2','extension/fonts/barlow-'+w+'.woff2');
await copyFile('assets/fonts/jetbrains-mono.woff2','extension/fonts/jetbrains-mono.woff2');
await copyFile('src/design-tokens.css','extension/design-tokens.css');
await mkdir('extension/licenses',{recursive:true});
for(const f of ['Barlow-OFL.txt','JetBrainsMono-OFL.txt','DEPENDENCIES.txt'])await copyFile('assets/licenses/'+f,'extension/licenses/'+f);
await copyFile('INSTALL.txt','extension/INSTALL.txt');
for(const f of ['popup.html','popup.css'])await copyFile('src/'+f,'extension/'+f);
for(const name of ['background','popup','provider','content'])await build({entryPoints:['src/'+name+'.js'],bundle:true,outfile:'extension/'+name+'.js',format:name==='background'?'esm':'iife',platform:'browser',target:'chrome111',minify:false,legalComments:'eof'});
let manifest=JSON.parse(await readFile('extension/manifest.json','utf8'));
if(!manifest.key){const {publicKey}=generateKeyPairSync('rsa',{modulusLength:2048});manifest.key=publicKey.export({type:'spki',format:'der'}).toString('base64');await writeFile('extension/manifest.json',JSON.stringify(manifest,null,2)+'\n');}
const hash=createHash('sha256').update(Buffer.from(manifest.key,'base64')).digest('hex').slice(0,32),id=hash.replace(/[0-9a-f]/g,v=>String.fromCharCode(97+parseInt(v,16)));
console.log('Extension ID:',id);
