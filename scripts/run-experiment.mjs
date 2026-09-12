import {runProtocol} from '../experiments/runner.js';
import {flags,number,writeJSON} from './io.mjs';
const args=flags(),id=args.protocol||'navigation',seed=number(args.seed,17,'seed');
const result=runProtocol(id,seed,args.ticks?number(args.ticks,2400,'ticks'):null);
const out=args.out||`output/${id}-seed${seed}.json`;
await writeJSON(out,result);console.log(JSON.stringify(result.metrics,null,2));console.log(`Saved ${out}`);
