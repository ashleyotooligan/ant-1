export const VERSION = '0.1.0';
export const DEFAULTS = Object.freeze({ seed: 17, dt: 0.1, speed: 3.1, learningRate: 0.002, discount: 0.92, epsilon: 0.045, plasticity: true, recurrent: true, memory: true, prior: true });
export const INPUT_NAMES = ['Odour · left', 'Odour · right', 'Odour gradient', 'Obstacle · left', 'Obstacle · forward', 'Obstacle · right', 'Food memory bearing', 'Nest vector bearing', 'Carrying food', 'Motor speed', 'Previous reward', 'Bias'];
export const ACTION_NAMES = ['Hard left', 'Left', 'Forward', 'Right', 'Hard right'];
export const TURNS = [-0.43, -0.13, 0, 0.13, 0.43];

/* Architecture dimensions.
 *
 * These were previously written as bare numbers in controller.js (32, 12, 5,
 * 45), in metrics.js (24*14) and in simulation.js (40, 23, 13). Nothing tied
 * them to the names above, and dot() iterates its left operand, so a mismatch
 * does not throw - it silently drops terms. Adding one sensor channel produced
 * a controller that ran, learned and reported plausible numbers while ignoring
 * the new input in the reservoir and dropping the bias feature from the
 * readout. Deriving the dimensions here makes that impossible to get wrong.
 */
export const INPUTS = INPUT_NAMES.length;          // 12 sensory channels
export const ACTIONS = ACTION_NAMES.length;        // 5 motor actions
export const RESERVOIR = 32;                       // recurrent units
export const LESION_UNITS = 8;                     // units 00-07, clamped by the lesion intervention
export const FEATURES = RESERVOIR + INPUTS + 1;    // readout input: state, sensors, bias

/* Arena geometry and the coverage grid derived from it. */
export const ARENA = Object.freeze({ width: 960, height: 540 });
export const GRID_CELL = 40;
export const GRID_COLS = Math.ceil(ARENA.width / GRID_CELL);   // 24
export const GRID_ROWS = Math.ceil(ARENA.height / GRID_CELL);  // 14
export const GRID_CELLS = GRID_COLS * GRID_ROWS;               // 336
