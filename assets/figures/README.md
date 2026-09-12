# Figure provenance

The PNGs and GIF in this folder are **direct-rendered experiment figures**. They are not screenshots of a web browser. Browser security prevented local app preview capture during preparation of this release, so no browser-verified screenshot is claimed.

The figures use the same `drawArena`, `drawSpecimen`, `drawNetwork`, `drawRaster` and `drawMarket` functions as the application. The figure frames, labels and annotations are assembled separately for legibility in the README. Values are computed from real executions of this repository.

| File | Source |
| --- | --- |
| `observation.png` | Simulation seed 17, step 900, default controller |
| `neural-interface.png` | Same run and step; selected actual model weights |
| `controls.png` | All 84 runs in `data/benchmarks/reference.json` |
| `market-interface.png` | Included synthetic-market comparison, policy seed 17, price seed 73 |
| `observation-loop.gif` | Seed 17, steps 680 to 1056, eight steps per frame, 48 frames at 80 ms/frame |

The raster contains continuous tanh activations. It does not depict spike counts, electrophysiology, or a measured connectome. The ant is drawn procedurally and is not a photograph. Its drawn legs do not add articulated physics to the model.

## Regenerate

Normal use and testing need no packages. Figure rendering optionally uses `@napi-rs/canvas` version 0.1.100 and the bundled DejaVu fonts:

```bash
npm install --no-save --package-lock=false @napi-rs/canvas@0.1.100
node scripts/generate-references.mjs
node scripts/benchmark.mjs --out data/benchmarks/reference.json
npm run figures
```

To create the animation frames, run `node scripts/render-figures.mjs --frames`. Frames are written to ignored `output/frames/`. Assemble them with `python scripts/make-animation.py`, which optionally requires Pillow. The GIF loops by resetting to the first recorded frame; it is not a continuous live session.

If you add real browser screenshots, use an unedited capture of the running app, record its version, seed and tick, and identify it separately from these figures. `docs/SCREENSHOT_GUIDE.md` gives a short capture sequence.
