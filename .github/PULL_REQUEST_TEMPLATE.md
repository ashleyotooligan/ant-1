## What changed

<!-- The mechanism you changed, and the mechanisms you deliberately left fixed. -->

## Why

## How it was checked

```bash
npm test
npm run verify
npm run verify:manifest
npm run replay -- --file data/runs/navigation-seed17.json
```

- [ ] `npm test` passes
- [ ] `npm run verify` passes
- [ ] `npm run verify:manifest` passes (regenerated with `-- --write` if the change was intended)
- [ ] Recorded runs still replay, or the mismatch is explained below

## Behavioural change

<!-- Required for anything that changes simulation or controller behaviour.
     A trajectory that looks better is not evidence. -->

- Question:
- Seed and configuration:
- Comparison condition:
- Output JSON:

## Regenerated artefacts

`npm run figures`, `npm run build` and `scripts/generate-references.mjs` overwrite
**tracked** files. If you ran any of them, say so and review the diff.

- [ ] `ANT-1.html` rebuilt (source-only UI changes require this)
- [ ] `docs/RESULTS.md` updated if reference data changed
