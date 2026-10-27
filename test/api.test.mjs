import test from 'node:test';
import assert from 'node:assert/strict';
import {api,explorerCoins,EXPLORERS} from '../src/api.js';
import {account,hex} from '../src/core.js';

test('Explorer quotes use the real public quote endpoint while market reads stay on Explorer',async()=>{
 const original=globalThis.fetch,calls=[];
 globalThis.fetch=async(url,options)=>{calls.push({url,options});return new Response(JSON.stringify({ok:true}));};
 try{
  const path='/api/v1/quote/swap?from=ECX&to=FLUSH&amount=0.001&slippage_bps=100';
  await api(path);await api('/api/v1/assets?limit=100');
  assert.equal(calls[0].url,'https://flush.markets'+path);
  assert.equal(calls[1].url,EXPLORERS.flush+'/api/v1/flush/market/assets?limit=100');
 }finally{globalThis.fetch=original;}
});

test('Explorer outputs explicitly marked unspendable never enter transaction funding',async()=>{
 const original=globalThis.fetch,a=account('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'),calls=[];
 const confirmed={txid:'ab'.repeat(32),vout:0,value:100000,status:{confirmed:true,block_height:100},token:null,spendable:true};
 const pending={txid:'cd'.repeat(32),vout:0,value:0,status:{confirmed:false},token:{kind:0,id:'ef'.repeat(32),amount_units:'500'},spendable:false};
 globalThis.fetch=async url=>{
  calls.push(url);let data;
  if(url.endsWith('/utxo'))data=[confirmed,pending];
  else if(url.endsWith('/api/blocks/tip/height'))return new Response('110');
  else if(url.endsWith('/api/tx/'+confirmed.txid))data={txid:confirmed.txid,vout:[{scriptpubkey:hex(a.script),value:confirmed.value}],vin:[{is_coinbase:false}]};
  else if(url.endsWith('/api/address/'+a.address))data={address:a.address};
  else throw Error('Unexpected request '+url);
  return new Response(JSON.stringify(data));
 };
 try{
  const result=await explorerCoins('flush',a.address);
  assert.equal(result.utxos.length,1);assert.equal(result.utxos[0].txid,confirmed.txid);
  assert(!calls.some(url=>url.endsWith(pending.txid)));
 }finally{globalThis.fetch=original;}
});
