import test from 'node:test';
import assert from 'node:assert/strict';
import {tradeMinimum,launchGuard} from '../src/trades.js';
const quote={amount_out_units:'10000000',min_out_units:'9000000'},asset='aa'.repeat(32),pool='bb'.repeat(32);
test('a website cannot lower the fresh wallet minimum, but a stricter intent is preserved',()=>{
 assert.equal(tradeMinimum(quote,6,'0.000001'),'9.9');assert.equal(tradeMinimum(quote,6,'9.95'),'9.95');
 assert.throws(()=>tradeMinimum(quote,6,'10.01'),/no longer meets/);
 assert.throws(()=>tradeMinimum({...quote,min_out_units:'10000001'},6),/Invalid quote minimum/);
 assert.throws(()=>tradeMinimum({...quote,amount_out_units:10000000},6),/Invalid quote amount/);
});
test('launch approval binds the asset and pool and refuses graduation or other states',()=>{
 assert.deepEqual(launchGuard({id:asset,pool_id:pool,state:'curve'},asset),{asset,pool});
 assert.deepEqual(launchGuard({token:asset,pool,status:'curve'},asset,pool),{asset,pool});
 assert.throws(()=>launchGuard({id:asset,pool_id:pool,state:'graduated'},asset,pool),/graduated/);
 assert.throws(()=>launchGuard({id:asset,pool_id:'cc'.repeat(32),state:'curve'},asset,pool),/pool changed/);
 assert.throws(()=>launchGuard({id:'dd'.repeat(32),pool_id:pool,state:'curve'},asset),/asset does not match/);
});
