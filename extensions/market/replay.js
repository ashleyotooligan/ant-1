import {PaperBroker} from './broker.js';
import {MarketPolicy,baselinePolicy} from './policy.js';
import {encodeMarket} from './encoder.js';
export function validateBars(bars){
  if(!Array.isArray(bars)||bars.length<3)throw new Error('At least three market bars are required.');
  let previous=-Infinity;
  for(const b of bars){const time=Date.parse(b.timestamp);if(!Number.isFinite(time)||time<=previous||!Number.isFinite(b.close)||b.close<=0||(b.volume!=null&&(!Number.isFinite(b.volume)||b.volume<0)))throw new Error('Bars need increasing timestamps, positive close and non-negative volume.');previous=time;}
}
export function runMarket(bars,{seed=17,policy='neural',broker:settings={}}={}){
  validateBars(bars);if(!['neural','random','buy-and-hold'].includes(policy))throw new Error('Unknown policy.');
  const broker=new PaperBroker(settings),neural=new MarketPolicy(seed),baseline=baselinePolicy(policy,seed);
  const curve=[{timestamp:bars[0].timestamp,equity:broker.initialCash,action:'initial',price:bars[0].close}];let maxDrawdown=0;
  // Observe close[t], trade at close[t+1], then learn. Never reveal t+1 before the decision at t.
  for(let t=0;t<bars.length-1;t++){
    const inputs=encodeMarket(bars,t,broker),decision=policy==='neural'?neural.decide(inputs):{side:baseline(t)};
    const before=broker.equity(bars[t].close);
    broker.execute(decision.side,bars[t+1].close,bars[t+1].timestamp);
    const after=broker.equity(bars[t+1].close),reward=(after-before)/before;
    broker.lastReward=reward;broker.peak=Math.max(broker.peak,after);maxDrawdown=Math.max(maxDrawdown,broker.drawdown(bars[t+1].close));
    if(policy==='neural')neural.learn(reward,encodeMarket(bars,t+1,broker),t===bars.length-2);
    curve.push({timestamp:bars[t+1].timestamp,equity:after,action:decision.side,price:bars[t+1].close});
  }
  const finalEquity=broker.equity(bars.at(-1).close);
  return {schema:'ant1.market.v1',mode:'paper-replay',policy,seed,bars:bars.length,configuration:{initialCash:broker.initialCash,fee:broker.fee,slippage:broker.slippage,maxAllocation:broker.maxAllocation},finalEquity,returnPct:(finalEquity/broker.initialCash-1)*100,maxDrawdown,trades:broker.ledger.length,ledger:broker.ledger,curve};
}
