# Scientific context

ANT-1 is an independent educational implementation. These sources motivate questions about closed sensory loops, memory, and learning; ANT-1 does not reproduce their full models or claim their experimental validation.

1. **Ardin, P., Peng, F., Mangan, M., Lagogiannis, K. & Webb, B. (2016).** Using an Insect Mushroom Body Circuit to Encode Route Memory in Complex Natural Environments. *PLOS Computational Biology*, 12(2), e1004683. [Primary paper](https://doi.org/10.1371/journal.pcbi.1004683). This work studies an insect-inspired circuit for visual route memory. ANT-1's vector memory and small rate network are different mechanisms.
2. **Sutton, R. S. & Barto, A. G. (2018).** *Reinforcement Learning: An Introduction*, second edition. [Authors' book page](https://incompleteideas.net/book/the-book-2nd.html). Background on value functions, temporal-difference learning, exploration, and the need to evaluate a learned policy.

No source assets, experimental images, measured neural data, or code from these works are included. Original ANT-1 figures are generated from this repository. The scientific names in the references do not imply collaboration or endorsement.

## Terms used in this project

**Embodied** means that actions change a simulated body's position and its next observations. **Neural** refers to a synthetic recurrent rate network. **Memory** refers to explicit software state and a stored coordinate, not a biological claim. **Learning** means an implemented update to readout weights; improved behaviour must be demonstrated separately. **Intervention** means a controlled change in a software mechanism.
