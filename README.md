# docs.bunny.net

Welcome to the [bunny.net docs](https://docs.bunny.net) repository. You'll find the source code for all product docs, API references, guides, and more.

## Local Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify):

```bash
npm i -g mintlify
```

Run the docs locally:

```bash
mintlify dev
```

Open `http://localhost:3000`.

## OpenAPI Specs

API references are generated from OpenAPI specs in `docs.json`. Local specs (in `/api-reference/`) deploy automatically on merge. Remote specs (Stream, Shield, Magic Containers, Database) don't trigger deploys when they change.

To rebuild after a remote spec changes:

1. [**API (recommended):**](https://www.mintlify.com/docs/api/update/trigger) `POST https://api.mintlify.com/v1/project/update/{projectId}` with auth header
2. **Manually:** Trigger from the Mintlify dashboard
3. **Wait:** It'll rebuild on the next PR merge

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md).
