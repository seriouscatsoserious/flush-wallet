import {normalizeToken} from './token.js';
import {address,Transaction} from 'bitcoinjs-lib';
import {chainNetwork,hex,units,decimal} from './core.js';
export const BETANET_CHECKPOINT={height:967680,hash:'00000000000000030101ba5cfea54b22becc79f95dc6040beb76e01dd9d04042'};
export const FLUSH_GENESIS='04dfb01bef61e44d679132f9e830719c64241f7052880418a350ff6d3c90b561';
export function rpcURL(value){
 let u;try{u=new URL(value);}catch{throw Error('Enter a valid RPC URL');}
 const loopback=['localhost','127.0.0.1','[::1]'].includes(u.hostname);
 if(u.protocol!=='https:'&&!(u.protocol==='http:'&&loopback))throw Error('Remote RPC nodes require HTTPS. HTTP is allowed on localhost only.');
 if(u.username||u.password||u.search||u.hash)throw Error('Put RPC credentials in the credentials field, not in the URL');
 if(!u.hostname)throw Error('Enter an RPC hostname');return u.href;
}
export function rpcOrigin(url){const u=new URL(rpcURL(url));return u.protocol+'//'+u.hostname+'/*';}
export function validateConnection(c){
 const out={mode:'rpc'};for(const chain of ['ecash','flush']){
  const node=c?.[chain];if(!node)throw Error('Enter both eCash and Flush RPC endpoints');
  const auth=node.auth||'';if(typeof auth!=='string'||auth.length>4096||/[\r\n]/.test(auth)||auth&&!auth.includes(':'))throw Error('RPC credentials must be username:password, or the contents of the cookie file');
  out[chain]={url:rpcURL(node.url),auth};
 }return out;
}
// Preserve decimal amounts exactly as emitted by RPC, without changing other JSON types.
const AMOUNTS=new Set(['value','amount','amount_in','amount_out','quote','min_out','supply','balance','reserve_a','reserve_b']);
export function parseRpcJSON(text){
 let out='',i=0,key=null;
 while(i<text.length){const c=text[i];
  if(c==='"'){const start=i++;while(i<text.length){if(text[i]==='\\'){i+=2;continue;}if(text[i++]==='"')break;}const segment=text.slice(start,i);out+=segment;let n=i;while(/\s/.test(text[n]||'')&&n<text.length)n++;if(text[n]===':')key=JSON.parse(segment);continue;}
  if(c==='-'||/\d/.test(c)){const match=text.slice(i).match(/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/);if(!match)throw Error('Invalid RPC JSON');const token=match[0];out+=AMOUNTS.has(key)?JSON.stringify(token):token;i+=token.length;key=null;continue;}
  if(c==='{'||c==='['||c===','||c==='}'||c===']')key=null;out+=c;i++;
 }
 return JSON.parse(out);
}
const READS=new Set(['getblockchaininfo','getmainchaininfo','getblockhash','getrawtransaction','getmempoolentry','scantxoutset','gettxout','getasset','listassets','getpool','getlaunch','quoteroute','getassetlogo','sendrawtransaction']);
export function createRpcBackend(input,{fetcher=fetch}={}){
 const config=validateConnection(input),scans={ecash:Promise.resolve(),flush:Promise.resolve()},coinCache=new Map(),assets=new Map();
 async function rpc(chain,method,params=[]){
  if(!READS.has(method))throw Error('RPC method is not allowed');const node=config[chain];if(!node)throw Error('Unknown chain');
  const headers={'content-type':'application/json'};
  if(node.auth)headers.Authorization='Basic '+btoa(String.fromCharCode(...new TextEncoder().encode(node.auth)));
  let r;try{r=await fetcher(node.url,{method:'POST',headers,body:JSON.stringify({jsonrpc:'2.0',id:crypto.randomUUID(),method,params}),redirect:'error',cache:'no-store',signal:AbortSignal.timeout(30000)});}catch{const error=Error('Could not reach the '+(chain==='ecash'?'eCash':'Flush')+' RPC node');error.unavailable=true;throw error;}
  if(r.status===401||r.status===403){const error=Error('RPC authentication or node access was refused');error.unavailable=true;throw error;}
  const text=await r.text();let j;try{j=parseRpcJSON(text);}catch{throw Error('Node returned an invalid RPC response');}
  if(j.error){const error=Error('RPC '+method+': '+String(j.error.message||'request failed').slice(0,200));error.rejected=method==='sendrawtransaction';throw error;}if(!r.ok)throw Error('RPC request failed (HTTP '+r.status+')');return j.result;
 }
 async function status(){
  const [l1,l2,l1hash,l2hash,main]=await Promise.all([rpc('ecash','getblockchaininfo'),rpc('flush','getblockchaininfo'),rpc('ecash','getblockhash',[BETANET_CHECKPOINT.height]),rpc('flush','getblockhash',[0]),rpc('flush','getmainchaininfo')]);
  if(l1hash!==BETANET_CHECKPOINT.hash||!['main','ecashbeta'].includes(l1.chain))throw Error('The eCash RPC endpoint is not eCash betanet');
  if(l2hash!==FLUSH_GENESIS||l2.chain!=='ecashbeta'||main.slot!==99)throw Error('The Flush RPC endpoint is not betanet slot 99');
  return {network:'ecashbeta',slot:99,height:l2.blocks,headers:l2.headers,syncing:Boolean(l1.initialblockdownload||l2.initialblockdownload),mainchain_height:l1.blocks,mode:'rpc'};
 }
 function amountUnits(value,places=8){const text=String(value);if(/^0(?:\.0+)?$/.test(text))return 0n;return units(text,places);}
 async function coins(chain,addr){
  const mine=hex(address.toOutputScript(addr,chainNetwork(chain))),cached=coinCache.get(chain+addr);if(cached&&Date.now()-cached.at<8000)return cached.data;
  let release;const previous=scans[chain];scans[chain]=new Promise(r=>release=r);await previous;
  try{
   const fresh=coinCache.get(chain+addr);if(fresh&&Date.now()-fresh.at<8000)return fresh.data;
   const scan=await rpc(chain,'scantxoutset',['start',['addr('+addr+')']]);if(!scan?.success)throw Error('The node UTXO scan was interrupted');if(scan.unspents.length>1000)throw Error('This address has too many outputs; consolidate it first');
   const utxos=[];
   for(let i=0;i<scan.unspents.length;i+=5)utxos.push(...(await Promise.all(scan.unspents.slice(i,i+5).map(async u=>{
    const out=await rpc(chain,'gettxout',[u.txid,u.vout,true]);if(!out)return null;
    if(out.scriptPubKey.hex!==mine)throw Error('Node returned an output owned by another address');
    const value_sat=amountUnits(out.value).toString();const token=chain==='flush'?(Object.hasOwn(out,'token')?normalizeToken(out.token):(value_sat==='0'?{kind:255}:null)):null;
    return {txid:u.txid,vout:u.vout,value_sat,scriptPubKey:mine,coinbase:out.coinbase,confirmations:out.confirmations,token};
   }))).filter(Boolean));
   const data={address:addr,height:scan.height,chain,utxos,token_metadata_available:!utxos.some(u=>u.token?.kind===255)};coinCache.set(chain+addr,{at:Date.now(),data});return data;
  }finally{release();}
 }
 function ref(value){return /^[0-9a-f]{64}$/.test(value)?'0x'+value:value;}
 function normalizeAsset(a){return {id:a.asset,ticker:a.name||a.label,display_name:a.display_name||a.name||a.label,info:a.data?.info||'',decimals:a.decimals,supply:a.supply,fixed_supply:a.fixed,seq:a.seq,has_logo:Boolean(a.logo)};}
 async function asset(id){if(id==='ECX')return {id:'ECX',ticker:'ECX',decimals:8};if(assets.has(id))return assets.get(id);const a=normalizeAsset(await rpc('flush','getasset',[ref(id)]));assets.set(a.id,a);return a;}
 async function api(path){
  const url=new URL(path,'https://wallet.invalid'),p=url.pathname.split('/').filter(Boolean).slice(2);
  if(p[0]==='assets'&&!p[1]){const list=await rpc('flush','listassets',[Math.min(100,Number(url.searchParams.get('limit')||100)),0]);const items=list.map(normalizeAsset);for(const a of items)assets.set(a.id,a);return {items};}
  if(p[0]==='assets'&&p[1])return asset(p[1]);
  if(p[0]==='pools'&&p[1]){const pool=await rpc('flush','getpool',[p[1]]);return {...pool,asset_a_id:pool.asset_a_id==='0'.repeat(64)?null:pool.asset_a_id,asset_b_id:pool.asset_b_id==='0'.repeat(64)?null:pool.asset_b_id};}
  if(p[0]==='launches'&&p[1]){const l=await rpc('flush','getlaunch',[ref(p[1])]);return {...l,id:l.token,state:l.status,pool_id:l.pool};}
  if(p[0]==='quote'&&p[1]==='swap'){
   const from=url.searchParams.get('from'),to=url.searchParams.get('to'),amount=url.searchParams.get('amount'),out=await asset(to),slippage=Number(url.searchParams.get('slippage_bps')||100);
   if(!Number.isInteger(slippage)||slippage<0||slippage>5000)throw Error('Invalid slippage');
   const q=await rpc('flush','quoteroute',[ref(from),amount,ref(to),4,5]);const best=q.routes?.[0];if(!best)throw Error('No pool route trades this pair');
   const exact=amountUnits(best.amount_out,out.decimals),min=exact*BigInt(10000-slippage)/10000n;if(min<=0n)throw Error('Trade is too small');
   return {amount_out:String(best.amount_out),amount_out_units:exact.toString(),min_out_units:min.toString(),best:{pools:best.pools,path_ids:best.path_ids}};
  }
  throw Error('This operation is not supported by the RPC connection');
 }
 async function holdings(addr){const c=await coins('flush',addr),byId=new Map();for(const u of c.utxos)if(u.token?.kind===0)byId.set(u.token.id,(byId.get(u.token.id)||0n)+BigInt(u.token.amount_units));return {items:[...byId].map(([asset_id,n])=>({asset_id,kind:'asset',amount_units:n.toString()})),unavailable:!c.token_metadata_available};}
 async function logo(id){try{const l=await rpc('flush','getassetlogo',[ref(id)]);if(!['image/png','image/jpeg'].includes(l.mime)||l.base64?.length>44000||!/^[A-Za-z0-9+/]*={0,2}$/.test(l.base64||''))return null;return 'data:'+l.mime+';base64,'+l.base64;}catch{return null;}}
 async function broadcast(chain,raw){const tx=Transaction.fromHex(raw),burn=tx.outs.filter(o=>o.script[0]===106).reduce((s,o)=>s+o.value,0n);const txid=await rpc(chain,'sendrawtransaction',[raw,'0.001',decimal(burn)]);if(txid!==tx.getId())throw Error('Node returned an unexpected transaction ID');coinCache.clear();return {txid};}
 async function transactionStatus(chain,txid,outputs=[0,1,2,3]){
  if(!/^[a-f0-9]{64}$/.test(txid))throw Error('Invalid transaction ID');
  try{const tx=await rpc(chain,'getrawtransaction',[txid,true]);if(tx?.txid===txid)return {status:tx.confirmations>0?'confirmed':'pending',confirmations:tx.confirmations||0};}catch(error){if(error.unavailable)return {status:'unknown',confirmations:0,unavailable:true};}
  try{await rpc(chain,'getmempoolentry',[txid]);return {status:'pending',confirmations:0};}catch(error){if(error.unavailable)return {status:'unknown',confirmations:0,unavailable:true};}
  // Nodes without txindex still expose our unspent recipient/change outputs.
  for(const index of outputs.slice(0,16)){try{const out=await rpc(chain,'gettxout',[txid,index,true]);if(out)return {status:out.confirmations>0?'confirmed':'pending',confirmations:out.confirmations||0};}catch(error){if(error.unavailable)return {status:'unknown',confirmations:0,unavailable:true};}}
  return {status:'unknown',confirmations:0};
 }
 return {mode:'rpc',status,coins,api,holdings,logo,broadcast,transactionStatus,history:async()=>[]};
}
