export const VERSION = '0.1.0';
export const DEFAULTS = Object.freeze({ seed: 17, dt: 0.1, speed: 3.1, learningRate: 0.002, discount: 0.92, epsilon: 0.045, plasticity: true, recurrent: true, memory: true, prior: true });
export const INPUT_NAMES = ['Odour · left', 'Odour · right', 'Odour gradient', 'Obstacle · left', 'Obstacle · forward', 'Obstacle · right', 'Food memory bearing', 'Nest vector bearing', 'Carrying food', 'Motor speed', 'Previous reward', 'Bias'];
export const ACTION_NAMES = ['Hard left', 'Left', 'Forward', 'Right', 'Hard right'];
export const TURNS = [-0.43, -0.13, 0, 0.13, 0.43];
