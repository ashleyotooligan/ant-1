import {Random} from '../../src/core/random.js';
/** Deliberately synthetic prices, never represented as historical exchange data. */
export function syntheticMarket(seed=73,length=600){
  const rng=new Random(seed);let price=100;
  return Array.from({length},(_,i)=>{
    const drift=i<160?0.0009:i<300?-0.0012:i<460?0.0004:0;
    price*=1+drift+(rng.next()-0.5)*0.017+(i===320?-0.065:0);
    return {timestamp:new Date(Date.UTC(2026,0,1,0,i)).toISOString(),close:Number(price.toFixed(6)),volume:100+rng.int(300)};
  });
}
