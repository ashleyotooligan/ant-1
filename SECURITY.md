# Local execution and reporting

The standalone laboratory runs in the browser. It makes no external data requests, asks for no account, and does not persist sessions unless the user downloads an export. The modular edition reads its bundled reference files from its local server.

The server listens on `127.0.0.1` and only serves files. It does not accept writes or execute commands submitted by a browser. The optional market adapter is a paper environment with no credentials or live exchange route.

Treat a dataset you load as data. The market importer parses JSON, validates bar fields, and does not execute dataset contents. Source development and optional figure regeneration may use tools installed separately by the user.

Report a vulnerability privately to the repository owner using an available private GitHub reporting/contact channel. If none is configured, open an issue asking for a private reporting method without publishing exploit details or private data. The project has no dedicated response-time guarantee.
