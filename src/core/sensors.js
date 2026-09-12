import { angle, clamp } from './math.js';
export function sense(ant, arena, options, disabled = null) {
  const probe = side => ({x: ant.x + Math.cos(ant.heading + side * 0.55) * 38, y: ant.y + Math.sin(ant.heading + side * 0.55) * 38});
  const left = probe(-1), right = probe(1);
  const l = disabled === 'left' ? 0 : arena.odour(left.x, left.y);
  const r = disabled === 'right' ? 0 : arena.odour(right.x, right.y);
  // Home and remembered target bearings are idealised vector sensors, not image recognition.
  const bearing = point => angle(Math.atan2(point.y - ant.y, point.x - ant.x) - ant.heading) / Math.PI;
  return [l, r, clamp((r - l) / Math.max(0.002, r + l) * 18),
    disabled === 'left' ? 0 : arena.proximity(ant.x, ant.y, ant.heading - 0.65),
    arena.proximity(ant.x, ant.y, ant.heading),
    disabled === 'right' ? 0 : arena.proximity(ant.x, ant.y, ant.heading + 0.65),
    options.memory && ant.foodMemory ? bearing(ant.foodMemory) : 0,
    bearing(arena.nest), ant.carrying ? 1 : 0, ant.velocity / options.speed,
    clamp(ant.lastReward), 1];
}
