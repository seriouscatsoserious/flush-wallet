import test from 'node:test';
import assert from 'node:assert/strict';
import {account,hex} from '../src/core.js';
import {summarizeTransaction,mergeHistory,activityTitle,movementText} from '../src/history.js';
const mine=account('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about');
const script=hex(mine.script),asset='aa'.repeat(32),txid='bb'.repeat(32);
const output=(value,token,owned=true)=>({scriptpubkey:owned?script:'0014'+'ff'.repeat(20),value,token});
const token=amount_units=>({kind:0,id:asset,amount_units});
const tx=(vin,vout)=>({txid,vin,vout,status:{confirmed:true,block_time:100},fee:1000});
test('token sends subtract token change exactly and separate the native fee',()=>{
 const result=summarizeTransaction(tx([{prevout:output(100000,null)},{prevout:output(0,token('9007199254740993'))}],
 [output(99000,null),output(0,token('9007199254740793')),output(0,token('200'),false)]),'flush',mine.address);
 assert.deepEqual(result.changes,[{asset,direction:'send',amount_units:'200'}]);assert.equal(result.fee_sat,'1000');assert.equal(result.tokenDetailsUnavailable,false);
 assert.equal(movementText({...result.changes[0],ticker:'FLUSH',decimals:6}),'Sent 0.0002 FLUSH');
});
test('swap history records the actual token receipt and ECX payment, excluding its fee',()=>{
 const result=summarizeTransaction(tx([{prevout:output(200000000,null)}],[output(99999000,null),output(100000000,null,false),output(0,token('5000000000'))]),'flush',mine.address);
 assert.equal(result.type,'swap');assert.equal(result.changes[0].amount_units,'100000000');assert.equal(result.changes[1].amount_units,'5000000000');assert.equal(activityTitle(result),'Swap');
});
test('current resolved outputs recover token receipts but unknown spent token inputs never become invented receipts',()=>{
 const receive=tx([{prevout:output(100000,null,false)}],[output(0,undefined)]);
 delete receive.vout[0].token;
 const known=new Map([[txid+':0',{scriptPubKey:script,value_sat:'0',token:token('1234567890123456')}] ]);
 assert.equal(summarizeTransaction(receive,'flush',mine.address,known).changes[0].amount_units,'1234567890123456');
 const spent=output(0,undefined);delete spent.token;receive.vin.push({prevout:spent});
 const incomplete=summarizeTransaction(receive,'flush',mine.address,known);assert.equal(incomplete.tokenDetailsUnavailable,true);assert.equal(incomplete.changes.length,0);
 known.get(txid+':0').scriptPubKey='00';assert.throws(()=>summarizeTransaction(receive,'flush',mine.address,known),/does not match/);
});
test('history ownership uses scripts and rejects unsafe numeric values',()=>{
 const spoof=output(500,null,false);spoof.scriptpubkey_address=mine.address;
 assert.equal(summarizeTransaction(tx([{is_coinbase:true}],[spoof]),'flush',mine.address).changes.length,0);
 assert.throws(()=>summarizeTransaction(tx([],[output(Number.MAX_SAFE_INTEGER+1,null)]),'flush',mine.address),/Invalid transaction amount/);
});
test('confirmed indexed history wins over a stale local pending status without losing local intent',()=>{
 const changes=[{asset,ticker:'FLUSH',decimals:6,direction:'send',amount_units:'200'}];
 const merged=mergeHistory([{txid,chain:'flush',confirmed:true,status:'confirmed',time:20,changes}],[{txid,chain:'flush',status:'pending',time:10,to:'recipient',amount:'0.0002',ticker:'FLUSH',type:'send'}]);
 assert.equal(merged.length,1);assert.equal(merged[0].status,'confirmed');assert.equal(merged[0].to,'recipient');assert.equal(merged[0].time,20);assert.equal(activityTitle(merged[0]),'Sent 0.0002 FLUSH');
});
