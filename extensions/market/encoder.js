import {clamp,mean} from '../../src/core/math.js';
export function encodeMarket(bars,index,broker){
  const price=bars[index].close, previous=bars[Math.max(0,index-1)].close;
  const lookback=bars.slice(Math.max(0,index-12),index+1).map(b=>b.close);
  const moving=mean(lookback),ret=(price/previous-1),trend=price/moving-1;
  const volatility=Math.sqrt(mean(lookback.map(p=>(p/moving-1)**2)));
  const equity=broker.equity(price);
  return [clamp(ret*40),clamp(trend*20),clamp(volatility*30),broker.cash/equity,broker.quantity*price/equity,
    clamp(broker.drawdown(price)*5),clamp((bars[index].volume??0)/1000,0,1),clamp(ret*trend*300),0,0,clamp(broker.lastReward*100),1];
}
