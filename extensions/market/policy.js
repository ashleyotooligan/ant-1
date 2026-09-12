import { NeuralController } from '../../src/core/controller.js';
import { DEFAULTS } from '../../src/core/config.js';
import { Random } from '../../src/core/random.js';
export class MarketPolicy {
  constructor(seed=17){this.controller=new NeuralController({...DEFAULTS,seed,prior:false,epsilon:0.12,learningRate:0.015});}
  decide(inputs){const action=this.controller.decide(inputs);return {action,side:['sell','sell','hold','buy','buy'][action]};}
  learn(reward,nextInputs,terminal=false){this.controller.learn(reward*100,nextInputs,terminal);}
}
export function baselinePolicy(name,seed){const rng=new Random(seed);return index=>name==='buy-and-hold'?(index===0?'buy':'hold'):['sell','sell','hold','buy','buy'][rng.int(5)];}
