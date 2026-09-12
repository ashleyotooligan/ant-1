# ANT-1 model card

| Field | Description |
| --- | --- |
| Version | 0.1.0 |
| Model family | Hybrid synthetic recurrent controller with a designed steering prior |
| Intended use | Inspectable artificial-life experiments, programming education, controlled software interventions |
| Model inputs | 12 idealised sensory and internal-state channels |
| Internal state | 32 leaky tanh units |
| Learned parameters | A 5 × 45 action-value readout |
| Fixed parameters | Input and recurrent matrices, sensing formulas, navigation prior |
| Training | Online temporal-difference updates within a run |
| Default data | Generated arena states; generated prices only in the optional extension |
| Biological data | None |
| Evaluation | Seven toy-arena conditions, 12 matched seeds, 2,400 steps each |
| Operational dependencies | Browser alone for standalone edition; Node.js for CLI |

The model is not intended to estimate the neural anatomy, cognition, consciousness, or behavioural competence of real ants. It does not implement a scanned connectome, a biologically fitted neuron model, full body physics, visual navigation, or validated neurophysiology.

Successful default navigation is largely supported by the designed prior. The default benchmark does not show higher food returns from the plastic readout. Recurrent ablation leaves direct sensory features and the steering prior available, so a small behavioural effect does not mean recurrence is universally unnecessary.

The market adapter is an engineering demonstration. It has no live order route and no validated financial predictive ability. Navigation-to-market transfer is not evaluated.

Runs should always be described with their software version, seed, condition, and data provenance. Use “synthetic recurrent units” when discussing the network size; do not relabel these units as measured ant neurons.
