import {createExplorerBackend} from './api.js';
import {createRpcBackend,validateConnection,rpcOrigin} from './rpc.js';
import {sealConnection,openConnection,redactConnection} from './connection.js';
import {newMnemonic,encryptVault,decryptVault,publicAccounts,checkRecovery,depositAddress,paymentPlan,tradePlan,parseUri,decimal,hex} from './core.js';
let mnemonic=null,lockAt=0,plan=null,pendingReply=null,pendingWindow=null;
let rpcBackend=null,rpcConfig=null,connectionGeneration=0,lockTimer=null;
const store=chrome.storage.local;
async function protectStorage(){await store.setAccessLevel({accessLevel:'TRUSTED_CONTEXTS'});await chrome.storage.session.setAccessLevel({accessLevel:'TRUSTED_CONTEXTS'});}
protectStorage();chrome.runtime.onInstalled.addListener(protectStorage);
const vault=async()=>(await store.get('vault')).vault;
const uriKey=async s=>hex(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))));
function lock(){mnemonic=null;rpcBackend=null;rpcConfig=null;plan=null;clearTimeout(lockTimer);}
function setUnlocked(phrase){mnemonic=phrase;lockAt=Date.now()+120000;clearTimeout(lockTimer);lockTimer=setTimeout(lock,120000);}
const unlocked=()=>{if(Date.now()>lockAt)lock();return Boolean(mnemonic);};
async function status(){const v=await vault();return {account:v?{address:v.address,publicKey:v.publicKey,path:v.path,accounts:v.accounts}:null,unlocked:unlocked(),connectionMode:(await store.get('connectionMode')).connectionMode||'explorer'};}
const explorer=createExplorerBackend();
async function backend(){
 const {connectionMode,rpcConnection}=await store.get(['connectionMode','rpcConnection']);
 if(connectionMode!=='rpc')return explorer;
 if(!unlocked())throw Error('Unlock the wallet to use your RPC connection');
 if(!rpcBackend){rpcConfig=validateConnection(await openConnection(rpcConnection,mnemonic));rpcBackend=createRpcBackend(rpcConfig);}
 return rpcBackend;
}
async function connectionDetails(){const mode=(await store.get('connectionMode')).connectionMode;if(mode!=='rpc')return {mode:'explorer'};await backend();return redactConnection(rpcConfig);}
async function saveConnection(input){
 if(!unlocked())throw Error('Unlock the wallet before pairing a node');
 const draft=validateConnection(input);if((await store.get('connectionMode')).connectionMode==='rpc'){await backend();for(const chain of ['ecash','flush'])if(!draft[chain].auth&&draft[chain].url===rpcConfig[chain].url)draft[chain].auth=rpcConfig[chain].auth;}
 const config=validateConnection(draft),origins=[...new Set(['ecash','flush'].map(c=>rpcOrigin(config[c].url)))];
 if(!await chrome.permissions.contains({origins}))throw Error('Allow Chrome access to the selected node addresses before pairing');
 const candidate=createRpcBackend(config),report=await candidate.status();
 if(!unlocked())throw Error('Wallet locked during pairing; unlock and try again');
 const encrypted=await sealConnection(config,mnemonic);
 await store.set({connectionMode:'rpc',rpcConnection:encrypted});rpcConfig=config;rpcBackend=candidate;connectionGeneration++;plan=null;
 return {connection:redactConnection(config),report};
}
async function useExplorer(){
 const old=(await store.get('rpcConnection')).rpcConnection;let origins=[];
 if(old&&unlocked()){try{const config=rpcConfig||await openConnection(old,mnemonic);origins=[...new Set(['ecash','flush'].map(c=>rpcOrigin(config[c].url)))];}catch{}}
 await store.remove('rpcConnection');await store.set({connectionMode:'explorer'});rpcBackend=null;rpcConfig=null;connectionGeneration++;plan=null;
 for(const origin of origins)if(!chrome.runtime.getManifest().host_permissions.includes(origin))await chrome.permissions.remove({origins:[origin]});
 return {mode:'explorer'};
}
async function updateAccounts(phrase){const v=await vault();if(!v)throw Error('No wallet');await store.set({vault:{...v,accounts:publicAccounts(phrase)}});}
async function myCoins(chain='flush',b){b||=await backend();const v=await vault();if(!v)throw Error('Create or import a wallet');const addr=chain==='flush'?v.address:v.accounts?.ecash.address;if(!addr)throw Error('Unlock this wallet to add its eCash address');return b.coins(chain,addr);}
async function resolveAsset(id,b){b||=await backend();if(id==='ECX')return {id:'ECX',ticker:'ECX',decimals:8};const a=await b.api('/api/v1/assets/'+encodeURIComponent(id));return a.asset||a;}
async function prepareTrade(args,b){
 b||=await backend();const generation=connectionGeneration,v=await vault(),[inAsset,outAsset,coins]=await Promise.all([resolveAsset(args.from,b),resolveAsset(args.to,b),myCoins('flush',b)]);
 if(!coins.token_metadata_available&&args.from!=='ECX')throw Error('Token signing metadata is temporarily unavailable; try again shortly');
 const quote=await b.api('/api/v1/quote/swap?'+new URLSearchParams({from:args.from==='ECX'?'ECX':args.from,to:args.to==='ECX'?'ECX':args.to,amount:args.amount,slippage_bps:'100'}));
 const minOut=args.minOut||decimal(quote.min_out_units,outAsset.decimals),pools=args.pools||quote.best.pools;
 if(pools.some(p=>!/^[a-f0-9]{64}$/.test(p)))throw Error('Invalid route');
 // Resolve each named pool independently and bind the path to the approved endpoints.
 let side=inAsset.id==='ECX'?'':inAsset.id;
 for(const id of pools){const p=await b.api('/api/v1/pools/'+id);const a=p.asset_a_id||'',other=p.asset_b_id||'';if(side!==a&&side!==other)throw Error('Pool does not match input asset');side=side===a?other:a;}
 if(side!==(outAsset.id==='ECX'?'':outAsset.id))throw Error('Pool does not match output asset');
 if(generation!==connectionGeneration)throw Error('Connection changed; review this transaction again');
 plan=tradePlan({from:v.address,assetIn:inAsset.id,assetOut:outAsset.id,amount:args.amount,decimalsIn:inAsset.decimals,decimalsOut:outAsset.decimals,minOut,pools,utxos:coins.utxos.filter(u=>!u.coinbase||u.confirmations>=100)});plan.connectionGeneration=generation;
 plan.summary.tickerIn=inAsset.ticker;plan.summary.tickerOut=outAsset.ticker;plan.summary.quote=quote.amount_out;return plan;
}
async function requestPlan(request){
 const b=await backend();
 if(request.verb==='buy'||request.verb==='sell'){
  const a=await resolveAsset(request.asset,b);if(a.ticker!==request.launch)throw Error('Ticker does not match asset ID');
  const l=await b.api('/api/v1/launches/'+request.asset);if(l.state==='graduated')throw Error('Use the graduated pool');
  return prepareTrade({from:request.verb==='buy'?'ECX':request.asset,to:request.verb==='buy'?request.asset:'ECX',amount:request.ecx||request.tokens,minOut:request.min_tokens||request.min_ecx,pools:[l.pool_id]},b);
 }
 if(request.verb==='swap'||request.verb==='route'){
  const refs=await b.api('/api/v1/assets?limit=100');
  const resolve=t=>t==='ECX'?'ECX':refs.items.find(a=>a.ticker===t)?.id;
  const from=resolve(request.from),to=resolve(request.to);if(!from||!to)throw Error('Asset not found');
  return prepareTrade({from,to,amount:request.amount,minOut:request.min_out,pools:(request.pools||request.pool).split(',')},b);
 }
 throw Error('Unsupported action');
}
async function internal(m){
 switch(m.type){
 case 'STATE':return status();
 case 'CONNECTION':return connectionDetails();
 case 'PAIR_RPC':return saveConnection(m.connection);
 case 'USE_EXPLORER':return useExplorer();
 case 'GENERATE':return {mnemonic:newMnemonic()};
 case 'CREATE':if(await vault())throw Error('Wallet already exists');{if(!m.imported&&!checkRecovery(m.mnemonic,m.backupCheck?.indices,m.backupCheck?.answers))throw Error('Recovery words do not match');const v=await encryptVault(m.mnemonic,m.password);await store.set({vault:v});setUnlocked(m.mnemonic);return status();}
 case 'UNLOCK':{const phrase=await decryptVault(await vault(),m.password);await updateAccounts(phrase);setUnlocked(phrase);return status();}
 case 'LOCK':lock();return status();
 case 'DASHBOARD':{
  const v=await vault();if(!v)throw Error('No wallet');const b=await backend(),[coinResults,network,assets,holdings]=await Promise.all([Promise.allSettled([myCoins('flush',b),myCoins('ecash',b)]),b.status(),b.api('/api/v1/assets?limit=100'),b.holdings(v.address)]);
  const coins=coinResults[0].status==='fulfilled'?coinResults[0].value:null,l1coins=coinResults[1].status==='fulfilled'?coinResults[1].value:null;
  const held=holdings.items.filter(h=>h.kind==='asset');const known=new Set(assets.items.map(a=>a.id));
  for(const h of held){if(!known.has(h.asset_id)){assets.items.push(await resolveAsset(h.asset_id,b));known.add(h.asset_id);}}
  const logos=Object.fromEntries(await Promise.all(held.map(async h=>[h.asset_id,await b.logo(h.asset_id)])));
  const balance=coins?coins.utxos.filter(u=>!u.token&&(!u.coinbase||u.confirmations>=100)).reduce((s,u)=>s+BigInt(u.value_sat),0n).toString():null;
  const l1balance=l1coins?l1coins.utxos.filter(u=>!u.coinbase||u.confirmations>=100).reduce((s,u)=>s+BigInt(u.value_sat),0n).toString():null;
  return {coins,l1coins,network,assets:assets.items,holdings:held,logos,connectionMode:b.mode,tokenMetadataAvailable:!holdings.unavailable,balance_sat:balance,l1_balance_sat:l1balance,deposit:depositAddress(v.address),history:(await store.get('history')).history||[]};
 }
 case 'HISTORY':{const v=await vault();if(!v)throw Error('No wallet');const b=await backend(),results=await Promise.allSettled([b.history('ecash',v.accounts.ecash.address),b.history('flush',v.address)]);const entries=results.flatMap(r=>r.status==='fulfilled'?r.value:[]),merged=new Map(entries.map(t=>[t.chain+t.txid,t]));for(const t of (await store.get('history')).history||[]){const chain=t.chain||'flush',old=merged.get(chain+t.txid);merged.set(chain+t.txid,{...old,...t,chain});}return {items:[...merged.values()].sort((a,b)=>b.time-a.time),unavailableChains:results.flatMap((r,i)=>r.status==='rejected'?[i===0?'eCash':'Flush']:[]),localOnly:b.mode==='rpc'};}
 case 'PREPARE_SEND':{const generation=connectionGeneration,b=await backend(),chain=m.chain||'flush',v=await vault(),coins=await myCoins(chain,b),a=await resolveAsset(m.asset||'ECX',b);if(chain==='ecash'&&a.id!=='ECX')throw Error('Tokens are sent on Flush');if(chain==='flush'&&a.id!=='ECX'&&!coins.token_metadata_available)throw Error('Token signing metadata is temporarily unavailable; try again shortly');if(generation!==connectionGeneration)throw Error('Connection changed; review this transaction again');plan=paymentPlan({from:chain==='ecash'?v.accounts.ecash.address:v.address,to:m.to,amount:m.amount,asset:a.id,decimals:a.decimals,utxos:coins.utxos.filter(u=>!u.coinbase||u.confirmations>=100),chain});plan.connectionGeneration=generation;plan.summary.ticker=a.ticker;return plan;}
 case 'PREPARE_SWAP':return prepareTrade(m);
 case 'APPROVE':{
  if(!unlocked())throw Error('Unlock your wallet first');if(!plan||m.planId!==plan.id||plan.connectionGeneration!==connectionGeneration||Date.now()-plan.created>120000)throw Error('Quote expired or connection changed; review again');
  const approved=plan;plan=null;
  const b=await backend(),{signPlan}=await import('./core.js');if(!unlocked())throw Error('Unlock your wallet first');const signed=signPlan(approved,mnemonic),result=await b.broadcast(approved.chain||'flush',signed.hex);
  if(result.txid!==signed.txid)throw Error('Broadcast returned an unexpected transaction ID');
  const old=(await store.get('history')).history||[];await store.set({history:[{...approved.summary,chain:approved.chain||'flush',txid:result.txid,time:Date.now()},...old].slice(0,100)});return result;
 }
 case 'BACKUP':return {vault:await vault()};
 case 'RECOVERY':return {mnemonic:await decryptVault(await vault(),m.password)};
 case 'RESTORE':{if(await vault())throw Error('A wallet already exists');const phrase=await decryptVault(m.vault,m.password);await store.set({vault:{...m.vault,accounts:publicAccounts(phrase)}});setUnlocked(phrase);return status();}
 case 'PENDING':return (await chrome.storage.session.get('pending')).pending||null;
 case 'PREPARE_PENDING':{const p=(await chrome.storage.session.get('pending')).pending;if(!p||Date.now()>p.expires)throw Error('Request expired');const r=parseUri(p.uri);if(r.verb==='connect'){const v=await vault();if(!v)throw Error('Create a wallet first');return {summary:{type:'connect',origin:p.origin,address:v.address},request:r};}return requestPlan(r);}
 case 'RESOLVE_PENDING':{
  const p=(await chrome.storage.session.get('pending')).pending;if(!p)throw Error('Request expired');let result;
  if(m.approved){const r=parseUri(p.uri);if(r.verb==='connect'){const v=await vault();if(!v)throw Error('No wallet');result={address:v.address,publicKey:v.publicKey,network:'ecashbeta'};if(!p.direct)await chrome.tabs.create({url:'https://flush.markets/connect#'+new URLSearchParams({address:v.address,nonce:r.nonce,network:'ecashbeta'})});}else result=await internal({type:'APPROVE',planId:m.planId});}
  if(m.approved){const used=(await chrome.storage.session.get('usedUris')).usedUris||{};used[await uriKey(p.uri)]=Number(parseUri(p.uri).exp);for(const [k,v] of Object.entries(used))if(v<Math.floor(Date.now()/1000))delete used[k];await chrome.storage.session.set({usedUris:used});}
  pendingReply?.(m.approved?{ok:true,result}:{ok:false,error:'User rejected'});pendingReply=null;await chrome.storage.session.remove('pending');return result||{rejected:true};
 }
 default:throw Error('Unknown wallet command');
 }
}
chrome.runtime.onMessage.addListener((m,sender,reply)=>{
 const trusted=sender.id===chrome.runtime.id&&sender.url?.startsWith(chrome.runtime.getURL(''));
 if(trusted){internal(m).then(result=>reply({ok:true,result})).catch(e=>reply({ok:false,error:e.message}));return true;}
 if(m.type!=='DAPP'||sender.frameId!==0||sender.origin!=='https://flush.markets'){reply({ok:false,error:'Origin not allowed'});return false;}
 (async()=>{
  if(m.method==='flush_requestAddress')m.uri='flush:connect?'+new URLSearchParams({v:'1',network:'ecashbeta',exp:String(Math.floor(Date.now()/1000)+600),origin:'https://flush.markets',callback:'https://flush.markets/connect',nonce:crypto.randomUUID().replaceAll('-','')});
  parseUri(m.uri);const used=(await chrome.storage.session.get('usedUris')).usedUris||{};if(used[await uriKey(m.uri)])throw Error('This request was already completed');
  const old=(await chrome.storage.session.get('pending')).pending;if(old&&old.expires>Date.now())throw Error('Another wallet request is pending');
  await chrome.storage.session.set({pending:{uri:m.uri,direct:m.method==='flush_requestAddress',origin:sender.origin,tabId:sender.tab.id,expires:Date.now()+120000}});pendingReply=reply;
  const w=await chrome.windows.create({url:chrome.runtime.getURL('popup.html')+'?approval=1',type:'popup',width:420,height:730});pendingWindow=w.id;
 })().catch(e=>reply({ok:false,error:e.message}));return true;
});
chrome.windows.onRemoved.addListener(id=>{if(id===pendingWindow){pendingReply?.({ok:false,error:'Wallet window closed'});pendingReply=null;pendingWindow=null;chrome.storage.session.remove('pending');}});
