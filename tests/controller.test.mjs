import test from 'node:test';
import assert from 'node:assert/strict';
import {Simulation} from '../src/core/simulation.js';
test('online updates change only the plastic readout',()=>{const sim=new Simulation(),inputs=JSON.stringify(sim.controller.inputWeights),recurrence=JSON.stringify(sim.controller.recurrentWeights);sim.step(150);assert.ok(sim.controller.weightNorm()>0);assert.equal(JSON.stringify(sim.controller.inputWeights),inputs);assert.equal(JSON.stringify(sim.controller.recurrentWeights),recurrence);});
test('freezing learning preserves weights but allows neural activity and movement',()=>{const sim=new Simulation();sim.step(100);sim.intervene('plasticity');const weights=JSON.stringify(sim.controller.readout),x=sim.ant.x;sim.step(100);assert.equal(JSON.stringify(sim.controller.readout),weights);assert.notEqual(sim.ant.x,x);assert.ok(sim.controller.state.some(v=>v!==0));});
test('neural intervention clamps the selected recurrent units',()=>{const sim=new Simulation();sim.step(40);sim.intervene('lesion');sim.step(50);assert.ok(sim.controller.state.slice(0,8).every(v=>v===0));assert.ok(sim.controller.state.slice(8).some(v=>v!==0));});
