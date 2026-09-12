# Controller specification

Let `x` be the 12-channel input and `h` the 32-dimensional recurrent state.

```text
h_next = 0.65 * h + 0.35 * tanh(W_in * x + W_rec * h)
features = concatenate(h_next, x, 1)  # 45 values
Q(action) = W_out[action] · features + steering_prior(action, x)
```

`W_in` is dense and seeded in [−0.65, 0.65]. Each recurrent edge exists with probability 0.22, with a weight in [−0.19, 0.19]. These are random synthetic matrices, not measured synaptic weights. `W_out` starts at zero. Input and recurrent weights remain fixed.

With recurrence disabled, both prior-state terms are zero; the core still produces a scaled feed-forward response. The intervention called a lesion clamps units 0–7 to exactly zero after each state projection. It does not remove the direct input-to-readout features.

## Designed navigation scaffold

The prior combines odour imbalance, obstacle proximity, the remembered food bearing, and the nest bearing into a desired turn. Returning ants use the nest bearing. Each action receives a negative squared-distance score from that desired turn. Exact coefficients are in `NeuralController.prior()`.

This prior is a hand-designed navigation mechanism. It is intentionally kept visible and can be removed with the `no-prior` protocol. It accounts for much of the observed navigation in the release benchmark.

## Action and update

The five motor turns are −0.43, −0.13, 0, +0.13 and +0.43 radians per step. At the default exploration rate of 0.045, the controller sometimes chooses a uniform random action; otherwise it picks the first maximum Q value. A straight action is not a stop action.

After moving and computing the reward, the controller projects the next input without mutating its current recurrent state and calculates a temporal-difference error:

```text
delta = clip(reward + 0.92 * max(Q_next) - Q_selected, -2, 2)
W_out[selected] += 0.002 * delta * features / (1 + features · features)
```

At a food pickup or nest return, the continuation term is zero. Those events are treated as terminal transitions for the learning update, even though the simulation continues and recurrent state is retained. Readout weights are clipped to [−0.35, 0.35].

Only the selected action row is updated. This is a small semi-gradient Q-learning experiment with fixed recurrent features, not backpropagation through time or a trained whole-brain model. No convergence guarantee is claimed.

`weightNorm` measures the L2 norm of the learned readout. A nonzero norm proves that the update ran, not that learning improved navigation. Test behaviour against frozen and no-prior controls.

The market adapter creates a fresh controller, disables the navigation prior, and changes the learning rate and exploration probability. It does not transfer the learned ant weights.
