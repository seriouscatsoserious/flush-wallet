import {units,decimal} from './core.js';
export function tradeMinimum(quote,decimals,requested){
 const exact=value=>{if(typeof value!=='string'||!(/^[1-9][0-9]{0,18}$/.test(value))||BigInt(value)>9223372036854775807n)throw Error('Invalid quote amount');return BigInt(value);};
 const output=exact(quote.amount_out_units),quoted=exact(quote.min_out_units);
 if(quoted>output)throw Error('Invalid quote minimum');
 const walletFloor=output*9900n/10000n;
 const floor=quoted>walletFloor?quoted:walletFloor;
 const intent=requested===undefined?0n:units(requested,decimals);
 if(intent>output)throw Error('The quote no longer meets the requested minimum. Refresh the trade on the site.');
 const minimum=intent>floor?intent:floor;
 if(minimum<=0n)throw Error('Trade is too small');
 return decimal(minimum,decimals);
}
export function launchGuard(launch,asset,previousPool){
 if((launch.id||launch.token)!==asset)throw Error('Launch asset does not match the request');
 if((launch.state||launch.status)!=='curve')throw Error('The launch has graduated or stopped. Refresh the trade on the site.');
 if(!/^[a-f0-9]{64}$/.test(launch.pool_id||launch.pool||''))throw Error('Invalid launch pool');
 const pool=launch.pool_id||launch.pool;
 if(previousPool&&pool!==previousPool)throw Error('Launch pool changed; review a fresh trade');
 return {asset,pool};
}
