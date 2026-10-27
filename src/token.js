const kinds=['asset','control','reservation','lp','receipt','position','order'];
export function normalizeToken(token){
 if(token===null)return null;
 const kind=typeof token?.kind==='string'?kinds.indexOf(token.kind):token?.kind,id=token?.id||token?.asset_id;
 const amount=token?.amount_units??([1,2,4,5,6].includes(kind)?'1':undefined);
 if(!Number.isInteger(kind)||kind<0||kind>6||!(/^[0-9a-f]{64}$/.test(id||''))||typeof amount!=='string'||!(/^[1-9][0-9]{0,18}$/.test(amount))||BigInt(amount)>9223372036854775807n)throw Error('Invalid token-output metadata');
 return {kind,id,amount_units:amount};
}
