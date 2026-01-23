# docs.bunny.net

Welcome to the [bunny.net docs](https://docs.bunny.net) repository. You'll find the source code for all product docs, API references, guides, and more.

## Products

| Product              | Description                                  | Docs                                                                       | Source                                   |
| -------------------- | -------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------- |
| **CDN**              | Accelerate and protect your content globally | [docs.bunny.net/cdn](https://docs.bunny.net/cdn)                           | [`/cdn`](/cdn)                           |
| **Stream**           | Video streaming and delivery platform        | [docs.bunny.net/stream](https://docs.bunny.net/stream)                     | [`/stream`](/stream)                     |
| **Storage**          | Global object storage with S3 compatibility  | [docs.bunny.net/storage](https://docs.bunny.net/storage)                   | [`/storage`](/storage)                   |
| **Optimizer**        | Automatic image and web optimization         | [docs.bunny.net/optimizer](https://docs.bunny.net/optimizer)               | [`/optimizer`](/optimizer)               |
| **Magic Containers** | Deploy any app anywhere with Docker          | [docs.bunny.net/magic-containers](https://docs.bunny.net/magic-containers) | [`/magic-containers`](/magic-containers) |
| **Scripting**        | Deploy serverless code at the edge           | [docs.bunny.net/scripting](https://docs.bunny.net/scripting)               | [`/scripting`](/scripting)               |
| **Database**         | Serverless SQLite over HTTP                  | [docs.bunny.net/database](https://docs.bunny.net/database)                 | [`/database`](/database)                 |
| **Shield**           | Stay protected and online no matter what     | [docs.bunny.net/shield](https://docs.bunny.net/shield)                     | [`/shield`](/shield)                     |
| **DNS**              | Ultra-fast scriptable DNS platform           | [docs.bunny.net/dns](https://docs.bunny.net/dns)                           | [`/dns`](/dns)                           |

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
