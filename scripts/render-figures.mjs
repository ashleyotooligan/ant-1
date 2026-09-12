/** Direct scientific figure rendering using the exact application canvas code.
 * Optional dependency: @napi-rs/canvas. These are figures, not browser screenshots.
 */
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {Simulation} from '../src/core/simulation.js';
import {drawArena,drawSpecimen,drawNetwork,drawRaster,drawMarket} from '../src/ui/render.js';
const require=createRequire(import.meta.url);
let createCanvas,GlobalFonts;
try{({createCanvas,GlobalFonts}=require('@napi-rs/canvas'));}catch{throw new Error('Figure rendering is optional. Install @napi-rs/canvas, then run this script again.');}
GlobalFonts.registerFromPath(fileURLToPath(new URL('../assets/fonts/DejaVuSans.ttf',import.meta.url)),'ANT Sans');
GlobalFonts.registerFromPath(fileURLToPath(new URL('../assets/fonts/DejaVuSansMono.ttf',import.meta.url)),'ANT Mono');
GlobalFonts.registerFromPath(fileURLToPath(new URL('../assets/fonts/DejaVuSansMono.ttf',import.meta.url)),'Consolas');
global.window={devicePixelRatio:1};
const out='assets/figures';await mkdir(out,{recursive:true});
const sim=new Simulation({seed:17});sim.step(900);
const palette={bg:'#0b1219',panel:'#101b23',border:'#2b414e',text:'#d9e6e7',muted:'#7e9aa8',mint:'#a2d9b2',amber:'#cfaa6f'};
function text(c,value,x,y,size=14,color=palette.text,font='sans-serif'){c.fillStyle=color;c.font=`${size}px "${font==='monospace'?'ANT Mono':'ANT Sans'}"`;c.fillText(value,x,y);}
function frame(title,kicker,subtitle,w=1600,h=1000){const cv=createCanvas(w,h),c=cv.getContext('2d');c.fillStyle=palette.bg;c.fillRect(0,0,w,h);text(c,'ANT–1',55,57,28,palette.mint);text(c,'EMBODIED INTELLIGENCE LABORATORY',188,52,11,palette.muted,'monospace');text(c,kicker,55,117,12,palette.mint,'monospace');text(c,title,55,176,44);text(c,subtitle,55,209,15,palette.muted);c.strokeStyle=palette.border;c.beginPath();c.moveTo(55,h-55);c.lineTo(w-55,h-55);c.stroke();text(c,'DIRECT MODEL RENDER  /  SYNTHETIC SIMULATION  /  v0.1.0',55,h-28,10,palette.muted,'monospace');text(c,'ANT-1 · OPEN EXPERIMENT',w-270,h-28,10,palette.muted,'monospace');return {cv,c};}
function panel(c,x,y,w,h,label){c.fillStyle=palette.panel;c.fillRect(x,y,w,h);c.strokeStyle=palette.border;c.strokeRect(x,y,w,h);text(c,label,x+20,y+29,12,palette.muted,'monospace');}
function render(fn,w,h,subject){const cv=createCanvas(w,h);cv.getBoundingClientRect=()=>({width:w,height:h});fn(cv,subject);return cv;}
function stat(c,label,value,x,y,note=''){text(c,label,x,y,11,palette.muted,'monospace');text(c,value,x,y+42,33);if(note)text(c,note,x,y+64,11,palette.muted);}
const m=sim.metrics();
{
const {cv,c}=frame('One ant. A closed loop.','FIGURE 01 / OBSERVATION RECORD','Sensory input, recurrent activity and movement, captured from the same simulation state.',1600,1070);
stat(c,'SIMULATED TIME','01:30',65,263,'900 fixed steps');stat(c,'FOOD RETURNS',String(m.returns).padStart(2,'0'),390,263,'Completed deliveries');stat(c,'PATH LENGTH',`${Math.round(m.pathLength).toLocaleString('en-US')} u`,720,263,'Model distance');stat(c,'MEAN ACTIVITY',m.neuralActivity.toFixed(3),1100,263,'Absolute recurrent activation');
panel(c,55,350,1050,632,'A / OBSERVATION CHAMBER');c.drawImage(render(drawArena,1020,574,sim),70,393,1020,574);
panel(c,1130,350,415,285,'B / ANT–001');c.drawImage(render(drawSpecimen,385,215,sim),1145,398,385,215);
panel(c,1130,655,415,327,'C / RECURRENT ACTIVITY');c.drawImage(render(drawRaster,375,150,sim),1150,709,375,150);text(c,'32 UNITS / MOST RECENT 56 SIMULATED SECONDS',1150,890,9,palette.muted,'monospace');text(c,'SEED 17 · FIXED STEP 100 ms',1150,925,11,palette.mint,'monospace');text(c,'CONTINUOUS ACTIVATIONS / TANH',1150,953,10,palette.muted,'monospace');
await writeFile(`${out}/observation.png`,cv.toBuffer('image/png'));
}
{
const {cv,c}=frame('Inside the connection.','FIGURE 02 / NEURAL INTERFACE','12 sensory channels. 32 recurrent units. 5 motor commands. One inspectable feedback loop.',1600,960);
panel(c,55,252,1490,552,'A / ACTIVITY AND SELECTED MODEL CONNECTIONS');c.drawImage(render(drawNetwork,1450,529,sim),75,290,1450,500);
text(c,'WEIGHT UPDATES',67,854,10,palette.muted,'monospace');text(c,String(sim.controller.updates),237,857,22,palette.mint);text(c,'PLASTIC READOUT NORM',497,854,10,palette.muted,'monospace');text(c,m.weightNorm.toFixed(5),706,857,22,palette.mint);text(c,'Synthetic rate network. Designed steering prior remains active.',995,854,12,palette.muted);
await writeFile(`${out}/neural-interface.png`,cv.toBuffer('image/png'));
}
const benchmark=JSON.parse(await readFile('data/benchmarks/reference.json','utf8'));
{
const {cv,c}=frame('Change one thing. Observe.','FIGURE 03 / MATCHED-SEED CONTROLS','Twelve fixed seeds per condition · 2,400 steps · interventions at step 1,000.',1600,960);
panel(c,55,252,990,595,'A / COMPLETED FOOD RETURNS · MEAN ± SAMPLE SD');
const left=280,top=344,width=670;
for(let n=0;n<=6;n++){const x=left+n/6*width;c.strokeStyle=palette.border;c.beginPath();c.moveTo(x,315);c.lineTo(x,777);c.stroke();text(c,String(n),x-4,808,12,palette.muted,'monospace');}
benchmark.conditions.forEach((r,i)=>{const y=top+i*63;text(c,r.id,81,y+7,15,palette.text,'monospace');c.fillStyle=r.id==='no-prior'?palette.amber:palette.mint;c.fillRect(left,y-10,r.returns.mean/6*width,20);const a=left+(r.returns.mean-r.returns.sd)/6*width,b=left+(r.returns.mean+r.returns.sd)/6*width;c.strokeStyle='#ffffff';c.beginPath();c.moveTo(a,y);c.lineTo(b,y);c.moveTo(a,y-6);c.lineTo(a,y+6);c.moveTo(b,y-6);c.lineTo(b,y+6);c.stroke();text(c,`${r.returns.mean.toFixed(2)} ± ${r.returns.sd.toFixed(2)}`,Math.max(left+12,b+12),y+5,11,palette.text,'monospace');});
panel(c,1070,252,475,595,'B / WHAT THIS RUN SET SHOWS');
const lines=[['Navigation scaffold',25,palette.text],['The designed prior dominates this arena.',14,palette.muted],['Frozen learning also returns food reliably.',14,palette.muted],['',0],['Sensory intervention',25,palette.text],['Silencing the left antenna reduces returns.',14,palette.muted],['That is sensitivity to a model input,',14,palette.muted],['not evidence of a biological mechanism.',14,palette.muted],['',0],['A deliberately modest claim',25,palette.text],['This is an inspectable experiment platform.',14,palette.muted],['Learning superiority is not established.',14,palette.muted]];
let y=326;for(const [s,size,col]of lines){if(s)text(c,s,1096,y,size,col);y+=size===25?44:33;}
await writeFile(`${out}/controls.png`,cv.toBuffer('image/png'));
}
{
const record=JSON.parse(await readFile('extensions/market/data/reference-comparison.json','utf8'));
const {cv,c}=frame('A different environment.','FIGURE 04 / OPTIONAL MARKET INTERFACE','Fresh neural weights · synthetic prices · delayed paper execution · explicit costs.',1600,950);
record.results.forEach((r,i)=>stat(c,r.policy.toUpperCase(),`$${r.finalEquity.toFixed(2)}`,68+i*460,269,`${r.returnPct.toFixed(2)}% return / ${r.trades} paper fills`));
panel(c,55,374,1490,406,'A / PAPER PORTFOLIO COMPARISON · $100 INITIAL CASH');c.drawImage(render(drawMarket,1450,335,record.results),75,421,1450,344);
text(c,'NEURAL CONTROLLER',89,825,12,palette.mint,'monospace');text(c,'BUY & HOLD',410,825,12,palette.amber,'monospace');text(c,'RANDOM CONTROL',650,825,12,'#788da4','monospace');text(c,'SYNTHETIC FIXTURE / SEED 73',1130,825,11,palette.muted,'monospace');text(c,'This comparison demonstrates the adapter. It does not establish predictive ability or transfer from navigation.',64,866,14,palette.muted);
await writeFile(`${out}/market-interface.png`,cv.toBuffer('image/png'));
}
if(process.argv.includes('--frames')){
  await mkdir('output/frames',{recursive:true});const replay=new Simulation({seed:17});replay.step(680);
  for(let i=0;i<48;i++){const cv=createCanvas(960,626),c=cv.getContext('2d');c.fillStyle=palette.bg;c.fillRect(0,0,960,626);text(c,'ANT–1 / OBSERVATION REPLAY',25,30,16,palette.text,'monospace');text(c,`SEED 17 · TICK ${replay.tick} · 10×`,640,30,12,palette.mint,'monospace');c.drawImage(render(drawArena,960,540,replay),0,51);text(c,'DIRECT MODEL RENDER · SYNTHETIC ANT · DETERMINISTIC REPLAY',25,613,10,palette.muted,'monospace');await writeFile(`output/frames/frame-${String(i).padStart(3,'0')}.png`,cv.toBuffer('image/png'));replay.step(8);}
}
console.log('Four direct-rendered model figures generated.');
