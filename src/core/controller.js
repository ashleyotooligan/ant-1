import { Random } from './random.js';
import { clamp, dot } from './math.js';
import { TURNS, INPUTS, ACTIONS, RESERVOIR, FEATURES, LESION_UNITS } from './config.js';

/** Fixed leaky reservoir + plastic action-value readout + explicit steering prior.
 * A compact synthetic model; no measured ant connectome or biological neurons.
 *
 * Dimensions come from config.js. See the note there: a mismatch between the
 * sensor vector and these arrays does not raise, it silently drops terms.
 */
export class NeuralController {
  constructor(options) {
    this.options = options; this.rng = new Random(options.seed ^ 0x91ab);
    this.size = RESERVOIR; this.state = Array(RESERVOIR).fill(0);
    this.inputWeights = Array.from({length:RESERVOIR}, () => Array.from({length:INPUTS}, () => this.rng.between(-0.65, 0.65)));
    this.recurrentWeights = Array.from({length:RESERVOIR}, () => Array.from({length:RESERVOIR}, () => this.rng.next() < 0.22 ? this.rng.between(-0.19, 0.19) : 0));
    this.readout = Array.from({length:ACTIONS}, () => Array(FEATURES).fill(0));
    this.updates = 0; this.lastTD = 0; this.lesion = false;
    this.last = {inputs: Array(INPUTS).fill(0), q: Array(ACTIONS).fill(0), action:2, features:Array(FEATURES).fill(0)};
  }
  project(inputs) {
    return this.inputWeights.map((row, i) => this.lesion && i < LESION_UNITS ? 0 :
      0.65 * (this.options.recurrent ? this.state[i] : 0) + 0.35 * Math.tanh(dot(row, inputs) + (this.options.recurrent ? dot(this.recurrentWeights[i], this.state) : 0)));
  }
  prior(inputs) {
    if (!this.options.prior) return Array(ACTIONS).fill(0);
    let turn = inputs[8] ? inputs[7] * 2.8 : inputs[2] * 0.55 + inputs[6] * 0.25;
    turn += (inputs[3] - inputs[5]) * 1.2;
    if (inputs[4] > 0.15) turn += (inputs[3] > inputs[5] ? 1 : -1) * inputs[4] * 0.8;
    turn = clamp(turn, -0.43, 0.43);
    return TURNS.map(t => -2.2 * (t - turn) ** 2);
  }
  values(inputs, h) {
    const features = [...h, ...inputs, 1], prior = this.prior(inputs);
    return {features, q:this.readout.map((row, i) => dot(row, features) + prior[i])};
  }
  decide(inputs) {
    this.state = this.project(inputs);
    const {features,q} = this.values(inputs,this.state);
    const action = this.rng.next() < this.options.epsilon ? this.rng.int(ACTIONS) : q.indexOf(Math.max(...q));
    this.last = {inputs:[...inputs],features,q,action};
    return action;
  }
  learn(reward, nextInputs, terminal = false) {
    if (!this.options.plasticity) { this.lastTD = 0; return; }
    const next = this.values(nextInputs, this.project(nextInputs));
    const {action,features,q} = this.last;
    const delta = clamp(reward + (terminal ? 0 : this.options.discount * Math.max(...next.q)) - q[action], -2, 2);
    const norm = 1 + dot(features,features);
    for (let i=0;i<FEATURES;i++) this.readout[action][i] = clamp(this.readout[action][i] + this.options.learningRate * delta * features[i] / norm, -0.35, 0.35);
    this.lastTD = delta; this.updates++;
  }
  eraseMemory() { this.state.fill(0); this.readout.forEach(row => row.fill(0)); this.updates=0; this.lastTD=0; }
  weightNorm() { return Math.sqrt(this.readout.reduce((sum,row) => sum+dot(row,row),0)); }
}
