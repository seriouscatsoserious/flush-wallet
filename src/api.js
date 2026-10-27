import {normalizeToken} from './token.js';
import {address,Transaction} from 'bitcoinjs-lib';
import {chainNetwork,hex,decimal} from './core.js';
import {summarizeTransaction} from './history.js';
export const EXPLORERS=Object.freeze({ecash:'https://explorer.blockfab.org/betanet',flush:'https://explorer.blockfab.org/betanet/flush'});
export function explorerBase(chain='flush'){const base=EXPLORERS[chain];if(!base)throw Error('Unknown chain');return base;}
async function request(url,options={},json=true){
 const r=await fetch(url,{...options,signal:AbortSignal.timeout(30000)});
 const text=await r.text();let data=text;
 if(json){try{data=JSON.parse(text);}catch{throw Error('Explorer returned an invalid response');}}
 if(!r.ok){const error=Error(typeof data?.error==='string'?data.error:data?.error?.message||String(text).slice(0,180)||'Explorer unavailable');error.httpStatus=r.status;throw error;}
 return data;
}
// The Explorer proxies market reads, but deliberately excludes REST quote routes.
// Quotes use the launch site's public node API; balances and broadcasts stay on Explorer.
export async function api(path,options={}){
 if(path.startsWith('/api/v1/quote/swap?'))return request('https://flush.markets'+path,options);
 if(path.startsWith('/api/v1/'))return request(EXPLORERS.flush+'/api/v1/flush/market/'+path.slice('/api/v1/'.length),options);
 throw Error('Unsupported explorer API path');
}
export function tokenLogo(id){if(!/^[a-f0-9]{64}$/.test(id))return null;return EXPLORERS.flush+'/api/v1/flush/logo/'+id;}
export async function explorerStatus(){
 const [l1,l2,chain]=await Promise.all([
  request(EXPLORERS.ecash+'/api/blocks/tip/height',{},false),
  request(EXPLORERS.flush+'/api/v1/flush/rpc/getblockchaininfo'),
  request(EXPLORERS.ecash+'/api/v1/chain'),
 ]);
 if(chain.network!=='ecashbeta'||!chain.mainchain||l2.chain!=='ecashbeta')throw Error('Explorer is on another network');
 return {network:'ecashbeta',slot:99,height:l2.blocks,headers:l2.headers,syncing:l2.initialblockdownload,mainchain_height:Number(l1)};
}
const transactions=new Map();
async function transaction(chain,txid){
 const key=chain+txid,cached=transactions.get(key);if(cached&&Date.now()-cached.at<15000)return cached.data;
 const data=await request(explorerBase(chain)+'/api/tx/'+txid);if(data.txid!==txid)throw Error('Explorer returned a different transaction');
 if(transactions.size>=250)transactions.delete(transactions.keys().next().value);transactions.set(key,{at:Date.now(),data});return data;
}
export async function explorerCoins(chain,addr){
 const network=chainNetwork(chain),mine=hex(address.toOutputScript(addr,network)),base=explorerBase(chain);
 const [list,heightText,balances]=await Promise.all([
  request(base+'/api/address/'+addr+'/utxo'),request(base+'/api/blocks/tip/height',{},false),request(base+'/api/address/'+addr),
 ]);
 if(!Array.isArray(list)||list.length>1000)throw Error('This address has too many outputs; consolidate it first');
 const height=Number(heightText);if(!Number.isSafeInteger(height))throw Error('Invalid explorer height');
 const utxos=[];
 // Small groups bound requests without serialising the entire address.
 for(let start=0;start<list.length;start+=5){
  const group=await Promise.all(list.slice(start,start+5).map(async u=>{
   if(u.spendable===false)return null;
   if(!/^[a-f0-9]{64}$/.test(u.txid)||!Number.isSafeInteger(u.vout)||u.vout<0||!Number.isSafeInteger(u.value)||u.value<0)throw Error('Invalid explorer output');
   const tx=await transaction(chain,u.txid),out=tx.vout?.[u.vout];
   if(!out||out.scriptpubkey!==mine||out.value!==u.value)throw Error('Explorer output does not match your address');
   const confirmations=u.status.confirmed?Math.max(0,height-u.status.block_height+1):0;
   return {txid:u.txid,vout:u.vout,value_sat:String(u.value),scriptPubKey:out.scriptpubkey,confirmations,coinbase:Boolean(tx.vin?.[0]?.is_coinbase),token:chain==='flush'?(Object.hasOwn(u,'token')?normalizeToken(u.token):(u.value===0?{kind:255}:null)):null};
  }));utxos.push(...group.filter(Boolean));
 }
 // Flush token inputs are spendable only when the explorer supplies resolved state.
 const token_metadata_available=chain!=='flush'||!utxos.some(u=>u.token?.kind===255);
 return {address:addr,height,chain,utxos:utxos.filter(u=>!u.spent),stats:balances,token_metadata_available};
}
export async function explorerHoldings(addr){return api('/api/v1/addresses/'+addr+'/holdings');}
export async function explorerHistory(chain,addr){
 const txs=await request(explorerBase(chain)+'/api/address/'+addr+'/txs');if(!Array.isArray(txs))throw Error('Invalid transaction history');
 if(txs.length>100)throw Error('Explorer returned too many history entries');
 const coins=chain==='flush'?await explorerCoins(chain,addr).catch(()=>null):null;
 const known=new Map((coins?.utxos||[]).filter(u=>u.token?.kind!==255).map(u=>[u.txid+':'+u.vout,u]));
 const history=txs.map(tx=>summarizeTransaction(tx,chain,addr,known));
 const ids=[...new Set(history.flatMap(tx=>tx.changes.filter(c=>c.asset!=='ECX').map(c=>c.asset)))];
 const metadata=new Map();
 for(let start=0;start<Math.min(ids.length,100);start+=5)await Promise.all(ids.slice(start,start+5).map(async id=>{
  try{const raw=await api('/api/v1/assets/'+id),a=raw.asset||raw;if(a.id!==id||!Number.isInteger(a.decimals)||a.decimals<0||a.decimals>12)throw Error('Invalid asset identity');metadata.set(id,a);}catch{}
 }));
 for(const tx of history)for(const c of tx.changes){const a=metadata.get(c.asset);if(a)Object.assign(c,{ticker:String(a.ticker||a.display_name||c.asset).slice(0,96),decimals:a.decimals});}
 return history;
}
export async function explorerBroadcast(chain,raw){
 const tx=Transaction.fromHex(raw),burn=tx.outs.filter(o=>o.script[0]===106).reduce((s,o)=>s+o.value,0n);
 const query=new URLSearchParams({maxfeerate:'0.001',maxburnamount:decimal(burn)});
 let result;try{result=await request(explorerBase(chain)+'/api/tx?'+query,{method:'POST',headers:{'content-type':'text/plain'},body:raw},false);}catch(error){error.rejected=error.httpStatus>=400&&error.httpStatus<500;throw error;}
 const txid=result.trim();if(!/^[a-f0-9]{64}$/.test(txid)||txid!==tx.getId())throw Error('Explorer returned an unexpected transaction ID');
 return {txid};
}
export async function explorerTransactionStatus(chain,txid){
 try{const tx=await request(explorerBase(chain)+'/api/tx/'+txid);if(tx.txid!==txid)throw Error('Transaction ID mismatch');return {status:tx.status?.confirmed?'confirmed':'pending',confirmations:tx.status?.confirmed?1:0};}catch(error){return {status:'unknown',confirmations:0,unavailable:error.httpStatus!==404};}
}
export function createExplorerBackend(){return {mode:'explorer',api,status:explorerStatus,coins:explorerCoins,holdings:explorerHoldings,broadcast:explorerBroadcast,transactionStatus:explorerTransactionStatus,history:explorerHistory,logo:async id=>tokenLogo(id)};}
