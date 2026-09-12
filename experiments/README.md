# Experiment catalogue

Experiments are executable specifications. `protocols.js` defines their configuration and intervention schedule; `runner.js` applies each event before the next step. The browser reads the same protocol definitions.

```bash
npm run experiment -- --protocol navigation --seed 17
npm run experiment -- --protocol relocation --seed 17
npm run experiment -- --protocol antenna --seed 17
npm run experiment -- --protocol frozen --seed 17
npm run experiment -- --protocol memory --seed 17
npm run experiment -- --protocol lesion --seed 17
npm run experiment -- --protocol no-prior --seed 17
```

Output defaults to `output/<protocol>-seed<seed>.json`. Override with `--out path.json`. Set `--ticks` only for an intentionally different run length; such a run should not be treated as the standard 2,400-step protocol.

## Controls and scope

| Comparison | Held constant | Changed |
| --- | --- | --- |
| Navigation vs frozen | Seed, geometry, sensing, initial matrices, prior | Readout updates disabled |
| Navigation vs no-prior | Seed, geometry, model size, update rule | Designed steering scores removed |
| Navigation vs antenna | Everything until step 1,000 | Two left sensor channels zeroed |
| Navigation vs relocation | Everything until step 1,000 | Food coordinate changed; old memory retained |
| Navigation vs memory | Everything until step 1,000 | Three distinct memory mechanisms reset together |
| Navigation vs lesion | Everything until step 1,000 | First eight recurrent units clamped |

The same seed does not imply identical random-number consumption after different decisions, and trajectories can diverge after any intervention. The paired seed controls initial randomisation; it does not hold future sensory observations fixed.

## Add a protocol

Add an entry to `PROTOCOLS` with a unique ID, question, options, event list and tick count. Reuse supported intervention types or implement a new operation in `Simulation.intervene()`. Add a test that the operation changes the intended mechanism, then record the modified question and causal limitations.

Report negative results. Before calling an effect learning, compare against frozen weights and simple designed rules. Before calling an effect memory, isolate the state mechanism being manipulated.
