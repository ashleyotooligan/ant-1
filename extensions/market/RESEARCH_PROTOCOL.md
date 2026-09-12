# Research protocol: external-task adaptation

## Present question

Can a shared neural-controller architecture receive a new observation schema, produce legal paper actions, and generate a reproducible event ledger without future-data leakage?

Version 0.1 addresses that interface question. It does not establish predictive trading ability, an ant's understanding of markets, or transfer learning.

## Current comparison

Use the same bars, initial cash, allocation target, fees and slippage for three policies: fresh neural controller, buy-and-hold, and random actions with the same output-to-action mapping. Report all three, including negative outcomes. The initial synthetic fixture is a smoke test of the experiment wiring, not a financial benchmark.

## Requirements before a stronger claim

- Fix policy choices and hyperparameters before looking at test outcomes.
- Separate training, validation and chronologically later test periods.
- Compare multiple independently sourced and documented datasets.
- Include turnover, net returns, drawdown, exposure, and the distribution over policy seeds.
- Test execution assumptions and compare against a cash-only control.
- Preserve raw data provenance and document adjustments or missing bars.
- Report all evaluated variants so selection effects remain visible.

## Transfer question, reserved for future work

A real transfer study would specify a navigation-trained checkpoint, which parameters are retained, how observations and actions are remapped, what is frozen, and what can relearn. It would compare that transferred controller with fresh initialisation under matched conditions.

Simply sharing `NeuralController` between two environments does not demonstrate transfer. The current adapter deliberately starts with a fresh readout and describes the result as architecture reuse.
