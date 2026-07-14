# dnix.io

The dnix landing page: overflow engineering for agencies.

A single self-contained `index.html` — a real interactive terminal (type `help`,
`whoami`, `projects`, `hire`, `contact`). No build step, no dependencies, no
framework. Just open it.

## Live

https://dnix.io

## Deploy

Static single file on Cloudflare Pages:

```bash
npx wrangler pages deploy . --project-name dnix
```

## Edit

Everything is in `index.html`. The content lives in the `DATA` object near the
top of the `<script>` block — brand, stack, projects, and contact. Drop new
public repos into `DATA.projects`.
