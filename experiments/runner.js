import {Simulation} from '../src/core/simulation.js';
import {PROTOCOLS} from './protocols.js';
export function runProtocol(id='navigation',seed=17,ticks=null){
  const protocol=PROTOCOLS.find(p=>p.id===id);
  if(!protocol)throw new Error(`Unknown protocol ${id}. Choose ${PROTOCOLS.map(p=>p.id).join(', ')}.`);
  const sim=new Simulation({seed,...protocol.options});
  const limit=ticks??protocol.ticks;
  for(let t=0;t<limit;t++) {for(const e of protocol.events)if(e.tick===sim.tick)sim.intervene(e.type);sim.step();}
  return {protocol:protocol.id,question:protocol.question,...sim.export()};
}
