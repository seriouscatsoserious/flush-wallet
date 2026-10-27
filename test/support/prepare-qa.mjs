// Provision only the second regtest asset/pool needed by the QA suite.
import {PNG} from 'pngjs';
import {environment,until} from './regtest-env.mjs';
const {rpc}=await environment();let asset;
try{asset=await rpc('flush','getasset',['PRISM']);}catch{}
if(!asset){
 const height=await rpc('flush','getblockcount');await rpc('flush','reserveasset',['PRISM'],'w');await until(async()=>await rpc('flush','getblockcount')>=height+4,'reservation maturity');
 const image=new PNG({width:256,height:256});
 for(let i=0;i<image.data.length;i+=4){image.data[i]=10;image.data[i+1]=10;image.data[i+2]=10;image.data[i+3]=255;}
 for(const [x,y,width] of [[42,60,172],[65,101,126],[86,142,84],[107,183,42]])for(let row=y;row<y+13;row++)for(let col=x;col<x+width;col++){const i=(row*256+col)*4;image.data[i]=213;image.data[i+1]=222;image.data[i+2]=231;}
 await rpc('flush','registerasset',['PRISM',1000000,6,{info:'Local QA asset, six decimal places'},true,PNG.sync.write(image).toString('base64'),'Prism <img src=x onerror=alert(1)>'],'w');
 asset=await until(async()=>{try{return await rpc('flush','getasset',['PRISM']);}catch{return false;}},'asset registration');
}
if(!(await rpc('flush','listpools')).some(pool=>pool.asset_a_id===asset.asset||pool.asset_b_id===asset.asset)){
 await rpc('flush','addliquidity',['PRISM',100000,'ECX',10],'w');await until(async()=>(await rpc('flush','listpools')).some(pool=>pool.asset_a_id===asset.asset||pool.asset_b_id===asset.asset),'second pool');
}
console.log('QA token/pool ready:',asset.asset);
