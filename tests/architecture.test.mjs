import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Simulation} from '../src/core/simulation.js';
import {NeuralController} from '../src/core/controller.js';
import {Arena} from '../src/core/arena.js';
import {sense} from '../src/core/sensors.js';
import {summary, dot} from '../src/core/math.js';
import {DEFAULTS, INPUT_NAMES, ACTION_NAMES, TURNS, INPUTS, ACTIONS, RESERVOIR, FEATURES, ARENA, GRID_CELL, GRID_COLS, GRID_ROWS, GRID_CELLS} from '../src/core/config.js';

// dot() folds over its left operand, so a width mismatch silently drops terms
// instead of raising. These assertions are the thing that raises.

test('the controller is built to exactly the dimensions config declares',()=>{
  const c=new NeuralController({...DEFAULTS});
  assert.equal(c.state.length,RESERVOIR);
  assert.equal(c.inputWeights.length,RESERVOIR);
  assert.equal(c.readout.length,ACTIONS);
  for(const row of c.inputWeights) assert.equal(row.length,INPUTS,'each reservoir unit must weight every sensor channel');
  for(const row of c.recurrentWeights) assert.equal(row.length,RESERVOIR);
  for(const row of c.readout) assert.equal(row.length,FEATURES,'each action must weight every readout feature');
});

test('the sensor vector is exactly as wide as the controller expects',()=>{
  const sim=new Simulation({seed:17});
  const inputs=sense(sim.ant,sim.arena,sim.options,null);
  assert.equal(inputs.length,INPUTS,`sense() returned ${inputs.length} channels but config declares ${INPUTS}; add the channel to INPUT_NAMES`);
  assert.equal(INPUT_NAMES.length,INPUTS);
});

test('the readout feature vector is the reservoir, the sensors and one bias',()=>{
  assert.equal(FEATURES,RESERVOIR+INPUTS+1);
  const sim=new Simulation({seed:17});
  sim.step(5);
  assert.equal(sim.controller.last.features.length,FEATURES);
  assert.equal(sim.controller.last.inputs.length,INPUTS);
  assert.equal(sim.controller.last.q.length,ACTIONS);
  // The bias feature must actually be reached by the readout, not fall off the end.
  assert.equal(sim.controller.readout[0].length,sim.controller.last.features.length);
});

test('every action has a turn and a name',()=>{
  assert.equal(TURNS.length,ACTIONS);
  assert.equal(ACTION_NAMES.length,ACTIONS);
});

test('a dimension mismatch would change the result, so it must not be silent',()=>{
  // Demonstrates why the assertions above exist: this is the failure they catch.
  assert.equal(dot(Array(FEATURES).fill(1),Array(FEATURES+1).fill(1)),FEATURES);
  assert.ok(Number.isNaN(dot(Array(FEATURES+1).fill(1),Array(FEATURES).fill(1))));
});

test('the coverage grid covers the arena it measures',()=>{
  const arena=new Arena();
  assert.equal(arena.width,ARENA.width);
  assert.equal(arena.height,ARENA.height);
  assert.ok(GRID_COLS*GRID_CELL>=ARENA.width,'grid columns must span the arena width');
  assert.ok(GRID_ROWS*GRID_CELL>=ARENA.height,'grid rows must span the arena height');
  assert.equal(GRID_CELLS,GRID_COLS*GRID_ROWS);
  const sim=new Simulation({seed:17});
  sim.step(1200);
  const {coverage}=sim.metrics();
  assert.ok(coverage>0&&coverage<=1,`coverage must be a fraction, got ${coverage}`);
  assert.ok(sim.visited.size<=GRID_CELLS);
});

test('summary reports null rather than Infinity for an empty sample',()=>{
  const empty=summary([]);
  assert.equal(empty.n,0);
  assert.equal(empty.min,null);
  assert.equal(empty.max,null);
  assert.ok(Number.isFinite(empty.mean));
  // Infinity serialises to null anyway; the record should not depend on that.
  assert.equal(JSON.parse(JSON.stringify(empty)).min,null);
});

test('summary handles a sample too large to spread into Math.min',()=>{
  const big=Array.from({length:200000},(_,i)=>i);
  const s=summary(big);           // Math.min(...big) throws RangeError here
  assert.equal(s.min,0);
  assert.equal(s.max,199999);
  assert.equal(s.n,200000);
});

test('the interface reports the architecture the code actually builds',async()=>{
  const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
  assert.match(html,new RegExp(`${INPUTS} inputs · ${RESERVOIR} recurrent units · ${ACTIONS} outputs`),
    'index.html states an architecture that no longer matches config.js');
  assert.match(html,new RegExp(`SENSORY TELEMETRY <span>${INPUTS} CHANNELS`));
  assert.match(html,new RegExp(`<span>${RESERVOIR} recurrent units</span>`));
});
