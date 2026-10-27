import {build} from 'esbuild';
import {mkdir,mkdtemp,copyFile,readFile,writeFile,rm,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const manifest=JSON.parse(await readFile('src/manifest.json','utf8'));
const {version}=JSON.parse(await readFile('package.json','utf8'));
if(!manifest.key)throw Error('The pinned extension public key is required');
if(manifest.version!==version)throw Error('Package and extension versions must match');
const output=await mkdtemp('.extension-build-');
try{
 await mkdir(output+'/fonts');
 for(const w of [300,400,500])await copyFile('assets/fonts/barlow-'+w+'.woff2',output+'/fonts/barlow-'+w+'.woff2');
 await copyFile('assets/fonts/jetbrains-mono.woff2',output+'/fonts/jetbrains-mono.woff2');
 await copyFile('src/design-tokens.css',output+'/design-tokens.css');
 await mkdir(output+'/icons');
 for(const size of [16,32,128])await copyFile('assets/icons/'+size+'.png',output+'/icons/'+size+'.png');
 await mkdir(output+'/licenses');
 for(const f of ['Barlow-OFL.txt','JetBrainsMono-OFL.txt','DEPENDENCIES.txt'])await copyFile('assets/licenses/'+f,output+'/licenses/'+f);
 await copyFile('INSTALL.txt',output+'/INSTALL.txt');
 for(const f of ['popup.html','popup.css'])await copyFile('src/'+f,output+'/'+f);
 for(const name of ['background','popup','provider','content'])await build({entryPoints:['src/'+name+'.js'],bundle:true,outfile:output+'/'+name+'.js',format:name==='background'?'esm':'iife',platform:'browser',target:'chrome111',minify:false,legalComments:'eof'});
 await writeFile(output+'/manifest.json',JSON.stringify(manifest,null,2)+'\n');
 await rm('extension',{recursive:true,force:true});
 await rename(output,'extension');
}finally{await rm(output,{recursive:true,force:true});}
const hash=createHash('sha256').update(Buffer.from(manifest.key,'base64')).digest('hex').slice(0,32),id=hash.replace(/[0-9a-f]/g,v=>String.fromCharCode(97+parseInt(v,16)));
console.log('Extension ID:',id);
