import {mnemonicToSeedSync} from '@scure/bip39';
import {hex,unhex} from './core.js';
const enc=new TextEncoder(),dec=new TextDecoder(),context=enc.encode('flush-wallet-rpc-credentials-v1');
async function keyFor(phrase,salt,usage){
 const seed=mnemonicToSeedSync(phrase);
 const material=await crypto.subtle.importKey('raw',seed,'HKDF',false,['deriveKey']);seed.fill(0);
 return crypto.subtle.deriveKey({name:'HKDF',hash:'SHA-256',salt,info:context},material,{name:'AES-GCM',length:256},false,usage);
}
export async function sealConnection(connection,phrase){
 const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),key=await keyFor(phrase,salt,['encrypt']);
 const bytes=enc.encode(JSON.stringify(connection));
 try{const data=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:context},key,bytes);return {version:1,salt:hex(salt),iv:hex(iv),ciphertext:hex(new Uint8Array(data))};}finally{bytes.fill(0);}
}
export async function openConnection(envelope,phrase){
 if(envelope?.version!==1)throw Error('Invalid saved RPC connection');
 try{const key=await keyFor(phrase,unhex(envelope.salt),['decrypt']);const bytes=new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:unhex(envelope.iv),additionalData:context},key,unhex(envelope.ciphertext)));try{return JSON.parse(dec.decode(bytes));}finally{bytes.fill(0);}}
 catch{throw Error('Could not unlock the saved RPC credentials. Pair your node again.');}
}
export function redactConnection(c){
 if(!c||c.mode==='explorer')return {mode:'explorer'};
 return {mode:'rpc',ecash:{url:c.ecash.url,hasAuth:Boolean(c.ecash.auth)},flush:{url:c.flush.url,hasAuth:Boolean(c.flush.auth)}};
}
