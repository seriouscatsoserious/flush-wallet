import {address} from 'bitcoinjs-lib';
import {chainNetwork,hex,decimal} from './core.js';
import {normalizeToken} from './token.js';
const integer=value=>{if(!Number.isSafeInteger(value)||value<0)throw Error('Invalid transaction amount');return BigInt(value);};

// Only resolved input/output annotations count as token history. Marker bytes do
// not contain the final result of an executed trade and are never used here.
export function summarizeTransaction(tx,chain,addr,knownOutputs=new Map()){
 if(!/^[a-f0-9]{64}$/.test(tx.txid)||!Array.isArray(tx.vin)||!Array.isArray(tx.vout))throw Error('Invalid transaction history');
 const mine=hex(address.toOutputScript(addr,chainNetwork(chain)));
 const owned=out=>out?.scriptpubkey===mine;
 const inputsKnown=tx.vin.every(v=>v.is_coinbase||v.prevout);
 let input=0n,output=0n,complete=true,ours=false;
 const tokens=new Map();
 const record=(out,sign,point)=>{
  if(!owned(out))return;
  const value=integer(out.value);if(sign<0){input+=value;ours=true;}else output+=value;
  if(chain!=='flush')return;
  let token;
  if(Object.hasOwn(out,'token'))token=normalizeToken(out.token);
  else if(knownOutputs.has(point)){
   const known=knownOutputs.get(point);
   if(known.scriptPubKey!==mine||BigInt(known.value_sat)!==value)throw Error('History output does not match resolved state');
   token=known.token;
  }else{complete=false;return;}
  if(token?.kind===0)tokens.set(token.id,(tokens.get(token.id)||0n)+BigInt(sign)*BigInt(token.amount_units));
 };
 for(const vin of tx.vin){if(!vin.is_coinbase&&!vin.prevout)complete=false;record(vin.prevout,-1,vin.txid+':'+vin.vout);}
 tx.vout.forEach((out,n)=>record(out,1,tx.txid+':'+n));
 let fee=null;
 if(ours&&tx.vin.every(v=>owned(v.prevout))){
  if(Number.isSafeInteger(tx.fee)&&tx.fee>=0)fee=BigInt(tx.fee);
  else if(tx.vin.every(v=>v.prevout)){
   const computed=tx.vin.reduce((sum,v)=>sum+integer(v.prevout.value),0n)-tx.vout.reduce((sum,v)=>sum+integer(v.value),0n);
   if(computed>=0n)fee=computed;
  }
 }
 const net=output-input,native=net+(fee??0n),changes=[];
 if(inputsKnown&&native!==0n)changes.push({asset:'ECX',ticker:'ECX',decimals:8,direction:native>0n?'receive':'send',amount_units:(native<0n?-native:native).toString()});
 if(complete)for(const [asset,amount] of tokens)if(amount!==0n)changes.push({asset,direction:amount>0n?'receive':'send',amount_units:(amount<0n?-amount:amount).toString()});
 const directions=new Set(changes.map(c=>c.direction)),type=!inputsKnown?'unknown':directions.size>1?'swap':directions.size?[...directions][0]:'asset';
 return {txid:tx.txid,chain,type,amount:decimal(native<0n?-native:native),ticker:'ECX',changes,fee_sat:fee?.toString(),tokenDetailsUnavailable:chain==='flush'&&!complete,time:(tx.status?.block_time||0)*1000,confirmed:Boolean(tx.status?.confirmed),status:tx.status?.confirmed?'confirmed':'pending'};
}

export function mergeHistory(indexed,local){
 const entries=new Map(indexed.map(tx=>[(tx.chain||'flush')+tx.txid,tx]));
 for(const tx of local){
  const chain=tx.chain||'flush',key=chain+tx.txid,old=entries.get(key);
  entries.set(key,{...old,...tx,chain,...old?.confirmed?{status:'confirmed',confirmed:true}:{},...old?.changes?.length?{changes:old.changes}:{},time:old?.time||tx.time||0});
 }
 return [...entries.values()].sort((a,b)=>b.time-a.time);
}

export function movementText(change){
 const amount=Number.isInteger(change.decimals)?decimal(change.amount_units,change.decimals):change.amount_units;
 const symbol=change.ticker||(change.asset.slice(0,8)+'…'+change.asset.slice(-4));
 return `${change.direction==='send'?'Sent':'Received'} ${amount} ${symbol}${Number.isInteger(change.decimals)?'':' units'}`;
}
export function activityTitle(tx){
 if(tx.changes?.length===1)return movementText(tx.changes[0]);
 if(tx.changes?.length>1)return tx.type==='swap'?'Swap':'Asset transfer';
 if(tx.type==='swap')return `Swapped ${tx.amount} ${tx.tickerIn||tx.assetIn||'ECX'}`;
 if(tx.type==='asset')return 'Asset transaction';
 if(tx.type==='unknown')return 'Transaction';
 return `${tx.type==='send'?'Sent':'Received'} ${tx.amount} ${tx.ticker||tx.asset||'ECX'}`;
}
