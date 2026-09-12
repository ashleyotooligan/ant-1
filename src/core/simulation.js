import { DEFAULTS, VERSION, TURNS, ACTION_NAMES } from './config.js';
import { Arena } from './arena.js';
import { NeuralController } from './controller.js';
import { Random } from './random.js';
import { sense } from './sensors.js';
import { angle, distance } from './math.js';
import { measure } from './metrics.js';
export class Simulation {
  constructor(config={}) {
    this.options = {...DEFAULTS,...config};
    this.initialOptions = {...this.options};
    this.rng = new Random(this.options.seed);
    this.arena = new Arena(); this.controller = new NeuralController(this.options);
    this.ant = {x:170,y:300,heading:this.rng.between(-0.8,0.1),velocity:0,carrying:false,foodMemory:null,lastReward:0,pickups:0,returns:0,pathLength:0,collisions:0,totalReward:0,firstPickupTick:null};
    this.tick=0; this.disabled=null; this.events=[]; this.interventions=[]; this.trace=[]; this.trail=[]; this.activity=[]; this.visited=new Set();
    this.log('INIT','Sensor–controller–body loop initialised.');
    this.inputs=sense(this.ant,this.arena,this.options,this.disabled);
  }
  log(type,message) { this.events.push({tick:this.tick,type,message}); }
  step(n=1) {
    for(let i=0;i<n;i++) {
      const a=this.ant, goal=a.carrying?this.arena.nest:this.arena.food;
      const before=distance(a,goal);
      this.inputs=sense(a,this.arena,this.options,this.disabled);
      const action=this.controller.decide(this.inputs);
      a.heading=angle(a.heading+TURNS[action]);
      const speed=this.options.speed*(1-this.inputs[4]*0.52);
      const nx=a.x+Math.cos(a.heading)*speed, ny=a.y+Math.sin(a.heading)*speed;
      let reward=-0.003, reached=false;
      if(this.arena.blocked(nx,ny)) {a.velocity=0;a.collisions++;reward-=0.16;}
      else {a.pathLength+=Math.hypot(nx-a.x,ny-a.y);a.x=nx;a.y=ny;a.velocity=speed;}
      reward+=0.006*(before-distance(a,goal)); // Privileged distance-based shaping, explicitly disclosed.
      this.tick++;
      if(distance(a,goal)<goal.radius) {
        reached=true;
        if(a.carrying) {a.carrying=false;a.returns++;reward+=2;this.log('RETURN',`Food delivered to nest · return ${a.returns}`);}
        else {a.carrying=true;a.pickups++;a.firstPickupTick??=this.tick;a.foodMemory={x:goal.x,y:goal.y};reward+=1.2;this.log('CONTACT','Food contact · vector memory recorded.');}
      }
      a.lastReward=reward;a.totalReward+=reward;
      const nextInputs=sense(a,this.arena,this.options,this.disabled);
      this.controller.learn(reward,nextInputs,reached);
      this.visited.add(`${Math.min(23,Math.floor(a.x/40))},${Math.min(13,Math.floor(a.y/40))}`);
      this.trail.push({x:a.x,y:a.y,carrying:a.carrying,tick:this.tick});
      if(this.trail.length>2500)this.trail.shift();
      if(this.tick%4===0){this.activity.push([...this.controller.state]);if(this.activity.length>140)this.activity.shift();}
      if(this.tick%10===0) this.trace.push({tick:this.tick,x:a.x,y:a.y,action:ACTION_NAMES[action],reward,carrying:a.carrying,activity:measure(this).neuralActivity});
    }
    return this;
  }
  intervene(type) {
    const allowed=['relocate','antenna','restore','lesion','erase','plasticity'];
    if(!allowed.includes(type))throw new Error(`Unknown intervention: ${type}`);
    this.interventions.push({tick:this.tick,type});
    if(type==='relocate'){this.arena.relocateFood();this.log('SHIFT','Food source relocated. Stored vector retained.');}
    if(type==='antenna'){this.disabled='left';this.log('ABLATION','Left odour and proximity input silenced.');}
    if(type==='restore'){this.disabled=null;this.controller.lesion=false;this.log('RESTORE','Sensors and recurrent units restored.');}
    if(type==='lesion'){this.controller.lesion=true;this.log('LESION','Recurrent units 00–07 clamped to zero.');}
    if(type==='erase'){this.controller.eraseMemory();this.ant.foodMemory=null;this.log('RESET','Reservoir, readout and food vector erased.');}
    if(type==='plasticity'){this.options.plasticity=!this.options.plasticity;this.log('LEARNING',`Readout plasticity ${this.options.plasticity?'enabled':'frozen'}.`);}
  }
  metrics(){return measure(this);}
  export(){return {schema:'ant1.session.v1',version:VERSION,mode:'synthetic-ant-simulation',initialOptions:this.initialOptions,ticks:this.tick,interventions:this.interventions,metrics:this.metrics(),events:this.events,trace:this.trace};}
}
