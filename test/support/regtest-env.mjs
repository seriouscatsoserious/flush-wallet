import {build} from 'esbuild';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseRpcJSON} from '../../src/rpc.js';

export const GENESIS='0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206';
export const pause=ms=>new Promise(done=>setTimeout(done,ms));
export async function until(check,label,timeout=60000){const start=Date.now();while(Date.now()-start<timeout){const value=await check();if(value)return value;await pause(250);}throw Error('Timed out: '+label);}
export async function environment(){
 const directory=resolve(process.env.FLUSH_PLAYGROUND_DIR||'runtime/regtest-playground'),state=JSON.parse(await readFile(directory+'/state.json','utf8'));
 const urls={ecash:'http://127.0.0.1:'+state.ports.main_rpc+'/',flush:'http://127.0.0.1:'+state.ports.rpc0+'/'};
 async function rpc(chain,method,params=[],wallet=''){
  const response=await fetch(urls[chain]+(wallet?'wallet/'+wallet:''),{method:'POST',headers:{Authorization:'Basic '+Buffer.from('playground:playground').toString('base64'),'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params}),signal:AbortSignal.timeout(20000)});
  const result=parseRpcJSON(await response.text());if(result.error)throw Error(method+': '+result.error.message);return result.result;
 }
 for(const chain of ['ecash','flush']){assert.equal((await rpc(chain,'getblockchaininfo')).chain,'regtest');assert.equal(await rpc(chain,'getblockhash',[0]),GENESIS);}
 assert.equal((await rpc('flush','getmainchaininfo')).slot,46);
 async function coins(chain,address){const scan=await rpc(chain,'scantxoutset',['start',['addr('+address+')']]);return (await Promise.all(scan.unspents.map(async coin=>{const output=await rpc(chain,'gettxout',[coin.txid,coin.vout,true]);return output?{...coin,...output}:null;}))).filter(Boolean);}
 async function balance(chain,address,token=null){const outputs=await coins(chain,address);return outputs.reduce((sum,coin)=>{const [whole,fraction='']=String(coin.value).split('.');return sum+(token?(coin.token?.id===token?BigInt(coin.token.amount_units):0n):!coin.token?BigInt(whole)*100000000n+BigInt(fraction.padEnd(8,'0')):0n);},0n);}
 return {directory,state,urls,rpc,coins,balance,config:{ecash:{url:urls.ecash,auth:'playground:playground'},flush:{url:urls.flush,auth:'playground:playground'}}};
}
export async function buildRegtest(destination,{optionalOnly=false,content=true}={}){
 await mkdir(destination,{recursive:true});await cp(resolve('extension'),destination,{recursive:true});
 const manifest=JSON.parse(await readFile(destination+'/manifest.json','utf8'));
 manifest.name='Flush Wallet — LOCAL REGTEST QA';manifest.host_permissions=optionalOnly?[]:['http://127.0.0.1/*'];manifest.optional_host_permissions=['http://127.0.0.1/*'];
 if(!content)delete manifest.content_scripts;
 await writeFile(destination+'/manifest.json',JSON.stringify(manifest,null,2)+'\n');
 function change(source,find,value){assert(source.includes(find),'Regtest build anchor missing: '+find);return source.replace(find,value);}
 const plugin={name:'regtest-network-parameters-only',setup(builder){builder.onLoad({filter:/\/src\/(core|rpc|popup|background)\.js$/},async args=>{
  let source=await readFile(args.path,'utf8');
  if(args.path.endsWith('/core.js')){
   source=change(source,"bech32:'bflx',bip32:{public:0x0488b21e,private:0x0488ade4},pubKeyHash:28,scriptHash:88,wif:156","bech32:'rsc',bip32:{public:0x043587cf,private:0x04358394},pubKeyHash:111,scriptHash:196,wif:239");
   source=change(source,"bech32:'bc',bip32:{public:0x0488b21e,private:0x0488ade4},pubKeyHash:0,scriptHash:5,wif:128","bech32:'rchn',bip32:{public:0x043587cf,private:0x04358394},pubKeyHash:111,scriptHash:196,wif:239");
   source=source.replaceAll("'bflx1'","'rsc1'").replaceAll("'s99_'","'s46_'").replaceAll('setLocktime(499999999)','setLocktime(499999998)').replaceAll("'ecashbeta'","'regtest'");
  }else if(args.path.endsWith('/rpc.js')){
   source=change(source,"height:967680,hash:'00000000000000030101ba5cfea54b22becc79f95dc6040beb76e01dd9d04042'",`height:0,hash:'${GENESIS}'`);
   source=change(source,"'04dfb01bef61e44d679132f9e830719c64241f7052880418a350ff6d3c90b561'",`'${GENESIS}'`);
   source=change(source,"!['main','ecashbeta'].includes(l1.chain)","l1.chain!=='regtest'");
   source=source.replaceAll("'ecashbeta'","'regtest'").replaceAll('slot!==99','slot!==46').replaceAll('slot:99','slot:46');
  }else if(args.path.endsWith('/background.js'))source=source.replaceAll("'ecashbeta'","'regtest'");
  else source=source.replaceAll('Betanet','Local regtest').replaceAll('betanet','regtest').replaceAll('bflx1','rsc1').replaceAll('slot 99','slot 46');
  return {contents:source,loader:'js',resolveDir:dirname(args.path)};
 });}};
 for(const name of ['background','popup','provider','content'])await build({entryPoints:['src/'+name+'.js'],bundle:true,outfile:destination+'/'+name+'.js',format:name==='background'?'esm':'iife',platform:'browser',target:'chrome111',plugins:[plugin]});
 const coreFile=destination+'/test-core.mjs';await build({entryPoints:['src/core.js'],bundle:true,outfile:coreFile,format:'esm',platform:'node',plugins:[plugin]});
 return {manifest,core:await import(pathToFileURL(coreFile).href+'?v='+Date.now())};
}
