import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const {version}=JSON.parse(await readFile('package.json','utf8'));
const allowed=new Set([
 'INSTALL.txt','manifest.json','background.js','content.js','provider.js',
 'popup.js','popup.html','popup.css','design-tokens.css',
 ...[16,32,128].map(size=>'icons/'+size+'.png'),
 ...[300,400,500].map(weight=>'fonts/barlow-'+weight+'.woff2'),
 'fonts/jetbrains-mono.woff2',
 ...['Barlow-OFL.txt','JetBrainsMono-OFL.txt','DEPENDENCIES.txt'].map(file=>'licenses/'+file),
]);
async function list(dir,prefix=''){
 const files=[];
 for(const entry of await readdir(dir,{withFileTypes:true})){
  const name=prefix+entry.name;
  if(entry.isDirectory())files.push(...await list(dir+'/'+entry.name,name+'/'));
  else if(entry.isFile())files.push(name);
  else throw Error('Unsupported package entry: '+name);
 }
 return files.sort();
}
const files=await list('extension');
if(files.length!==allowed.size||files.some(file=>!allowed.has(file)))throw Error('Unexpected extension contents; run npm run build');
const manifest=JSON.parse(await readFile('extension/manifest.json','utf8'));
if(manifest.version!==version)throw Error('Build version does not match package');
await mkdir('output',{recursive:true});
const path='output/flush-wallet-'+version+'.zip';
// Write a new ZIP from the explicit file list; never archive the repository.
execFileSync('python3',['-c',
 'import json,sys,zipfile,pathlib\nwith zipfile.ZipFile(sys.argv[1],"w",zipfile.ZIP_DEFLATED) as z:\n for name in json.loads(sys.argv[2]):\n  info=zipfile.ZipInfo("flush-wallet/"+name,(2020,1,1,0,0,0));info.create_system=3;info.external_attr=0o100644<<16;info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,(pathlib.Path("extension")/name).read_bytes())',
 path,JSON.stringify(files)]);
const sha256=createHash('sha256').update(await readFile(path)).digest('hex');
await writeFile(path+'.sha256',sha256+'  flush-wallet-'+version+'.zip\n');
console.log(JSON.stringify({path,version,files:files.length,sha256}));
