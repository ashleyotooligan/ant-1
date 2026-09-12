# Contributing

ANT-1 values inspectable mechanisms, reproducible changes and clear limits. Good contributions include stronger controls, explicit sensor models, new environment adapters, useful visualisations and smaller reproducible examples of failures.

For a behavioural change, include the question, seed, configuration, output JSON and comparison condition. Explain which mechanism changed and which stayed fixed. A performance claim needs an evaluation designed to test it; changing weights or an attractive trajectory is not enough.

Before opening a pull request:

```bash
npm test
npm run verify
npm run build
```

If you intentionally change the reference implementation, regenerate reference data, review all outcome differences, and update `docs/RESULTS.md`. Keep generated data and figure labels consistent with the code. Avoid adding external packages to the core unless they materially improve the research or usability.

For source-only UI changes, rebuild `ANT-1.html`. For a bug report, include browser or Node version and the smallest reproducible seed/intervention sequence. Do not put credentials or private datasets in issues.

Contributions are licensed under the repository's MIT licence. Do not copy scientific figures, datasets, or third-party code without respecting their licences and provenance.
