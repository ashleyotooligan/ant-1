import {runProtocol} from '../experiments/runner.js';
import {syntheticMarket} from '../extensions/market/fixtures.js';
import {runMarket} from '../extensions/market/replay.js';
import {writeJSON} from './io.mjs';
const refs=[['navigation','Odour-guided navigation'],['relocation','Food-source relocation'],['antenna','Left antenna ablation']];
const index=[];
for(const [id,title]of refs){const result=runProtocol(id,17),file=`${id}-seed17.json`;await writeJSON(`data/runs/${file}`,result);index.push({title,file,protocol:id,...result.metrics});}
await writeJSON('data/runs/index.json',index);
const bars=syntheticMarket();await writeJSON('extensions/market/data/synthetic-bars.json',bars);
await writeJSON('extensions/market/data/reference-comparison.json',{source:'synthetic-fixture:seed=73',results:['neural','buy-and-hold','random'].map(policy=>runMarket(bars,{seed:17,policy}))});
console.log('Reference runs and paper replay generated.');
