import {Simulation} from '../core/simulation.js';
import {ACTION_NAMES} from '../core/config.js';
import {drawArena,drawSpecimen,drawRaster,drawNetwork,drawMarket} from './render.js';
import {download} from './download.js';
import {PROTOCOLS} from '../../experiments/protocols.js';
import {syntheticMarket} from '../../extensions/market/fixtures.js';
import {runMarket,validateBars} from '../../extensions/market/replay.js';
const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.search);
let sim=new Simulation(),view='observatory',running=!params.has('capture'),rate=4,last=performance.now(),accumulator=0,toastTimer,protocol=null,marketBars=syntheticMarket(),marketResults=null,source='synthetic-fixture:seed=73';
const titles={observatory:['OBSERVATION / ARENA 01','One ant. A closed loop.','Watch sensation become activity, and activity become movement.'],neural:['INTERFACE / SYNTHETIC NETWORK','Inside the connection.','Follow the signal from sensory channels to a motor decision.'],protocols:['EXPERIMENTS / CONTROLLED INTERVENTIONS','Change one thing. Observe.','Seven repeatable protocols for behaviour, memory, and adaptation.'],archive:['ARCHIVE / REFERENCE RUNS','Every run leaves a record.','Inspect the seed, the intervention, and the behaviour that followed.'],market:['EXTENSIONS / ENVIRONMENT M–01','Beyond the observation chamber.','An optional market interface for the same synthetic neural architecture.']};
const clock=t=>`${Math.floor(t/10/60)}`.padStart(2,'0')+':'+`${Math.floor(t/10)%60}`.padStart(2,'0');
function toast(text){$('toast').textContent=text;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),3000);}
function seed(){const n=Number($('seed').value);if(!Number.isInteger(n)||n<0||n>4294967295){toast('Use an integer seed from 0 to 4294967295.');return null;}return n;}
function setRunning(value){running=value;$('toggle').textContent=value?'Ⅱ Pause':'▶ Resume';$('session-status').textContent=value?'RUNNING':'PAUSED';}
function show(name){view=name;document.querySelectorAll('.view').forEach(el=>el.hidden=el.id!==`view-${name}`);document.querySelectorAll('.nav').forEach(el=>el.classList.toggle('active',el.dataset.view===name));['page-kicker','page-title','page-subtitle'].forEach((id,i)=>$(id).textContent=titles[name][i]);$('sim-toolbar').hidden=name==='market';if(name==='market'&&!marketResults)compareMarket();render();}
function advance(n){for(let i=0;i<n;i++){if(protocol){for(const e of protocol.events)if(e.tick===sim.tick)sim.intervene(e.type);if(sim.tick>=protocol.ticks){setRunning(false);break;}}sim.step();}}
function restore(record){if(record.schema!=='ant1.session.v1')throw new Error('Unsupported session schema.');sim=new Simulation(record.initialOptions);protocol=null;for(let tick=0;tick<=record.ticks;tick++){for(const e of record.interventions)if(e.tick===tick)sim.intervene(e.type);if(tick<record.ticks)sim.step();}$('seed').value=sim.options.seed;setRunning(false);}
const bars=[['odour-left','Odour L'],['odour-right','Odour R'],['gradient','Gradient'],['obstacle','Obstacle'],['home','Nest vector']];
$('sensor-bars').innerHTML=bars.map(([id,label])=>`<div class="bar-row"><span>${label}</span><div class="bar-track"><div class="bar-fill" id="bar-${id}"></div></div><em id="value-${id}">0.00</em></div>`).join('');
$('action-bars').innerHTML=ACTION_NAMES.map((n,i)=>`<div class="bar-row"><span>${n}</span><div class="bar-track"><div class="bar-fill" id="action-${i}"></div></div><em id="q-${i}">0.00</em></div>`).join('');
document.querySelectorAll('.nav').forEach(el=>el.addEventListener('click',()=>show(el.dataset.view)));
$('toggle').onclick=()=>setRunning(!running);
$('step').onclick=()=>{setRunning(false);advance(1);render();};
$('reset').onclick=()=>{const n=seed();if(n===null)return;sim=new Simulation({seed:n});protocol=null;accumulator=0;render();toast(`New observation run · seed ${n}`);};
$('speed').onchange=()=>rate=Number($('speed').value);
$('export').onclick=()=>download(`ant1-seed${sim.options.seed}-tick${sim.tick}.json`,sim.export());
document.querySelectorAll('[data-intervention]').forEach(el=>el.onclick=()=>{protocol=null;sim.intervene(el.dataset.intervention);render();toast(sim.events.at(-1).message);});
$('protocol-grid').innerHTML=PROTOCOLS.map(p=>`<article class="protocol-card"><div class="eyebrow">${p.code} / ${p.events.length?'INTERVENTION':'CONTROL CONDITION'}</div><h2>${p.title}</h2><p>${p.question}</p><div class="card-meta">2,400 STEPS ${p.events.length?'· INTERVENE AT 1,000':'· MATCHED SEED'}</div><button data-protocol="${p.id}">Run protocol ↗</button></article>`).join('');
document.querySelectorAll('[data-protocol]').forEach(el=>el.onclick=()=>{
  const n=seed();if(n===null)return;protocol=PROTOCOLS.find(p=>p.id===el.dataset.protocol);sim=new Simulation({seed:n,...protocol.options});advance(protocol.ticks);setRunning(false);const m=sim.metrics(),panel=$('protocol-result');panel.hidden=false;
  panel.innerHTML=`<div class="eyebrow">COMPLETED / SEED ${n}</div><h2>${protocol.code} · ${protocol.title}</h2><div class="report-grid"><span>FOOD RETURNS<strong>${m.returns}</strong></span><span>COLLISIONS<strong>${m.collisions}</strong></span><span>MODEL REWARD<strong>${m.reward.toFixed(2)}</strong></span><span>FIRST CONTACT<strong>${m.firstPickupTick??'—'}</strong></span></div><p>A single simulated run. Compare matched seeds before drawing conclusions.</p><button id="inspect-protocol">Inspect this run ↗</button>`;
  $('inspect-protocol').onclick=()=>show('observatory');render();panel.scrollIntoView({behavior:'smooth',block:'nearest'});toast(`${protocol.code} complete · ${m.returns} food returns`);
});
async function archive(){try{
  const get=async path=>{if(window.__ANT1_DATA__&&path in window.__ANT1_DATA__)return window.__ANT1_DATA__[path];const response=await fetch(path);if(!response.ok)throw new Error('Reference file unavailable.');return response.json();};
  const index=await get('data/runs/index.json');
  $('archive-list').innerHTML=index.map(r=>`<div class="archive-row"><div><strong>${r.title}</strong><small>${r.protocol.toUpperCase()} / SEED ${r.seed} / ${r.ticks} STEPS</small></div><span>${r.returns}<small>RETURNS</small></span><span>${r.collisions}<small>COLLISIONS</small></span><button data-run="${r.file}">Open in observatory ↗</button></div>`).join('');
  document.querySelectorAll('[data-run]').forEach(el=>el.onclick=async()=>{try{restore(await get(`data/runs/${el.dataset.run}`));show('observatory');toast('Reference run reproduced from its seed and interventions.');}catch(e){toast(e.message);}});
  const benchmark=await get('data/benchmarks/reference.json');
  $('benchmark-panel').innerHTML=`<div class="eyebrow">DESCRIPTIVE BENCHMARK / ${benchmark.seeds.length} MATCHED SEEDS</div><h2>What changes across conditions?</h2><div class="table-wrap"><table><thead><tr><th>CONDITION</th><th>RETURNS · MEAN ± SD</th><th>COLLISIONS · MEAN</th><th>REWARD · MEAN</th></tr></thead><tbody>${benchmark.conditions.map(c=>`<tr><td>${c.id}</td><td>${c.returns.mean.toFixed(2)} ± ${c.returns.sd.toFixed(2)}</td><td>${c.collisions.mean.toFixed(1)}</td><td>${c.reward.mean.toFixed(2)}</td></tr>`).join('')}</tbody></table></div><p>The engineered steering prior is a major contributor. These results describe this toy arena and do not establish a biological mechanism or general learning ability.</p>`;
}catch(e){$('archive-list').textContent=e.message;}}
function compareMarket(){try{
  const n=seed();if(n===null)return;marketResults=['neural','buy-and-hold','random'].map(policy=>runMarket(marketBars,{seed:n,policy}));
  $('market-metrics').innerHTML=marketResults.map(r=>`<div><label>${r.policy.toUpperCase()} / FINAL EQUITY</label><strong>$${r.finalEquity.toFixed(2)}</strong><small>${r.returnPct.toFixed(2)}% return · ${r.trades} paper fills</small></div>`).join('')+`<div><label>NEURAL / MAX DRAWDOWN</label><strong>${(marketResults[0].maxDrawdown*100).toFixed(2)}<span>%</span></strong><small>${marketBars.length} bars · no leverage</small></div>`;
  $('ledger').innerHTML=marketResults[0].ledger.slice(-5).reverse().map(r=>`<div class="ledger-row"><span class="${r.side}">${r.side.toUpperCase()}</span><span>$${r.price.toFixed(3)}</span><span>${r.quantity.toFixed(4)} units</span></div>`).join('')||'<p class="panel-copy">No fills in this run.</p>';
  drawMarket($('market-chart'),marketResults);
}catch(e){toast(e.message);}}
$('run-market').onclick=()=>{compareMarket();toast('Paper comparison complete.');};
$('load-market').onclick=()=>$('market-file').click();
$('market-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>5*1024*1024)throw new Error('Please use a JSON file below 5 MB.');const bars=JSON.parse(await file.text());validateBars(bars);if(bars.length>10000)throw new Error('Use at most 10,000 bars in the interactive view.');marketBars=bars;source=`user-file:${file.name}`;$('market-source').textContent=`USER DATA / ${file.name}`;compareMarket();}catch(error){toast(error.message);}};
$('export-market').onclick=()=>{if(!marketResults)compareMarket();download('ant1-paper-replay.json',{source,results:marketResults});};
let lastEventCount=-1,lastRenderedSim=null;
function render(){
  if(lastRenderedSim!==sim){lastEventCount=-1;lastRenderedSim=sim;}
  if(view==='observatory'){
    drawArena($('arena'),sim);drawSpecimen($('specimen'),sim);drawRaster($('raster'),sim);
    const m=sim.metrics();$('metric-time').innerHTML=`${clock(sim.tick)}<span> mm:ss</span>`;$('metric-returns').textContent=String(m.returns).padStart(2,'0');$('metric-path').innerHTML=`${Math.round(m.pathLength).toLocaleString('en-US')}<span> u</span>`;$('metric-activity').textContent=m.neuralActivity.toFixed(2);
    $('position').textContent=`X ${Math.round(sim.ant.x).toString().padStart(4,'0')} / Y ${Math.round(sim.ant.y).toString().padStart(4,'0')}`;$('behaviour').textContent=sim.ant.carrying?'RETURNING TO NEST':'FORAGING';
    const inputs=sim.controller.last.inputs;[0,1,2,4,7].forEach((input,i)=>{$(`bar-${bars[i][0]}`).style.width=`${Math.min(100,Math.abs(inputs[input])*100)}%`;$(`value-${bars[i][0]}`).textContent=inputs[input].toFixed(2);});
    if(lastEventCount!==sim.events.length){lastEventCount=sim.events.length;$('event-count').textContent=`${sim.events.length} EVENTS`;$('events').innerHTML=sim.events.slice(-5).reverse().map(e=>`<div class="event"><time>${clock(e.tick)}</time><b>${e.type}</b><span>${e.message}</span></div>`).join('');}
  }
  if(view==='neural'){
    drawNetwork($('network'),sim);$('updates').textContent=sim.controller.updates.toLocaleString('en-US');const q=sim.controller.last.q,lo=Math.min(...q),hi=Math.max(...q);
    q.forEach((v,i)=>{$(`action-${i}`).style.width=`${10+90*(v-lo)/(hi-lo||1)}%`;$(`action-${i}`).style.background=i===sim.controller.last.action?'#a2d9b2':'#416b64';$(`q-${i}`).textContent=v.toFixed(3);});
    $('plasticity').textContent=sim.options.plasticity?'Freeze learning':'Enable learning';$('intervention-state').textContent=`${sim.disabled?'Left antenna silenced.':'All sensory channels connected.'} ${sim.controller.lesion?'Units 00–07 silenced. ':''}Readout plasticity ${sim.options.plasticity?'enabled':'frozen'}.`;
  }
  if(view==='market')drawMarket($('market-chart'),marketResults);
}
function frame(now){const delta=Math.min(now-last,250);last=now;if(running){accumulator+=delta*rate;const steps=Math.floor(accumulator/100);accumulator%=100;if(steps)advance(steps);}render();requestAnimationFrame(frame);}
window.antlab={get simulation(){return sim;},get marketResults(){return marketResults;},pause(){setRunning(false);},step(n=1){advance(n);render();},show,restore,render};
setRunning(running);archive();render();requestAnimationFrame(frame);
