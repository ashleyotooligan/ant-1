<p align="center"><img src="assets/ant-mark.svg" width="54" alt="ANT-1 ant symbol"></p>

# ANT-1

### One ant. A closed loop.

**An open laboratory connecting an ant-inspired body to a synthetic neural controller.**

What happens when an animal-like body receives a stream of sensory signals, turns them into internal activity, and acts back on the world? What changes when you interrupt one part of that connection?

ANT-1 makes that loop visible. A single simulated ant explores an arena, finds an odour source, records a simple food-location vector, and returns to its nest. You can inspect its inputs, watch its recurrent activity, intervene in the controller, and reproduce the resulting trajectory from a seed.

| Release | Controller | Body | Execution |
| --- | --- | --- | --- |
| `0.1.0` · experimental | 12 inputs / 32 recurrent units / 5 actions | Procedural ant in a 2D arena | Local, offline, no account |

![ANT-1 observation figure: an ant, its arena, and actual neural activity](assets/figures/observation.png)

*Figure 01. Seed 17 at step 900. Rendered directly from the simulation and the application's drawing functions. Documentation images are model figures, not browser screenshots or biological recordings.*

**[Start here](docs/QUICKSTART.md)** · **[Methods](docs/METHODS.md)** · **[Experiments](experiments/README.md)** · **[Results](docs/RESULTS.md)** · **[GitHub upload guide](docs/GITHUB_UPLOAD.md)**

## Open the laboratory

Download or clone the repository, then **double-click `ANT-1.html`**. This self-contained edition embeds the application and its reference runs. No Python, Node.js, API key, account, or internet connection is required for the laboratory itself.

For source development, use either local server:

```bash
# Node.js 22 or later — no npm install needed
npm start

# Or Python 3
python start_ant1.py
```

Open `http://127.0.0.1:8000`. On Windows, `Start-ANT1.bat` launches the Python option. See the [quick start](docs/QUICKSTART.md) for exact instructions and stopping the server.

## The connection is the experiment

ANT-1 is built around five things you can inspect:

1. **A sensory boundary.** Two odour probes, obstacle channels, idealised navigation vectors, and internal-state inputs describe the current situation.
2. **A neural state.** A 32-unit leaky recurrent network transforms the inputs into continuous internal activity.
3. **A motor decision.** A learned action-value readout and an explicit, engineered steering prior choose one of five turns.
4. **A consequence.** The body moves, collides, reaches food, or returns to the nest.
5. **An update.** A temporal-difference learning rule adjusts the readout, and the next observation closes the loop.

The designed steering prior makes the initial body useful to observe. The control protocols expose how much of its behaviour comes from that scaffold. The network is a compact synthetic model; its units and connections are not taken from an ant connectome.

![Actual model inputs, recurrent activations, and motor outputs](assets/figures/neural-interface.png)

*Figure 02. Selected connections and actual continuous activations from the same seed-17 run. The diagram is an instrument view of the implementation.*

<details>
<summary><strong>Watch a deterministic observation replay</strong></summary>

![ANT-1 moving through the arena](assets/figures/observation-loop.gif)

Rendered replay from steps 680–1056, seed 17. The animation runs at 10 times simulated time and loops back to its starting state. The ant, trail, sensory rays, and target positions are produced by the application renderer.

</details>

## Five observation surfaces

| Surface | What you can do |
| --- | --- |
| **Observatory** | Run, pause, step, change speed, inspect the ant, view sensory telemetry and export a session. |
| **Neural interface** | Watch the recurrent core and motor values; silence sensors or units, freeze learning, erase memory, or move food. |
| **Experiments** | Execute a fixed protocol and inspect its measured outcome. |
| **Run archive** | Reproduce included runs and inspect the matched-seed benchmark. |
| **External tasks** | Explore an optional market-signal adapter using a fresh instance of the controller. |

## A programme of controlled experiments

Each protocol lasts 2,400 steps, equivalent to 240 simulated seconds. Interventions occur at step 1,000. The arena and seed can be held constant across conditions.

| Protocol | Change | Question |
| --- | --- | --- |
| `EXP-01` Navigation | Full controller | Can it find food and complete repeated returns? |
| `EXP-02` Relocation | Move the food; retain its old memory | How does the loop respond to environmental change? |
| `EXP-03` Antenna | Silence left odour and proximity inputs | How dependent is behaviour on bilateral sensing? |
| `EXP-04` Frozen readout | Disable learning from the start | What does the plastic readout contribute? |
| `EXP-05` Memory | Erase state, readout, and the food vector | What happens after a composite memory interruption? |
| `EXP-06` Recurrent intervention | Clamp units 00–07 to zero | Does this intervention alter the outcome? |
| `EXP-07` No steering prior | Remove the engineered navigation scaffold | What can the small learner do without that scaffold? |

See [protocol definitions](experiments/protocols.js), [the experiment guide](experiments/README.md), and [the model card](docs/MODEL_CARD.md).

## Initial observations

The repository includes **84 executed runs: seven conditions × 12 fixed seeds**. The complete per-seed metrics are in [`data/benchmarks/reference.json`](data/benchmarks/reference.json).

![Matched-seed experimental controls and observed food returns](assets/figures/controls.png)

The default controller and the frozen-readout control both complete an average of **5.00 returns**. Silencing the left antenna lowers that figure to **2.00**. Removing the steering prior lowers it to **0.42**.

These results show that the engineered prior is a major contributor in this arena. They **do not establish a food-return advantage from learning**. That is a useful starting result: the experiment reveals which mechanism matters, instead of treating movement or changing weights as proof of learned intelligence.

The [results note](docs/RESULTS.md) describes the limits of this comparison, including shared geometry, the composite memory intervention, and the absence of an unseen-layout evaluation.

## Reproduce, inspect, extend

With Node.js 22 or later:

```bash
npm test
npm run experiment -- --protocol antenna --seed 17
npm run benchmark
npm run replay -- --file data/runs/relocation-seed17.json
npm run build
```

The final command rebuilds the standalone HTML from the source. The application, tests, simulation, and command-line experiments have **no third-party runtime dependencies**. Figure regeneration is an optional separate workflow.

The [`src/core`](src/core) modules run in both the browser and Node. [`experiments`](experiments) defines interventions, while [`src/ui`](src/ui) observes the same core. Exported JSON contains the software version, initial options, seed, exact intervention times, events, sampled trajectory, and measured outcome.

| Read next | Purpose |
| --- | --- |
| [Architecture](docs/ARCHITECTURE.md) | Module boundaries and the feedback loop |
| [Sensor interface](docs/SENSORS.md) | All 12 input channels and their assumptions |
| [Controller](docs/CONTROLLER.md) | State update, steering prior, action values, and learning rule |
| [Methods](docs/METHODS.md) | Timing, rewards, collisions, and interpretation |
| [Reproducibility](docs/REPRODUCIBILITY.md) | Replays, fixed seeds, checks, and generated artifacts |
| [Figure provenance](assets/figures/README.md) | How the visuals were made and how to regenerate them |
| [References](docs/REFERENCES.md) | Scientific inspiration and the limits of that connection |

## External-task extension: market signals

The ant experiment remains the centre of ANT-1. The optional **M–01 market extension** asks a narrower engineering question: can the same input–state–action architecture be connected to another environment with explicit, inspectable outcomes?

A **fresh controller** receives a 12-channel encoding of market observations. Its five outputs map to sell, hold, and buy actions. A local paper broker applies the selected action at the **next bar's close**, with transaction fees, adverse slippage, and an 80% purchase allocation limit. The included comparison runs the neural policy, buy-and-hold, and a random-action control against the same price path.

![Optional market-interface comparison on synthetic prices](assets/figures/market-interface.png)

*Figure 04. A synthetic fixture and a $100 paper balance. This is a demonstration of the adapter and execution model. It is not evidence that ant navigation transfers to financial prediction.*

```bash
npm run market
npm run market -- --data my-bars.json --seed 17
```

The default data are explicitly synthetic. You can load your own ordered price JSON in the browser or CLI; the schema can represent either crypto or equity observations. No exchange account, wallet, credentials, live orders, or external network requests are part of this module.

| File | Responsibility |
| --- | --- |
| [`extensions/market/encoder.js`](extensions/market/encoder.js) | Trailing price and portfolio-state features |
| [`extensions/market/policy.js`](extensions/market/policy.js) | Neural policy and comparison policies |
| [`extensions/market/broker.js`](extensions/market/broker.js) | Cash, positions, allocation, costs, and ledger |
| [`extensions/market/replay.js`](extensions/market/replay.js) | Causal event order, validation, and outcomes |
| [`extensions/market/fixtures.js`](extensions/market/fixtures.js) | Seeded synthetic prices |
| [`extensions/market/RESEARCH_PROTOCOL.md`](extensions/market/RESEARCH_PROTOCOL.md) | Hypotheses, control conditions, and evaluation limits |
| [`tests/market.test.mjs`](tests/market.test.mjs) | Accounting, delayed execution, and future-data isolation |

Start with the [extension guide](extensions/market/README.md) and [execution specification](extensions/market/EXECUTION.md).

## Where the experiment goes next

The next useful milestones are stronger sensory constraints, genuinely held-out arena layouts, cleaner separation of short-term state from spatial memory, and a stronger learner tested against the frozen control. These are research directions, not completed capabilities. See the [roadmap](docs/ROADMAP.md).

Contributions are welcome when they make a mechanism easier to inspect or a result easier to reproduce. Read [CONTRIBUTING.md](CONTRIBUTING.md) and attach a seed, configuration, and run file to experimental reports.

**ANT-1 is an independent artificial-life software experiment.** It is not a biological ant-brain reconstruction, a neural recording from a living animal, or a validated model of ant cognition. The body and arena are simulated; the controller combines fixed recurrence, an engineered steering prior, a simple vector-memory primitive, and a plastic readout.

Code and original visuals: [MIT](LICENSE). Bundled fonts retain their [original licence](assets/fonts/LICENSE.txt). Scientific references are inspiration, not an affiliation or endorsement.
