# Release verification

Validation performed for version 0.1.0 with Node.js 24.19.0. The source targets Node.js 22 or later and modern browsers.

| Check | Outcome |
| --- | --- |
| Core and market test suite | 13 tests passed |
| Seed-17 navigation replay | All recorded metrics matched |
| Seed-17 relocation replay | All recorded metrics matched |
| Seed-17 antenna replay | All recorded metrics matched |
| Reference benchmark | 84 complete runs across seven conditions |
| Modular JavaScript | Source syntax checks passed |
| Standalone edition | Generated from 17 modules; embedded scripts parsed successfully |
| Local servers | Node and Python routes checked for the application and assets; hidden paths and directory listings rejected |
| Documentation | Relative Markdown targets and JSON files checked |
| Original figures | Rendered from actual model state; visually inspected |
| Browser interaction and responsive layout | Not verified in a live browser in this environment |

The browser's security policy blocked local preview URLs. No attempt was made to label generated figures as browser screenshots. The repository includes a local screenshot guide for capturing the running console on another computer.

The tests check meaningful invariants: intervention effects, deterministic replay, physical bounds, readout freezing, selected-unit clamping, paper cash accounting, delayed fills, invalid input rejection and independence of past decisions from future market data.

These checks establish software properties, not biological validity or profitable trading. See `MODEL_CARD.md` and `RESULTS.md` for the scientific scope.
