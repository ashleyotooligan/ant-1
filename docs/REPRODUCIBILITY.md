# Reproducibility

## Minimal check

```bash
npm test
npm run replay -- --file data/runs/navigation-seed17.json
npm run replay -- --file data/runs/relocation-seed17.json
npm run replay -- --file data/runs/antenna-seed17.json
npm run verify
npm run verify:manifest
```

`npm run verify:manifest` checks `MANIFEST.sha256` against the tree. It is the
only check that notices if a shipped file was altered or dropped after the
checksums were recorded. Regenerate it deliberately with
`npm run verify:manifest -- --write` when a change to tracked files is intended.

The release has deterministic seeded dynamics and no network dependency. The reference records identify version 0.1.0. Replaying a run under a changed implementation may legitimately produce different results; do not hide that mismatch.

## Regenerate reference data

Run from the repository root:

```bash
node scripts/generate-references.mjs
node scripts/benchmark.mjs --out data/benchmarks/reference.json
npm run build
```

These commands intentionally replace the tracked reference records and standalone HTML. Review the resulting diff before committing it. Normal experiment commands write to ignored `output/` instead.

## What the record contains

`initialOptions` captures the starting seed and controller options. `interventions` records operations at exact ticks, including operations performed while paused. `events` contains meaningful transitions. `trace` samples trajectory and the selected action every ten steps. `metrics` describes the final state.

The on-screen trail keeps at most 2,500 steps and the raster keeps 140 samples at four-step intervals. These are display limits; the exported event and sampled-trace arrays continue growing during the session. Long sessions use additional memory, so export and reset between large studies.

PRNG arithmetic is deterministic. Floating-point transcendental functions can vary slightly between JavaScript engines. The replay tool compares numeric metrics with an absolute tolerance of `1e-8`; bit-for-bit image reproduction also depends on canvas and font rendering. Exact cross-engine trajectory equality is not guaranteed in edge cases near action ties.

## Figure generation

See `assets/figures/README.md`. Figures are rendered from the actual implementation, with seed and state documented. They are not manually chosen neural readings, photos, or performance claims. Browser screenshot capture was unavailable in the build environment, so this release uses clearly identified direct-rendered figures.
