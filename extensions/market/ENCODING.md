# Market observation interface

Input is a JSON array of at least three bars in strictly increasing timestamp order. `timestamp` and `close` are required; `volume` is optional. Close must be finite and positive. Volume, when present, must be finite and non-negative.

```json
[
  {"timestamp":"2026-01-01T00:00:00Z","close":100.0,"volume":200},
  {"timestamp":"2026-01-01T00:01:00Z","close":100.3,"volume":240},
  {"timestamp":"2026-01-01T00:02:00Z","close":99.9,"volume":180}
]
```

The browser accepts up to 10,000 bars in a file below 5 MB. The CLI accepts longer arrays subject to available memory. The code does not infer sessions, split adjustments, ticker identity, currency, or whether a price is adjusted for dividends. The user must choose a coherent series and describe its provenance.

| Index | Feature |
| --- | --- |
| 0 | One-bar return × 40 |
| 1 | Price deviation from trailing mean × 20 |
| 2 | Root-mean-square relative price deviation × 30 |
| 3 | Cash / current equity |
| 4 | Position value / current equity |
| 5 | Current sampled drawdown × 5 |
| 6 | Volume / 1,000, clipped to [0, 1] |
| 7 | One-bar return × mean deviation × 300 |
| 8–9 | Reserved; zero |
| 10 | Previous step portfolio return × 100 |
| 11 | Bias; one |

Scaled signals are clipped to [−1, 1] unless stated otherwise. The trailing window contains at most 13 closes, including the current close. The volatility-like feature is dispersion around the mean price, not a standard deviation of returns. Before a previous close exists, the one-bar return is zero.

Every feature is computed from `bars[0..t]` and current portfolio state. Future prices can change subsequent results but cannot change decisions already made; that invariant is tested explicitly.
