# M–01 · External market interface

This optional extension connects a fresh instance of ANT-1's synthetic controller architecture to a paper market environment. The navigation experiment remains independent and does not need this directory to describe its research question.

## Run

In the application, select **External tasks → Run comparison**. Or use:

```bash
npm run market
npm run market -- --policy neural --seed 17
npm run market -- --data my-bars.json --out output/my-comparison.json
```

The default fixture has 600 synthetic minute bars starting from an abstract price of 100. It contains changing drift, noise and a single downward shock. It is not exchange history. Included reference results are written by `scripts/generate-references.mjs`.

## Controller mapping

The adapter retains the 12-input, 32-unit, five-output shape. It disables the ant's navigation prior and starts the learned weights at zero. Outputs 0–1 map to sell, output 2 to hold, and outputs 3–4 to buy. Uniform random action indices therefore have sell/buy probabilities of 0.4 each and hold probability of 0.2. The random control uses the same mapping.

Readout learning rate is 0.015, exploration is 0.12, and the one-step portfolio return is multiplied by 100 before the shared learning update. There is no frozen navigation checkpoint or transfer procedure. This is architecture reuse, not demonstrated navigation-to-market transfer.

## Modules

- `encoder.js`: observations drawn only from the current and earlier bars, plus current portfolio state.
- `policy.js`: neural and comparison policies.
- `broker.js`: local long-only cash and quantity accounting.
- `replay.js`: event order, execution and metrics.
- `fixtures.js`: the synthetic price generator.
- `data/`: default bars and an executed reference comparison.
- `EXECUTION.md`: precise assumptions and the meaning of the metrics.
- `RESEARCH_PROTOCOL.md`: what a stronger evaluation would require.

See `tests/market.test.mjs` for the causal-prefix and accounting checks. The code does not import exchange SDKs, read environment credentials, sign wallet messages, or transmit orders. User-supplied data remain local to the process or browser tab.
