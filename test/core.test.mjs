import test from 'node:test';
import assert from 'node:assert/strict';
import {Psbt,Transaction} from 'bitcoinjs-lib';
import {account,publicAccount,units,decimal,encryptVault,decryptVault,depositAddress,paymentPlan,tradePlan,signPlan,parseUri,hex,varint} from '../src/core.js';
const phrase='abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const a=account(phrase),b=account('legal winner thank year wave sausage worth useful legal winner thank yellow');
const coin={txid:'11'.repeat(32),vout:0,value_sat:'10000000',scriptPubKey:hex(a.script),confirmations:101,coinbase:false};
test('BIP84 derivation and exact decimal amounts',()=>{
 assert.equal(a.address,'bflx1q6rz28mcfaxtmd6v789l9rrlrusdprr9p6xyxyq');
 for(const [s,p] of [['0.00000001',8],['1',8],['1200.123456789012',12]])assert.equal(decimal(units(s,p),p),s);
 for(const n of ['1e2','-1','0','1.000000001','NaN','1.'])assert.throws(()=>units(n));
 assert.throws(()=>account('bad phrase'));
});
test('vault encryption roundtrip, wrong password, tamper and metadata mismatch',async()=>{
 const v=await encryptVault(phrase,'correct horse battery staple');assert(!JSON.stringify(v).includes('abandon'));
 assert.equal(await decryptVault(v,'correct horse battery staple'),phrase);
 await assert.rejects(decryptVault(v,'wrong password'));
 await assert.rejects(decryptVault({...v,address:b.address},'correct horse battery staple'));
 await assert.rejects(decryptVault({...v,ciphertext:'00'+v.ciphertext.slice(2)},'correct horse battery staple'));
});
test('deposit checksum matches upstream reference vectors',()=>{
 assert.match(depositAddress(a.address),/^s99_bflx1.*_[0-9a-f]{6}$/);
 assert.throws(()=>depositAddress('bc1qunrelated'));
});
test('Core VARINT encoding boundary cases',()=>{
 assert.equal(hex(varint(0)),'00');assert.equal(hex(varint(127)),'7f');assert.equal(hex(varint(128)),'8000');assert.equal(hex(varint(255)),'807f');assert.equal(hex(varint(256)),'8100');assert.equal(hex(varint(16384)),'ff00');
});
test('native send is signed locally with SIGHASH_ALL and conserves all satoshis',()=>{
 const p=paymentPlan({from:a.address,to:b.address,amount:'0.001',utxos:[coin]});
 const t=Transaction.fromHex(signPlan(p,phrase).hex);
 assert.equal(t.outs[0].value,100000n);assert.equal(t.outs.reduce((s,o)=>s+o.value,0n)+BigInt(p.fee_sat),10000000n);
 assert.equal(t.ins[0].witness[0].at(-1),1);assert.equal(hex(t.ins[0].witness[1]),hex(a.publicKey));
 assert.throws(()=>paymentPlan({from:a.address,to:b.address,amount:'1',utxos:[coin]}),/Insufficient/);
 assert.throws(()=>paymentPlan({from:a.address,to:b.address,amount:'0.001',utxos:[{...coin,scriptPubKey:hex(b.script)}]}),/another address/);
});
test('token send conserves token units and excludes other assets and controls from funding',()=>{
 const id='22'.repeat(32),token={...coin,txid:'33'.repeat(32),value_sat:'0',token:{kind:0,id,amount_units:'123400000'}};
 const p=paymentPlan({from:a.address,to:b.address,amount:'12',asset:id,decimals:6,utxos:[coin,token]}),t=Transaction.fromHex(signPlan(p,phrase).hex);
 assert.equal(t.ins.length,2);assert.equal(t.outs[0].value,0n);assert.equal(t.outs[1].value,0n);assert.equal(t.outs[2].script[0],106);
 assert.throws(()=>paymentPlan({from:a.address,to:b.address,amount:'12',asset:id,decimals:6,utxos:[coin,{...token,token:{...token.token,kind:1}}]}),/Insufficient token/);
});
test('swap marker binds absolute minimum, input amount, pool and our receiving script',()=>{
 const p=tradePlan({from:a.address,assetIn:'ECX',assetOut:'22'.repeat(32),amount:'0.001',decimalsIn:8,decimalsOut:6,minOut:'10',pools:['44'.repeat(32)],utxos:[coin]});
 const t=Transaction.fromHex(signPlan(p,phrase).hex);assert.equal(t.outs[1].value,100000n);assert.equal(t.outs[0].value,0n);assert.equal(hex(t.outs[0].script),hex(a.script));
 assert.equal(t.outs.reduce((s,o)=>s+o.value,0n)+BigInt(p.fee_sat),10000000n);
});
test('URI checks network, expiry, callback, duplicates, hidden text and unsupported operations',()=>{
 const uri='flush:connect?v=1&network=ecashbeta&exp=1000&origin=https%3A%2F%2Fflush.markets&callback=https%3A%2F%2Fflush.markets%2Fconnect&nonce=0123456789abcdef';
 assert.equal(parseUri(uri,900).verb,'connect');
 for(const s of [uri+'&v=1',uri.replace('ecashbeta','ecash'),uri.replace('exp=1000','exp=1'),uri.replace('nonce=','bad='),uri.replace('nonce=0123456789abcdef','nonce=%E2%80%AE0123456789abcdef'),uri.replace('connect?','launch?')])assert.throws(()=>parseUri(s,900));
});

test('trade requests require explicit floors, canonical IDs and valid escapes',()=>{
 const uri='flush:buy?v=1&network=ecashbeta&exp=1000&launch=FLUSH&asset='+('a'.repeat(64))+'&ecx=1&min_tokens=10&slippage_bps=100';
 assert.equal(parseUri(uri,900).verb,'buy');
 for(const bad of [uri.replace('&min_tokens=10',''),uri.replace('&ecx=1','&ecx=1e2'),uri.replace('launch=FLUSH','launch=%ZZ'),uri.replace('asset='+('a'.repeat(64)),'asset=OTHER'),uri.replace('slippage_bps=100','slippage_bps=9999')])assert.throws(()=>parseUri(bad,900));
});
