import {readFile} from 'node:fs/promises';
import {syntheticMarket} from '../extensions/market/fixtures.js';
import {runMarket} from '../extensions/market/replay.js';
import {flags,number,writeJSON} from './io.mjs';
const args=flags(),seed=number(args.seed,17,'seed'),bars=args.data?JSON.parse(await readFile(args.data,'utf8')):syntheticMarket();
const policies=args.policy?[args.policy]:['neural','buy-and-hold','random'];
const results=policies.map(policy=>runMarket(bars,{seed,policy}));
const out=args.out||'output/market-comparison.json';await writeJSON(out,{source:args.data?`user-file:${args.data}`:'synthetic-fixture:seed=73',results});
console.table(results.map(r=>({policy:r.policy,finalEquity:r.finalEquity.toFixed(2),returnPct:r.returnPct.toFixed(2),trades:r.trades})));console.log(`Saved ${out}`);
