import test from 'node:test';
import assert from 'node:assert/strict';
import {account,hex,paymentPlan,coinbaseMature} from '../src/core.js';
const phrase='abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
test('Flush deposit credits can fund the next block while L1 coinbases mature after 100 confirmations',()=>{
 assert(coinbaseMature({coinbase:true,confirmations:1},'flush'));
 assert(!coinbaseMature({coinbase:true,confirmations:0},'flush'));
 assert(!coinbaseMature({coinbase:true,confirmations:99},'ecash'));
 assert(coinbaseMature({coinbase:true,confirmations:100},'ecash'));
 for(const chain of ['flush','ecash']){
  const a=account(phrase,chain),coin={txid:'ef'.repeat(32),vout:1,value_sat:'20000000',scriptPubKey:hex(a.script),coinbase:true,confirmations:1};
  const make=()=>paymentPlan({from:a.address,to:a.address,amount:'0.01',chain,utxos:[coin]});
  if(chain==='flush')assert(make().fee_sat);else assert.throws(make,/Immature coinbase/);
 }
});
