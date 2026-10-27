// Runs in the page's MAIN world. This exposes only request/response messages.
// The vault, passwords and signer live in the extension's service worker.
(()=>{
 if(window.flush?.isFlush)return;
 const pending=new Map();
 window.addEventListener('message',event=>{
  const d=event.data;if(event.source!==window||event.origin!==location.origin||d?.source!=='flush-wallet:response')return;
  const item=pending.get(d.id);if(!item)return;pending.delete(d.id);clearTimeout(item.timer);d.ok?item.resolve(d.result):item.reject(Error(d.error||'Wallet rejected request'));
 });
 const provider=Object.freeze({isFlush:true,isPhantom:false,version:'0.1.0',request:({method,params}={})=>new Promise((resolve,reject)=>{
  if(!['flush_requestAddress','flush_submit'].includes(method))return reject(Error('Unsupported wallet method'));
  if(method==='flush_submit'&&(typeof params?.uri!=='string'||params.uri.length>4096))return reject(Error('Invalid Flush URI'));
  const id=crypto.randomUUID(),timer=setTimeout(()=>{pending.delete(id);reject(Error('Wallet request timed out'));},120000);
  pending.set(id,{resolve,reject,timer});window.postMessage({source:'flush-wallet:request',id,method,uri:params?.uri},location.origin);
 })});
 Object.defineProperty(window,'flush',{value:provider,writable:false,configurable:false});
 window.dispatchEvent(new Event('flush#initialized'));
})();
