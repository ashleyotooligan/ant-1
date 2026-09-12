/** Mulberry32. A run never reads Math.random or the wall clock. */
export class Random {
  constructor(seed = 17) { this.state = seed >>> 0; }
  next() {
    let t = this.state += 0x6D2B79F5;
    this.state >>>= 0;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  between(a, b) { return a + (b - a) * this.next(); }
  int(n) { return Math.floor(this.next() * n); }
}
