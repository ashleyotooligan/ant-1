import { mean } from './math.js';
export function measure(sim) {
  return {seed:sim.options.seed, ticks:sim.tick, seconds:sim.tick*sim.options.dt, pickups:sim.ant.pickups,
    returns:sim.ant.returns, firstPickupTick:sim.ant.firstPickupTick, pathLength:sim.ant.pathLength,
    collisions:sim.ant.collisions, reward:sim.ant.totalReward, neuralActivity:mean(sim.controller.state.map(Math.abs)),
    weightNorm:sim.controller.weightNorm(), learningUpdates:sim.controller.updates,
    coverage:sim.visited.size/(24*14)};
}
