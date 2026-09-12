# Initial result note

This note describes the generated reference set in `data/benchmarks/reference.json`, using version 0.1.0. The set contains 84 completed simulations. Seeds are 3, 7, 11, 17, 23, 31, 43, 59, 71, 89, 101 and 131. Every condition has 2,400 steps.

| Condition | Returns: mean ± sample SD | Collisions: mean | Shaped reward: mean |
| --- | ---: | ---: | ---: |
| navigation | 5.00 ± 0.00 | 0.0 | 51.69 |
| relocation | 5.00 ± 0.00 | 0.0 | 51.09 |
| antenna | 2.00 ± 0.00 | 0.0 | 16.31 |
| frozen | 5.00 ± 0.00 | 0.0 | 52.01 |
| memory | 5.00 ± 0.00 | 0.0 | 51.85 |
| lesion | 5.00 ± 0.00 | 0.0 | 51.71 |
| no-prior | 0.42 ± 0.51 | 256.6 | −40.06 |

The complete per-run values, including unrounded metrics, are in the JSON. Reproduce with `npm run benchmark`. If the controller or environment changes, regenerate this note before treating it as a description of the new code.

## What follows from these observations

- The designed steering prior supports the default navigation. Removing it strongly degrades returns in this run set.
- Disabling the left antenna changes the sensor vector and lowers food returns after intervention.
- The plastic and frozen-readout conditions have the same return count. The frozen condition has slightly higher mean shaped reward. This release does not demonstrate a navigation benefit from online learning.
- Food relocation, memory erasure, and the selected recurrent-unit intervention do not change the final return count in this easy geometry. Their effect may appear in trajectories or other metrics; the return-count outcome itself is unchanged.

## What remains untested

There are no held-out layouts, biological comparisons, longer training studies, systematically varied odour fields, independently randomised obstacles, or training/evaluation splits. A low-variance count over these seeds is not evidence of robustness outside this arena. The model uses exact navigation vectors and privileged progress rewards.

The memory intervention is composite. The neural-unit intervention is restricted to units 0–7, while direct sensory features and the prior remain active. More targeted controls are needed before making claims about memory or recurrence.

The market fixture belongs to a separate task. Its results are not used to claim success in the ant experiment, and no cross-task transfer result is reported.
