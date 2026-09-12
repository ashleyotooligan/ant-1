import { INPUT_NAMES, ACTION_NAMES } from '../core/config.js';
const mint='#a2d9b2', amber='#cfaa6f';
function surface(canvas,w,h){const ratio=Math.min(window.devicePixelRatio||1,2),rect=canvas.getBoundingClientRect();if(!rect.width)return null;const pw=Math.round(rect.width*ratio),ph=Math.round(rect.height*ratio);if(canvas.width!==pw||canvas.height!==ph){canvas.width=pw;canvas.height=ph;}const c=canvas.getContext('2d');c.setTransform(pw/w,0,0,ph/h,0,0);c.clearRect(0,0,w,h);return c;}
function label(c,text,x,y,color='#678696',size=9){c.fillStyle=color;c.font=`${size}px Consolas,monospace`;c.fillText(text,x,y);}
function ellipse(c,x,y,rx,ry,fill,stroke){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.stroke();}}
function line(c,points,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
export function drawAnt(c,x,y,heading,scale,phase,carrying=false){
  c.save();c.translate(x,y);c.rotate(heading);c.scale(scale,scale);c.lineCap='round';
  c.shadowColor='#000';c.shadowBlur=10;c.shadowOffsetY=3;
  for(let side of [-1,1])for(let k=0;k<3;k++){
    const step=Math.sin(phase+k*2.1+side)*3.5,root=-6+k*6;
    line(c,[[root,side*4],[root+(k-1)*9+step,side*14],[root+(k-1)*15+step,side*(25+Math.cos(phase+k)*2)]],'#769784',1.7);
    line(c,[[root,side*4],[root+(k-1)*9+step,side*14]],'#c3c5a0',.6);
  }
  c.shadowBlur=0;c.shadowOffsetY=0;
  let g=c.createLinearGradient(0,-15,0,15);g.addColorStop(0,'#869178');g.addColorStop(.28,'#394c43');g.addColorStop(.65,'#172824');g.addColorStop(1,'#61785f');
  c.lineWidth=.9;ellipse(c,-24,0,16,11,g,'#93a182');ellipse(c,-8,0,4,3,'#5d6d51','#879b72');ellipse(c,1,0,8.8,5.8,g,'#8fa67b');ellipse(c,15,0,8.8,8,g,'#9eae87');
  line(c,[[-27,-8],[-24,-9],[-20,-8]],'#bfcca568',1.1);
  for(const side of [-1,1]){ellipse(c,18,side*5,2,1.2,'#081513','#a1bc91');line(c,[[20,side*5],[30,side*12],[40,side*17+Math.sin(phase*.7)*2]],'#aec493',1.1);line(c,[[23,side*2],[27,side*3],[26,side*.4]],'#a8b98c',1);}
  if(carrying){c.shadowColor=amber;c.shadowBlur=5;ellipse(c,29,0,4,3,amber);}
  c.restore();
}
export function drawArena(canvas,sim){
  const c=surface(canvas,960,540);if(!c)return;const a=sim.arena;
  c.fillStyle='#0b171e';c.fillRect(0,0,960,540);
  for(let x=0;x<960;x+=30)for(let y=0;y<540;y+=30){c.fillStyle=(x%120===0&&y%120===0)?'#28404c':'#172e3a';c.fillRect(x,y,1,1);}
  c.strokeStyle='#385361';c.lineWidth=1;c.strokeRect(25,25,910,490);
  for(let x=85;x<930;x+=100){line(c,[[x,25],[x,31]],'#46616d');label(c,`${x}`.padStart(3,'0'),x-8,16,'#3d596a',7);}
  for(let y=85;y<510;y+=100){line(c,[[25,y],[31,y]],'#46616d');label(c,`${y}`.padStart(3,'0'),3,y+3,'#3d596a',6);}
  const f=a.food;c.save();c.beginPath();c.rect(26,26,908,488);c.clip();
  const field=c.createRadialGradient(f.x,f.y,5,f.x,f.y,490);field.addColorStop(0,'#cfaa6f18');field.addColorStop(1,'#cfaa6f00');c.fillStyle=field;c.fillRect(0,0,960,540);
  for(let radius of [65,120,190,275,370,470,580]){c.beginPath();c.arc(f.x,f.y,radius,0,Math.PI*2);c.strokeStyle='#ae8f5821';c.setLineDash([3,8]);c.stroke();}c.setLineDash([]);c.restore();
  for(const o of a.obstacles){c.lineWidth=1;ellipse(c,o.x,o.y,o.radius+6,o.radius+6,'#121f27','#30434d');ellipse(c,o.x,o.y,o.radius,o.radius,'#16252e','#48606b');c.save();c.beginPath();c.arc(o.x,o.y,o.radius-3,0,7);c.clip();for(let i=-150;i<150;i+=9)line(c,[[o.x-90,o.y+i],[o.x+90,o.y+i+180]],'#2d444c60',.6);c.restore();label(c,'BARRIER',o.x-20,o.y+3,'#617981',6);}
  const n=a.nest;for(const [p,col,text]of[[n,mint,'NEST / HOME VECTOR'],[f,amber,'FOOD / ODOUR SOURCE']]){
    c.strokeStyle=col+'30';c.lineWidth=1;c.beginPath();c.arc(p.x,p.y,p.radius+12,0,7);c.stroke();c.setLineDash([2,4]);c.beginPath();c.arc(p.x,p.y,p.radius+20,0,7);c.stroke();c.setLineDash([]);ellipse(c,p.x,p.y,p.radius,p.radius,col+'0c',col+'88');
    for(let k=0;k<9;k++){const theta=k*2.399;ellipse(c,p.x+Math.cos(theta)*Math.sqrt(k)*5,p.y+Math.sin(theta)*Math.sqrt(k)*5,1.9,1.9,col+'bb');}
    label(c,text,p.x-45,p.y+p.radius+41,col+'b0',7);
  }
  const path=sim.trail;for(let i=1;i<path.length;i++){const opacity=Math.max(.09,i/path.length*.56);line(c,[[path[i-1].x,path[i-1].y],[path[i].x,path[i].y]],path[i].carrying?`rgba(162,217,178,${opacity})`:`rgba(207,170,111,${opacity})`,1.05);}
  const ant=sim.ant;
  c.save();c.translate(ant.x,ant.y);c.rotate(ant.heading);c.fillStyle='#aedbc412';c.beginPath();c.moveTo(17,0);c.arc(17,0,75,-.6,.6);c.closePath();c.fill();c.setLineDash([2,5]);line(c,[[16,0],[76,-40]],sim.disabled==='left'?'#c4696970':'#a2d9b260',.8);line(c,[[16,0],[76,40]],'#a2d9b260',.8);c.setLineDash([]);c.restore();
  drawAnt(c,ant.x,ant.y,ant.heading,0.73,sim.tick*.32,ant.carrying);
  const tx=Math.min(820,Math.max(75,ant.x+37)),ty=Math.max(70,ant.y-44);line(c,[[ant.x+4,ant.y-15],[tx-8,ty+3],[tx+60,ty+3]],'#5d7c79',.65);label(c,'ANT–001',tx,ty-4,mint,8);
}
export function drawSpecimen(canvas,sim){const c=surface(canvas,300,168);if(!c)return;for(let x=15;x<300;x+=20)for(let y=12;y<168;y+=20){c.fillStyle='#283f4822';c.fillRect(x,y,1,1);}line(c,[[150,15],[150,153]],'#38545b33',.7);line(c,[[20,84],[280,84]],'#38545b33',.7);drawAnt(c,159,79,-.13,2.5,sim.tick*.2,sim.ant.carrying);label(c,'MODEL VIEW',16,19,'#587484',6);label(c,'× 3.4',250,150,'#729387',7);}
export function drawRaster(canvas,sim){const c=surface(canvas,560,108);if(!c)return;const rows=sim.activity;for(let t=0;t<140;t++)for(let j=0;j<32;j++){const v=rows[rows.length-140+t]?.[j]??0;c.fillStyle=v>0?`rgba(162,217,178,${.05+Math.abs(v)*.9})`:`rgba(207,170,111,${.05+Math.abs(v)*.9})`;c.fillRect(t*4,j*3.3,3.1,2.8);}}
export function drawNetwork(canvas,sim){
  const c=surface(canvas,1150,420);if(!c)return;const ctrl=sim.controller,ins=ctrl.last.inputs;
  const inputs=Array.from({length:12},(_,i)=>({x:226,y:66+i*25.5})),core=Array.from({length:32},(_,i)=>({x:428+Math.floor(i/8)*78,y:88+(i%8)*38})),outputs=Array.from({length:5},(_,i)=>({x:855,y:123+i*46}));
  label(c,'SENSORY CHANNELS',68,35,'#7995a6',9);label(c,'LEAKY RECURRENT CORE',431,35,'#7995a6',9);label(c,'MOTOR ACTIONS',850,35,'#7995a6',9);
  ctrl.inputWeights.forEach((row,j)=>row.forEach((v,i)=>{if(Math.abs(v)>.52)line(c,[[inputs[i].x,inputs[i].y],[core[j].x,core[j].y]],`rgba(115,154,141,${.04+Math.abs(ins[i])*.14})`,.5);}));
  ctrl.recurrentWeights.forEach((row,i)=>row.forEach((v,j)=>{if(Math.abs(v)>.12)line(c,[[core[i].x,core[i].y],[core[j].x,core[j].y]],'#68857d22',.6);}));
  ctrl.readout.forEach((row,k)=>row.slice(0,32).forEach((v,j)=>{if(j%3===k%3)line(c,[[core[j].x,core[j].y],[outputs[k].x,outputs[k].y]],v>=0?'#a2d9b234':'#cfaa6f34',.6);}));
  inputs.forEach((p,i)=>{const value=ins[i]??0;ellipse(c,p.x,p.y,3.5,3.5,value>=0?mint:amber);label(c,INPUT_NAMES[i].toUpperCase(),32,p.y+3,'#859eac',7);label(c,value.toFixed(2),249,p.y+3,'#537a8d',6);});
  core.forEach((p,i)=>{const v=ctrl.state[i],color=v>=0?mint:amber;ellipse(c,p.x,p.y,13,13,color+'08',color+'30');ellipse(c,p.x,p.y,4+Math.abs(v)*4,4+Math.abs(v)*4,color+Math.round(80+Math.abs(v)*175).toString(16).padStart(2,'0'));label(c,`${i}`.padStart(2,'0'),p.x-5,p.y+24,'#4d6d7f',6);if(ctrl.lesion&&i<8){line(c,[[p.x-9,p.y-9],[p.x+9,p.y+9]],'#cf7979',1.4);}});
  outputs.forEach((p,i)=>{const selected=i===ctrl.last.action;ellipse(c,p.x,p.y,selected?11:6,selected?11:6,selected?mint:'#38554f',selected?'#def2d7':'#6c9484');label(c,ACTION_NAMES[i].toUpperCase(),p.x+28,p.y+3,selected?mint:'#6d899c',9);label(c,ctrl.last.q[i].toFixed(3),1020,p.y+3,'#5f8598',8);});
  label(c,'FIXED INPUT PROJECTIONS',208,398,'#466b80',7);label(c,'SHORT-TERM STATE',455,398,'#466b80',7);label(c,'PLASTIC READOUT + STEERING PRIOR',769,398,'#466b80',7);
}
export function drawMarket(canvas,results){
  const c=surface(canvas,1150,310);if(!c||!results?.length)return;
  const all=results.flatMap(r=>r.curve.map(p=>p.equity)),min=Math.floor(Math.min(...all)-1),max=Math.ceil(Math.max(...all)+1),left=66,right=1115,top=27,bottom=266;
  for(let i=0;i<5;i++){const y=top+(bottom-top)*i/4,value=max-(max-min)*i/4;line(c,[[left,y],[right,y]],'#2a414e',.6);label(c,`$${value.toFixed(1)}`,17,y+4,'#6b899d',9);}
  const zero=bottom-(100-min)/(max-min)*(bottom-top);c.setLineDash([4,6]);line(c,[[left,zero],[right,zero]],'#7893a188',.8);c.setLineDash([]);
  const colors=[mint,amber,'#788da4'];results.forEach((result,k)=>{const points=result.curve.map((p,i)=>[left+i/(result.curve.length-1)*(right-left),bottom-(p.equity-min)/(max-min)*(bottom-top)]);line(c,points,colors[k],k===0?2:1.1);const end=points.at(-1);ellipse(c,end[0],end[1],3,3,colors[k]);});
  for(let i=0;i<6;i++)label(c,`BAR ${Math.round(i*(results[0].bars-1)/5)}`,left+i*(right-left)/5-10,293,'#53768b',8);
}
