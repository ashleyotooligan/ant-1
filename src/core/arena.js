import { distance } from './math.js';
import { ARENA } from './config.js';
export class Arena {
  constructor() {
    this.width = ARENA.width; this.height = ARENA.height;
    this.nest = { x: 154, y: 300, radius: 27 };
    this.food = { x: 781, y: 159, radius: 22 };
    this.obstacles = [{ x: 380, y: 202, radius: 53 }, { x: 568, y: 365, radius: 66 }, { x: 676, y: 84, radius: 27 }];
  }
  blocked(x, y, margin = 9) {
    return x < 25 + margin || y < 25 + margin || x > this.width - 25 - margin || y > this.height - 25 - margin || this.obstacles.some(o => distance({x,y}, o) < o.radius + margin);
  }
  proximity(x, y, heading) {
    for (let d = 8; d <= 86; d += 6) if (this.blocked(x + Math.cos(heading) * d, y + Math.sin(heading) * d, 4)) return 1 - d / 92;
    return 0;
  }
  odour(x, y) { return Math.exp(-distance({x,y}, this.food) / 340); }
  relocateFood() { this.food = this.food.y < 270 ? {x: 786, y: 422, radius: 22} : {x: 781, y: 159, radius: 22}; }
}
