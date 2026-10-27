window.addEventListener('message',event=>{
 if(event.source!==window||event.origin!=='https://flush.markets'||event.data?.source!=='flush-wallet:request')return;
 const {id,method,uri}=event.data;if(typeof id!=='string'||id.length>64||!['flush_requestAddress','flush_submit'].includes(method))return;
 chrome.runtime.sendMessage({type:'DAPP',method,uri}).then(r=>window.postMessage({source:'flush-wallet:response',id,...r},location.origin)).catch(()=>window.postMessage({source:'flush-wallet:response',id,ok:false,error:'Wallet unavailable'},location.origin));
});
