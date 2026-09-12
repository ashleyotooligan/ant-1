# Methods and assumptions

## Environment and time

The arena is 960 × 540 model units. Bounds have a 25-unit inset and the ant has a 9-unit collision margin. Three circular obstacles are fixed. The initial nest centre is (154, 300) and food centre is (781, 159). Relocation moves food to (786, 422), toggling between the two locations on repeated interventions.

The body starts at (170, 300) with a seeded heading drawn uniformly between −0.8 and 0.1 radians. The standard simulation step is 0.1 s and nominal movement is 3.1 units per step. Speed is reduced by forward obstacle proximity. Length units are abstract; they are not millimetres or measured ant body lengths.

There is one ant and one renewable food source. Carrying food changes the target to the nest. Pickup and delivery do not reset the body or scene. Obstacles block movement but do not obstruct odour.

## Step order

1. Read sensory channels from the current body and environment.
2. Advance recurrent state and choose an action.
3. Turn, calculate movement, and reject a blocked move.
4. Calculate progress towards the pre-transition target.
5. Check food contact or delivery, update carrying state and memory, and record events.
6. Update the readout using the next observation.
7. Record path, activity, and sampled trace data.

An intervention recorded at tick 1,000 occurs before the next step. Each protocol uses the same ordering in the UI and CLI.

## Reward

```text
reward = -0.003
       + 0.006 * (distance_before - distance_after)
       - 0.16 if collision
       + 1.2 if food pickup
       + 2.0 if nest delivery
```

The distance term uses the simulator's true target position. This is privileged reward shaping. It simplifies the learning problem and is not a model of an ant's access to ground-truth coordinates or dopamine physiology.

## Memory

Three separate mechanisms contribute to state: recurrent activity, learned action-value weights, and an explicit stored food coordinate. The memory-erasure protocol clears all three together. It therefore cannot identify the causal contribution of one memory mechanism by itself. The nest vector remains available.

## Reporting

Every benchmark condition reports all 12 seeds, including poor outcomes. Returns, collision counts, total shaped reward, path length, first-contact time and controller diagnostics are available in the raw JSON. Means and sample standard deviations are descriptive statistics. No confidence intervals, p-values, or claims of generalisation are supplied.

Animation is an observation layer. Rendered antennae and legs are not individually simulated joints. Activity graphics show continuous rate-model values, not spikes, recordings, or real neuron firing rates.
