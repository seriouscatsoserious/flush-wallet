import test from 'node:test';
import assert from 'node:assert/strict';
import {Transaction} from 'bitcoinjs-lib';
import {account,hex,paymentPlan,signPlan,units} from '../src/core.js';
import {rpcURL,rpcOrigin,validateConnection,parseRpcJSON,createRpcBackend,BETANET_CHECKPOINT,FLUSH_GENESIS} from '../src/rpc.js';
import {sealConnection,openConnection,redactConnection} from '../src/connection.js';
import {normalizeToken} from '../src/token.js';
const phrase='abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const config={ecash:{url:'http://127.0.0.1:8332/',auth:'user:secret-l1'},flush:{url:'https://node.example/flush',auth:'__cookie__:secret-l2'}};
const id='44'.repeat(32),pool='55'.repeat(32),accounts={ecash:account(phrase,'ecash'),flush:account(phrase)},calls=[];
function mock({wrongNetwork=false,metadata=true,wrongScript=false,auth=false}={}){
 return async(url,options)=>{
  const chain=url===config.ecash.url?'ecash':'flush',req=JSON.parse(options.body);calls.push({chain,method:req.method,params:req.params,url,headers:options.headers});
  if(auth)return new Response('',{status:401});
  let result;
  switch(req.method){
   case 'getblockchaininfo':result={chain:chain==='ecash'?'main':'ecashbeta',blocks:chain==='ecash'?974013:19000,headers:chain==='ecash'?974013:19000,initialblockdownload:false};break;
   case 'getblockhash':result=wrongNetwork?'aa'.repeat(32):chain==='ecash'?BETANET_CHECKPOINT.hash:FLUSH_GENESIS;break;
   case 'getmainchaininfo':result={slot:99};break;
   case 'scantxoutset':result={success:true,height:19000,unspents:[{txid:'11'.repeat(32),vout:0},{txid:'22'.repeat(32),vout:0}]};break;
   case 'gettxout':result={value:req.params[0].startsWith('11')?'0.10000001':'0',scriptPubKey:{hex:wrongScript?'deadbeef':hex(accounts[chain].script)},coinbase:false,confirmations:100};if(metadata&&chain==='flush')result.token=req.params[0].startsWith('22')?{kind:0,id,amount_units:'123400000'}:null;break;
   case 'listassets':result=[{asset:id,name:'TEST',display_name:'Test asset',decimals:6,supply:'1000000.000000',fixed:true,data:{info:'A test token'},logo:{mime:'image/png'}}];break;
   case 'getasset':result={asset:id,name:'TEST',decimals:6};break;
   case 'quoteroute':result={routes:[{pools:[pool],path_ids:[null,id],amount_out:'123.123456'}]};break;
   case 'getpool':result={pool,asset_a_id:'0'.repeat(64),asset_b_id:id};break;
   case 'getlaunch':result={token:id,status:'curve',pool};break;
   case 'getassetlogo':result={mime:'image/png',base64:'YWJj'};break;
   case 'sendrawtransaction':result=Transaction.fromHex(req.params[0]).getId();break;
   default:throw Error('Unexpected method: '+req.method);
  }
  return new Response(JSON.stringify({jsonrpc:'2.0',id:req.id,result}),{status:200});
 };
}
test('RPC URL validation restricts HTTP to loopback and keeps credentials out of URLs',()=>{
 assert.equal(rpcURL('http://localhost:38994'),'http://localhost:38994/');assert.equal(rpcOrigin('https://node.example:1234/rpc'),'https://node.example/*');
 for(const bad of ['http://example.com','file:///tmp/cookie','https://user:pass@node.example/','https://node.example/?token=secret','javascript:alert(1)','http://127.0.0.1.evil.example:80'])assert.throws(()=>rpcURL(bad));
 assert.throws(()=>validateConnection({...config,flush:{url:config.flush.url,auth:'bad\n:header'}}));
});
test('RPC JSON parsing preserves decimal units and ignores apparent fields inside strings',()=>{
 const j=parseRpcJSON('{"amount_out":8198552.921648689600,"info":"\\\"value\\\":123","blocks":19000,"value":0.00000001,"decimals":12}');
 assert.equal(j.amount_out,'8198552.921648689600');assert.equal(j.value,'0.00000001');assert.equal(j.blocks,19000);assert.equal(j.info,'"value":123');assert.equal(units(j.value),1n);
});
test('RPC credentials are encrypted and bound to the wallet seed',async()=>{
 const e=await sealConnection(config,phrase);assert(!JSON.stringify(e).includes('secret-l1'));assert(!JSON.stringify(e).includes('node.example'));
 assert.deepEqual(await openConnection(e,phrase),config);assert(!JSON.stringify(redactConnection(config)).includes('secret'));
 await assert.rejects(openConnection(e,'legal winner thank year wave sausage worth useful legal winner thank yellow'));
 await assert.rejects(openConnection({...e,ciphertext:'00'+e.ciphertext.slice(2)},phrase));
});
test('pairing verifies eCash fork checkpoint and Flush genesis and reports auth failure',async()=>{
 const b=createRpcBackend(config,{fetcher:mock()});assert.equal((await b.status()).mode,'rpc');
 await assert.rejects(createRpcBackend(config,{fetcher:mock({wrongNetwork:true})}).status(),/not eCash betanet|not betanet slot/);
 await assert.rejects(createRpcBackend(config,{fetcher:mock({auth:true})}).status(),/authentication/);
 assert(calls.every(c=>[config.ecash.url,config.flush.url].includes(c.url)));assert(calls.some(c=>c.headers.Authorization==='Basic '+btoa(config.ecash.auth)));
});
test('RPC UTXOs and holdings use exact resolved token state, never node wallet keys',async()=>{
 const b=createRpcBackend(config,{fetcher:mock()}),c=await b.coins('flush',accounts.flush.address);assert.equal(c.utxos[0].value_sat,'10000001');assert.equal(c.utxos[1].token.amount_units,'123400000');assert.equal(c.token_metadata_available,true);
 assert.equal((await b.holdings(accounts.flush.address)).items[0].amount_units,'123400000');
 await assert.rejects(createRpcBackend(config,{fetcher:mock({wrongScript:true})}).coins('flush',accounts.flush.address),/another address/);
 const unknown=await createRpcBackend(config,{fetcher:mock({metadata:false})}).coins('flush',accounts.flush.address);assert.equal(unknown.token_metadata_available,false);assert.equal(unknown.utxos[1].token.kind,255);
 assert(!calls.some(c=>/sign|wallet|import/i.test(c.method)));
});
test('RPC adapts asset metadata, pool identities, logos and integer slippage floors',async()=>{
 const b=createRpcBackend(config,{fetcher:mock()}),list=await b.api('/api/v1/assets?limit=100');assert.equal(list.items[0].ticker,'TEST');
 assert.equal((await b.api('/api/v1/pools/'+pool)).asset_a_id,null);assert.equal((await b.api('/api/v1/launches/'+id)).pool_id,pool);
 const q=await b.api('/api/v1/quote/swap?from=ECX&to='+id+'&amount=0.001&slippage_bps=100');assert.equal(q.min_out_units,'121892221');assert.deepEqual(q.best.pools,[pool]);
 assert.equal(await b.logo(id),'data:image/png;base64,YWJj');assert.deepEqual(await b.history('flush',accounts.flush.address),[]);
});
test('RPC broadcasts only locally signed raw transactions to the chosen chain',async()=>{
 const b=createRpcBackend(config,{fetcher:mock()}),a=accounts.ecash;
 const p=paymentPlan({chain:'ecash',from:a.address,to:a.address,amount:'0.001',utxos:[{txid:'11'.repeat(32),vout:0,value_sat:'1000000',scriptPubKey:hex(a.script),coinbase:false,confirmations:10}]});
 const signed=signPlan(p,phrase),result=await b.broadcast('ecash',signed.hex);assert.equal(result.txid,signed.txid);assert.equal(Transaction.fromHex(signed.hex).locktime,499999999);
 const sent=calls.findLast(c=>c.method==='sendrawtransaction');assert.equal(sent.chain,'ecash');assert.equal(sent.params[0],signed.hex);assert.equal(sent.params[2],'0');
});
test('token annotations validate kind, ID and exact bounded unit strings',()=>{
 assert.deepEqual(normalizeToken({kind:'asset',asset_id:id,amount_units:'10'}),{kind:0,id,amount_units:'10'});assert.equal(normalizeToken(null),null);
 for(const token of [{kind:0,id,amount_units:10},{kind:0,id,amount_units:'-1'},{kind:7,id,amount_units:'1'},{kind:0,id:'bad',amount_units:'1'},{kind:0,id,amount_units:'99999999999999999999999'}])assert.throws(()=>normalizeToken(token));
});
