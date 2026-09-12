# Contributing

ANT-1 values inspectable mechanisms, reproducible changes and clear limits. Good contributions include stronger controls, explicit sensor models, new environment adapters, useful visualisations and smaller reproducible examples of failures.

For a behavioural change, include the question, seed, configuration, output JSON and comparison condition. Explain which mechanism changed and which stayed fixed. A performance claim needs an evaluation designed to test it; changing weights or an attractive trajectory is not enough.

Before opening a pull request:

```bash
npm test
npm run verify
npm run verify:manifest
npm run build
```

## Commands that write

Most commands here only read. These do not, and none of them needs a flag to
start writing — `npm run figures` and `npm run build` overwrite files that are
tracked in Git.

| Command | Effect | Writes |
| --- | --- | --- |
| `npm test`, `npm run verify`, `npm run verify:manifest`, `npm run replay` | read-only | nothing |
| `npm start` | serves | nothing; runs a local server on 127.0.0.1 until you stop it |
| `npm run experiment` | writes | `output/<protocol>-seed<n>.json` (ignored), or `--out <path>` wherever you point it |
| `npm run market` | writes | `output/market-comparison.json` (ignored), or `--out <path>` wherever you point it |
| `npm run benchmark` | writes | `output/benchmark.json` (ignored), or `--out <path>` wherever you point it |
| `npm run figures` | **writes tracked files** | `assets/figures/*.png`, `output/frames/` |
| `npm run build` | **writes a tracked file** | `ANT-1.html` |
| `node scripts/generate-references.mjs` | **writes tracked files** | `data/runs/*.json` (including `index.json`), `extensions/market/data/*.json` |
| `npm run verify:manifest -- --write` | **writes a tracked file** | `MANIFEST.sha256` |

Regenerating is a deliberate act: run it when you mean to, and review the diff
before committing it.

If you intentionally change the reference implementation, regenerate reference data, review all outcome differences, and update `docs/RESULTS.md`. Keep generated data and figure labels consistent with the code. Avoid adding external packages to the core unless they materially improve the research or usability.

For source-only UI changes, rebuild `ANT-1.html`. For a bug report, include browser or Node version and the smallest reproducible seed/intervention sequence. Do not put credentials or private datasets in issues.

Contributions are licensed under the repository's MIT licence. Do not copy scientific figures, datasets, or third-party code without respecting their licences and provenance.
