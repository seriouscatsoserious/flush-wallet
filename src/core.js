import {generateMnemonic,validateMnemonic,mnemonicToSeedSync} from '@scure/bip39';
import {wordlist} from '@scure/bip39/wordlists/english.js';
import {HDKey} from '@scure/bip32';
import {secp256k1} from '@noble/curves/secp256k1.js';
import {sha256} from '@noble/hashes/sha2.js';
import {Psbt,payments,address,script,Transaction} from 'bitcoinjs-lib';
export const NETWORK={messagePrefix:'\u0018Bitcoin Signed Message:\n',bech32:'bflx',bip32:{public:0x0488b21e,private:0x0488ade4},pubKeyHash:28,scriptHash:88,wif:156};
export const PATH="m/84'/1'/0'/0/0";
export const L1_NETWORK={messagePrefix:'\u0018Bitcoin Signed Message:\n',bech32:'bc',bip32:{public:0x0488b21e,private:0x0488ade4},pubKeyHash:0,scriptHash:5,wif:128};
export const L1_PATH="m/84'/0'/0'/0/0";
export function chainNetwork(chain='flush'){if(chain==='flush')return NETWORK;if(chain==='ecash')return L1_NETWORK;throw Error('Unknown chain');}
// Flush credits deposits in its coinbase and permits them in the next block.
// L1 eCash retains Bitcoin's 100-confirmation coinbase maturity.
export function coinbaseMature(coin,chain='flush'){return !coin.coinbase||coin.confirmations>=(chain==='ecash'?100:1);}
export const hex=b=>Array.from(b,v=>v.toString(16).padStart(2,'0')).join('');
export const unhex=s=>{if(typeof s!=='string'||s.length%2||!/^[0-9a-f]*$/i.test(s))throw Error('Invalid hex');return Uint8Array.from(s.match(/../g)||[],v=>parseInt(v,16));};
export const concat=(...b)=>Uint8Array.from(b.flatMap(v=>[...v]));
const enc=new TextEncoder(),dec=new TextDecoder();
export function newMnemonic(){return generateMnemonic(wordlist,128);}
export function recoveryChallenge(){const choices=Array.from({length:12},(_,i)=>i);for(let i=11;i>0;i--){const j=crypto.getRandomValues(new Uint32Array(1))[0]%(i+1);[choices[i],choices[j]]=[choices[j],choices[i]];}return choices.slice(0,3).sort((a,b)=>a-b);}
export function checkRecovery(mnemonic,indices,answers){const words=mnemonic.trim().split(/\s+/);return Array.isArray(indices)&&indices.length===3&&new Set(indices).size===3&&indices.every(i=>Number.isInteger(i)&&i>=0&&i<words.length)&&Array.isArray(answers)&&answers.length===3&&indices.every((i,n)=>typeof answers[n]==='string'&&answers[n].trim().toLowerCase()===words[i]);}
export function account(mnemonic,chain='flush'){
 const network=chainNetwork(chain),path=chain==='ecash'?L1_PATH:PATH;
 mnemonic=mnemonic.trim().normalize('NFKD').split(/\s+/).join(' ');
 if(!validateMnemonic(mnemonic,wordlist))throw Error('Invalid recovery phrase');
 const seed=mnemonicToSeedSync(mnemonic),root=HDKey.fromMasterSeed(seed),child=root.derive(path);seed.fill(0);
 const publicKey=child.publicKey,privateKey=child.privateKey,pay=payments.p2wpkh({pubkey:publicKey,network});
 root.wipePrivateData();child.wipePrivateData();
 return {address:pay.address,publicKey,privateKey,script:pay.output};
}
export function publicAccount(m,chain='flush'){const a=account(m,chain);a.privateKey.fill(0);return {address:a.address,publicKey:hex(a.publicKey),path:chain==='ecash'?L1_PATH:PATH};}
export function publicAccounts(m){return {ecash:publicAccount(m,'ecash'),flush:publicAccount(m,'flush')};}
async function passwordKey(password,salt,usage){
 const material=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:600000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,usage);
}
export async function encryptVault(mnemonic,password){
 if(typeof password!=='string'||password.length<12)throw Error('Use a password of at least 12 characters');
 const pub=publicAccount(mnemonic),salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
 const key=await passwordKey(password,salt,['encrypt']);
 const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:enc.encode('flush-wallet-v1')},key,enc.encode(mnemonic));
 return {version:1,...pub,accounts:publicAccounts(mnemonic),salt:hex(salt),iv:hex(iv),ciphertext:hex(new Uint8Array(ciphertext))};
}
export async function decryptVault(vault,password){
 try{if(vault.version!==1)throw Error();const key=await passwordKey(password,unhex(vault.salt),['decrypt']);
 const text=await crypto.subtle.decrypt({name:'AES-GCM',iv:unhex(vault.iv),additionalData:enc.encode('flush-wallet-v1')},key,unhex(vault.ciphertext));
 const bytes=new Uint8Array(text),m=dec.decode(bytes);bytes.fill(0);if(publicAccount(m).address!==vault.address)throw Error();return m;
 }catch{throw Error('Wrong password or damaged wallet');}
}
export function units(text,places=8){
 text=String(text);if(!Number.isInteger(places)||places<0||places>12||!new RegExp('^(0|[1-9][0-9]{0,14})(\\.[0-9]{1,'+Math.max(1,places)+'})?$').test(text)||(places===0&&text.includes('.')))throw Error('Invalid amount');
 const [a,b='']=text.split('.'),n=BigInt(a)*10n**BigInt(places)+BigInt(b.padEnd(places,'0')||'0');if(n<=0n||n>9223372036854775807n)throw Error('Amount out of range');return n;
}
export function decimal(n,places=8){n=BigInt(n);const s=n.toString().padStart(places+1,'0');const f=places?s.slice(-places).replace(/0+$/,''):'';return places?s.slice(0,-places)+(f?'.'+f:''):s;}
export function depositAddress(addr){address.toOutputScript(addr,NETWORK);const prefix='s99_'+addr+'_';return prefix+hex(sha256(enc.encode(prefix))).slice(0,6);}
// Bitcoin Core's VARINT encoding (not CompactSize).
export function varint(n){n=BigInt(n);if(n<0n||n>0xffffffffffffffffn)throw Error('Varint range');const a=[];while(true){a.push(Number(n&127n)|(a.length?128:0));if(n<=127n)break;n=(n>>7n)-1n;}return Uint8Array.from(a.reverse());}
function compact(n){if(n<253)return Uint8Array.of(n);if(n<=65535)return Uint8Array.of(253,n&255,n>>8);throw Error('Oversize vector');}
const idBytes=id=>unhex(id).reverse();
const vector=b=>concat(compact(b.length),b);
function marker(operation,outputs){const data=concat(enc.encode('BAST'),[0],operation,compact(outputs.length),...outputs.map(o=>o.token?concat(varint(o.n),[o.token.kind],idBytes(o.token.id),varint(o.token.amount_units)):concat(varint(o.n),[255])));return script.compile([script.OPS.OP_RETURN,data]);}
export function paymentPlan({from,to,amount,asset='ECX',decimals=8,utxos,feeRate=2,chain='flush'}){
 const network=chainNetwork(chain);
 let mine,target;try{mine=address.toOutputScript(from,network);target=address.toOutputScript(to,network);}catch{throw Error(chain==='ecash'?'Use an eCash betanet address':'Use a Flush betanet address (bflx1…)');}
 const value=units(amount,decimals);
 if(chain==='flush'&&!to.startsWith('bflx1'))throw Error('Use a Flush betanet address (bflx1…)');
 if(chain==='ecash'&&asset!=='ECX')throw Error('Flush tokens can only be sent on Flush');
 if(!Number.isFinite(feeRate)||feeRate<1||feeRate>50)throw Error('Fee must be between 1 and 50 sat/vB');
 let inputs=[],outputs=[],tokens=[];
 if(asset==='ECX'){outputs.push({script:target,value});}
 else{
  if(!/^[a-f0-9]{64}$/.test(asset))throw Error('Invalid asset ID');let got=0n;
  for(const u of utxos.filter(u=>u.token?.kind===0&&u.token.id===asset)){inputs.push(u);got+=BigInt(u.token.amount_units);if(got>=value)break;}
  if(got<value)throw Error('Insufficient token balance');
  outputs.push({script:target,value:0n});tokens.push({n:0,token:{kind:0,id:asset,amount_units:value.toString()}});
  if(got>value){tokens.push({n:outputs.length,token:{kind:0,id:asset,amount_units:(got-value).toString()}});outputs.push({script:mine,value:0n});}
  outputs.push({script:marker([0],tokens),value:0n});
 }
 return fund({from,inputs,outputs,utxos,feeRate,chain,summary:{type:'send',to,amount,asset,decimals,chain}});
}
function fund({from,inputs=[],outputs,utxos,feeRate=2,summary,chain='flush'}){
 const network=chainNetwork(chain),mine=address.toOutputScript(from,network),chosen=new Set(inputs.map(u=>u.txid+':'+u.vout));
 const coins=utxos.filter(u=>!u.token&&BigInt(u.value_sat)>0n&&!chosen.has(u.txid+':'+u.vout)).sort((a,b)=>Number(BigInt(b.value_sat)-BigInt(a.value_sat)));
 let total=inputs.reduce((s,u)=>s+BigInt(u.value_sat),0n),spend=outputs.reduce((s,o)=>s+o.value,0n),fee;
 function estimated(){return BigInt(Math.ceil((12+inputs.length*69+31+outputs.reduce((s,o)=>s+9+o.script.length,0)+(summary.type==='swap'?750:0))*feeRate));}
 fee=estimated();for(const u of coins){if(total>=spend+fee)break;inputs.push(u);total+=BigInt(u.value_sat);fee=estimated();}
 if(total<spend+fee)throw Error('Insufficient ECX for amount and network fee');
 const change=total-spend-fee;if(change>=294n)outputs.push({script:mine,value:change});else fee+=change;
 if(fee>100000n)throw Error('Network fee exceeds 0.001 ECX');
 for(const u of inputs){if(u.scriptPubKey!==hex(mine))throw Error('Server returned an input owned by another address');if(!coinbaseMature(u,chain))throw Error('Immature coinbase');}
 const psbt=new Psbt({network});psbt.setVersion(2);
 if(chain==='ecash')psbt.setLocktime(499999999); // eCash betanet's replay-protection marker.
 for(const u of inputs)psbt.addInput({hash:u.txid,index:u.vout,sequence:0xfffffffd,witnessUtxo:{script:unhex(u.scriptPubKey),value:BigInt(u.value_sat)}});
 for(const o of outputs)psbt.addOutput(o);
 return {id:crypto.randomUUID(),chain,psbt:psbt.toBase64(),inputs:inputs.map(u=>({txid:u.txid,vout:u.vout,value_sat:u.value_sat})),fee_sat:fee.toString(),summary,created:Date.now()};
}
export function signPlan(plan,mnemonic){
 const chain=plan.chain||'flush',a=account(mnemonic,chain),psbt=Psbt.fromBase64(plan.psbt,{network:chainNetwork(chain)});
 try{for(let i=0;i<psbt.inputCount;i++)psbt.signInput(i,{publicKey:a.publicKey,sign:h=>secp256k1.sign(h,a.privateKey,{prehash:false,lowS:true,format:'compact'})},[Transaction.SIGHASH_ALL]);
 if(!psbt.validateSignaturesOfAllInputs((pub,h,sig)=>secp256k1.verify(sig,h,pub,{prehash:false,lowS:true,format:'compact'})))throw Error('Signature verification failed');
 psbt.finalizeAllInputs();const tx=psbt.extractTransaction();return {hex:tx.toHex(),txid:tx.getId()};
 }finally{a.privateKey.fill(0);}
}
export function tradePlan({from,assetIn,assetOut,amount,decimalsIn,decimalsOut,minOut,pools,utxos,feeRate=2}){
 if(!Array.isArray(pools)||pools.length<1||pools.length>4||pools.some(p=>!/^[a-f0-9]{64}$/.test(p)))throw Error('Invalid pool route');
 const zero='0'.repeat(64),inId=assetIn==='ECX'?zero:assetIn;
 if(!/^[a-f0-9]{64}$/.test(inId))throw Error('Invalid input asset');
 const value=units(amount,decimalsIn),floor=units(minOut,decimalsOut),mine=address.toOutputScript(from,NETWORK);
 const inputs=[],outputs=[],tokens=[];
 if(assetIn!=='ECX'){
  let got=0n;for(const u of utxos.filter(u=>u.token?.kind===0&&u.token.id===assetIn)){inputs.push(u);got+=BigInt(u.token.amount_units);if(got>=value)break;}
  if(got<value)throw Error('Insufficient token balance');
  if(got>value){tokens.push({n:outputs.length,token:{kind:0,id:assetIn,amount_units:(got-value).toString()}});outputs.push({script:mine,value:0n});}
 }
 tokens.push({n:outputs.length});outputs.push({script:mine,value:0n});
 const op=concat([21],idBytes(inId),compact(pools.length),...pools.map(idBytes),varint(value),varint(floor),vector(mine));
 outputs.push({script:marker(op,tokens),value:assetIn==='ECX'?value:0n});
 return fund({from,inputs,outputs,utxos,feeRate,summary:{type:'swap',assetIn,assetOut,amount,minOut,decimalsIn,decimalsOut,pools}});
}
export function parseUri(uri,now=Math.floor(Date.now()/1000)){
 if(typeof uri!=='string'||uri.length>4096||!/^flush:[a-z]+\?/.test(uri)||/[+\s#]/.test(uri))throw Error('Invalid Flush request');
 const q=uri.indexOf('?'),verb=uri.slice(6,q),p=new URLSearchParams(uri.slice(q+1));
 const fields={connect:['origin','callback','nonce'],buy:['launch','asset','ecx','min_tokens','slippage_bps'],sell:['launch','asset','tokens','min_ecx','slippage_bps'],swap:['pool','from','to','amount','min_out','slippage_bps'],route:['pools','from','to','amount','min_out','slippage_bps']};
 if(!fields[verb])throw Error('This action is not supported by the browser wallet yet');
 const raw=uri.slice(q+1).split('&');for(const part of raw){const pair=part.split('=');if(pair.length!==2||!pair.every(x=>/^(?:[A-Za-z0-9_.~-]|%[a-fA-F0-9]{2})+$/.test(x)))throw Error('Malformed URI encoding');for(const value of pair)decodeURIComponent(value);}
 for(const field of fields[verb].filter(f=>f!=='slippage_bps'))if(!p.has(field))throw Error('Missing '+field);
 for(const field of ['asset','pool'])if(p.has(field)&&!/^([0-9a-f]{64})$/.test(p.get(field)))throw Error('Invalid '+field);
 if(p.has('pools')&&(!/^([0-9a-f]{64})(,[0-9a-f]{64}){1,3}$/.test(p.get('pools'))||new Set(p.get('pools').split(',')).size!==p.get('pools').split(',').length))throw Error('Invalid pool route');
 for(const field of ['launch','from','to'])if(p.has(field)&&!/^[A-Z0-9]{2,12}$/.test(p.get(field)))throw Error('Invalid ticker');
 for(const field of ['ecx','min_tokens','tokens','min_ecx','amount','min_out'])if(p.has(field))units(p.get(field),8);
 if(p.has('slippage_bps')&&(!/^\d{1,4}$/.test(p.get('slippage_bps'))||Number(p.get('slippage_bps'))>5000))throw Error('Invalid slippage');
 const seen=new Set();for(const [k,v] of p){if(seen.has(k)||!['v','network','exp',...fields[verb]].includes(k)||/[\u0000-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2060-\u2069\ufeff]/u.test(v))throw Error('Invalid request parameter');seen.add(k);}
 const exp=Number(p.get('exp'));if(p.get('v')!=='1'||p.get('network')!=='ecashbeta'||!/^\d+$/.test(p.get('exp')||'')||exp<now||exp>now+86400)throw Error('Wrong network or expired request');
 if(verb==='connect'&&(p.get('origin')!=='https://flush.markets'||p.get('callback')!=='https://flush.markets/connect'||!/^[A-Za-z0-9_-]{16,64}$/.test(p.get('nonce')||'')))throw Error('Invalid connection request');
 return {verb,...Object.fromEntries(p)};
}
