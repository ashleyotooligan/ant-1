export const clamp = (v, lo = -1, hi = 1) => Math.max(lo, Math.min(hi, v));
export const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export const angle = v => Math.atan2(Math.sin(v), Math.cos(v));
export const dot = (a, b) => a.reduce((sum, v, i) => sum + v * b[i], 0);
export const mean = values => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
export function summary(values) {
  const m = mean(values);
  const sd = values.length > 1 ? Math.sqrt(values.reduce((s, x) => s + (x - m) ** 2, 0) / (values.length - 1)) : 0;
  return { n: values.length, mean: m, sd, min: Math.min(...values), max: Math.max(...values) };
}
