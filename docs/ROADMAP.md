# Research roadmap

Completed in 0.1.0: a shared browser/CLI engine, a recurrent controller with a transparent prior, local intervention controls, seven deterministic protocols, recorded reference runs, a matched-seed benchmark, direct-rendered figures, and an optional paper-market adapter.

## Next: separate the mechanisms

- Isolate reservoir reset, readout reset, and food-vector reset into separate protocols.
- Compare recurrence enabled/disabled with matched input and readout parameters.
- Evaluate weaker steering priors, and test whether learned policies recover lost performance.
- Expose distributions of first-contact time and path efficiency rather than relying on integer return counts.

## Then: make generalisation measurable

- Separate training layouts from evaluation layouts.
- Add sensor noise, obstacles that affect odour, and changes in target accessibility.
- Save trained policies and freeze them during held-out evaluation.
- Include explicit random-walk and simple chemotaxis-only baselines.
- Measure uncertainty across environment seeds as well as controller seeds.

## Longer-term interfaces

An image-based sensor, a more biologically motivated circuit, and a real robotic body would each require a new interface and validation programme. They are not present in this release. Any future use of measured anatomy should include dataset provenance and a precise mapping between biological entities and model parameters.

The market adapter can later support held-out datasets and stronger baselines. A claim of transfer requires a trained navigation checkpoint, a defined transfer procedure, and comparison against fresh initialisation. Reusing architecture alone is not transfer learning.
