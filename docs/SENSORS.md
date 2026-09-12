# Sensor specification

The observation is a vector of 12 finite numbers. The body is an idealised point with a collision margin; drawn legs and antennae are visual geometry, not articulated physics.

| Index | Channel | Definition |
| --- | --- | --- |
| 0 | Left odour | `exp(-distance / 340)` at a probe 38 units ahead and −0.55 radians from heading |
| 1 | Right odour | Same field at +0.55 radians |
| 2 | Odour gradient | `clip(18 * (right - left) / max(0.002, right + left), -1, 1)` |
| 3 | Left obstacle | Ray proximity at heading −0.65 radians |
| 4 | Forward obstacle | Ray proximity along heading |
| 5 | Right obstacle | Ray proximity at heading +0.65 radians |
| 6 | Food-memory bearing | Wrapped relative bearing to stored food coordinates, divided by π; zero before first food contact |
| 7 | Nest-vector bearing | Idealised relative bearing to the nest, divided by π |
| 8 | Carrying food | 1 while returning with food; otherwise 0 |
| 9 | Speed | Last executed movement divided by configured speed |
| 10 | Previous reward | Last step's reward clipped to [−1, 1] |
| 11 | Bias | Constant 1 |

Obstacle rays sample distances from 8 to 86 units in increments of 6. A detected obstacle or arena boundary returns `1 - sampled_distance / 92`; otherwise zero. The odour field passes through obstacles and never diffuses over time.

The left-antenna intervention zeros channels 0 and 3. Channel 2 is then recomputed from the surviving odour channel, producing a deliberately strong sensory imbalance. This is a defined manipulation of a software input, not a biologically calibrated lesion.

Food and nest bearings use exact model coordinates. ANT-1 v0.1 does not infer a map from camera input, implement visual route recognition, or model noisy path integration. The remembered food vector is written on food contact and retained after relocation until overwritten or explicitly erased.
