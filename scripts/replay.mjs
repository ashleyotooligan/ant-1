import {readFile} from 'node:fs/promises';
import {Simulation} from '../src/core/simulation.js';
import {flags} from './io.mjs';
const args=flags();if(!args.file)throw new Error('Usage: node scripts/replay.mjs --file path/to/run.json');
const record=JSON.parse(await readFile(args.file,'utf8'));if(record.schema!=='ant1.session.v1')throw new Error('Unsupported session schema.');
const sim=new Simulation(record.initialOptions);
for(let t=0;t<=record.ticks;t++){for(const event of record.interventions)if(event.tick===t)sim.intervene(event.type);if(t<record.ticks)sim.step();}
const observed=sim.metrics();let valid=true;
for(const [key,value] of Object.entries(record.metrics))if(typeof value==='number'){if(Math.abs(observed[key]-value)>1e-8){valid=false;console.error(`Mismatch: ${key}, expected ${value}, got ${observed[key]}`);}}else if(observed[key]!==value){valid=false;console.error(`Mismatch: ${key}`);}
console.log(valid?'Replay matches every recorded metric.':'Replay mismatch.');process.exitCode=valid?0:1;
