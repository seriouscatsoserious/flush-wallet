import test from 'node:test';
import assert from 'node:assert/strict';
import {Transaction,Psbt,script} from 'bitcoinjs-lib';
import {secp256k1} from '@noble/curves/secp256k1.js';
import {account,publicAccounts,paymentPlan,signPlan,hex,concat,recoveryChallenge,checkRecovery,encryptVault,decryptVault} from '../src/core.js';
const seed='abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const l1=account(seed,'ecash'),l2=account(seed,'flush');
test('L1 uses BIP84 Bitcoin-style eCash addresses; existing Flush identity is unchanged',()=>{
 assert.equal(l1.address,'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu');
 assert.equal(l2.address,'bflx1q6rz28mcfaxtmd6v789l9rrlrusdprr9p6xyxyq');
 assert.notEqual(hex(l1.publicKey),hex(l2.publicKey));assert.throws(()=>account(seed,'bitcoin'));
});
test('L1 sends sign with the L1 key and bind all outputs',()=>{
 const p=paymentPlan({chain:'ecash',from:l1.address,to:l1.address,amount:'0.001',utxos:[{txid:'aa'.repeat(32),vout:0,value_sat:'1000000',scriptPubKey:hex(l1.script),coinbase:false,confirmations:1}]});
 const tx=Transaction.fromHex(signPlan(p,seed).hex),sig=script.signature.decode(tx.ins[0].witness[0]);
 const digest=tx.hashForWitnessV0(0,concat([0x76,0xa9,20],l1.script.slice(2),[0x88,0xac]),1000000n,1);
 assert(secp256k1.verify(sig.signature,digest,l1.publicKey,{prehash:false,format:'compact'}));
 assert(!secp256k1.verify(sig.signature,digest,l2.publicKey,{prehash:false,format:'compact'}));
 assert.equal(p.chain,'ecash');assert.equal(p.summary.chain,'ecash');
 assert.throws(()=>paymentPlan({chain:'ecash',from:l1.address,to:l2.address,amount:'1',utxos:[]}),/eCash/);
 assert.throws(()=>paymentPlan({chain:'ecash',from:l1.address,to:l1.address,asset:'aa'.repeat(32),amount:'1',utxos:[]}),/only be sent on Flush/);
});
test('new vault restores both accounts; legacy vaults still decrypt to the same seed',async()=>{
 const v=await encryptVault(seed,'correct password 123');assert.deepEqual(v.accounts,publicAccounts(seed));
 const old={...v};delete old.accounts;assert.equal(await decryptVault(old,'correct password 123'),seed);
});
test('recovery quiz chooses three distinct positions and rejects wrong, missing or duplicate answers',()=>{
 const indices=recoveryChallenge(),words=seed.split(' ');assert.equal(indices.length,3);assert.equal(new Set(indices).size,3);
 assert(checkRecovery(seed,indices,indices.map(i=>words[i])));
 assert(!checkRecovery(seed,indices,['wrong','wrong','wrong']));assert(!checkRecovery(seed,[0,0,0],['abandon','abandon','abandon']));assert(!checkRecovery(seed,indices,[]));
});
