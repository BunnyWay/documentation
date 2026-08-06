# bunny.net/docs

Welcome to the [bunny.net docs](https://bunny.net/docs) repository. You'll find the source code for all product docs, API references, guides, and more.

## Products

| Product              | Description                                  | Docs                                                                       | Source                                   |
| -------------------- | -------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------- |
| **CDN**              | Accelerate and protect your content globally | [bunny.net/docs/cdn](https://bunny.net/docs/cdn)                           | [`/cdn`](/cdn)                           |
| **Stream**           | Video streaming and delivery platform        | [bunny.net/docs/stream](https://bunny.net/docs/stream)                     | [`/stream`](/stream)                     |
| **Storage**          | Global object storage                        | [bunny.net/docs/storage](https://bunny.net/docs/storage)                   | [`/storage`](/storage)                   |
| **Optimizer**        | Automatic image and web optimization         | [bunny.net/docs/optimizer](https://bunny.net/docs/optimizer)               | [`/optimizer`](/optimizer)               |
| **Magic Containers** | Deploy any app anywhere with Docker          | [bunny.net/docs/magic-containers](https://bunny.net/docs/magic-containers) | [`/magic-containers`](/magic-containers) |
| **Scripting**        | Deploy serverless code at the edge           | [bunny.net/docs/scripting](https://bunny.net/docs/scripting)               | [`/scripting`](/scripting)               |
| **Database**         | Serverless SQLite over HTTP                  | [bunny.net/docs/database](https://bunny.net/docs/database)                 | [`/database`](/database)                 |
| **Shield**           | Stay protected and online no matter what     | [bunny.net/docs/shield](https://bunny.net/docs/shield)                     | [`/shield`](/shield)                     |
| **DNS**              | Ultra-fast scriptable DNS platform           | [bunny.net/docs/dns](https://bunny.net/docs/dns)                           | [`/dns`](/dns)                           |

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
