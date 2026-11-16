# Super Agent OS SDKs

Needs a Solo plan or higher. MCP and skills are unaffected.

Open-source clients for the [Super Agent OS](https://superartifacts.app) REST API: publish
artifacts, read what visitors submitted, manage projects and templates, from your own code. Both
are generated from the API's OpenAPI document.

| Package | Install | Runtimes |
| --- | --- | --- |
| [`@superagentos/sdk`](https://www.npmjs.com/package/@superagentos/sdk) ([source](typescript)) | `npm install @superagentos/sdk` | Node 20.3+ (other runtimes with `fetch` may work; only Node is tested) |
| [`superagentos`](https://pypi.org/project/superagentos/) ([source](python)) | `pip install superagentos` | Python 3.10+ |

Create a key in [Settings → API keys](https://superartifacts.app/settings/api-keys) and put it in
`SUPERAGENTOS_API_KEY`.

Super Agent OS runs no model. You bring the inference: your model makes the page, you write it to
a file, and the SDK hosts the file.

```ts
import { SuperAgentOS } from '@superagentos/sdk'
const sa = new SuperAgentOS()
await sa.artifacts.publishFile('checklist.html') // the page your own model wrote
```

```python
from superagentos import SuperAgentOS
sa = SuperAgentOS()
sa.artifacts.publish_file("checklist.html")  # the page your own model wrote
```

**Server-side only.** The API refuses any request carrying an `Origin` header, which every browser
adds, and a key on a page is a leaked key.

## Docs

- [SDKs overview](https://superartifacts.app/docs/sdks)
- [TypeScript](https://superartifacts.app/docs/sdks/typescript)
- [Python](https://superartifacts.app/docs/sdks/python)
- [REST API reference](https://superartifacts.app/docs/reference/api)

## License

MIT

`SUPERAGENTOS_API_KEY` takes precedence over the legacy `SUPERARTIFACTS_API_KEY`
fallback. The API host remains `https://superartifacts.app`.

## About this repository

This repository is a mirror of the `sdks/` directory of the maintainers' private
monorepo, and every sync replaces its history. Pull requests and issues are
welcome here; an accepted change is ported to the monorepo and arrives in the
next sync. Both SDKs are generated from `openapi.json`.
