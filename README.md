# monoblogger

A framework for building custom Blogger (Blogspot) templates.

## Getting started

```bash
npm create monoblogger my-blog
# or equivalently
npx @monoblogger/cli init my-blog

cd my-blog
npm install
npm run build
```

The build outputs `dist/index.xml`, ready to upload as a custom Blogger template.

## Packages

| Package | Purpose |
| --- | --- |
| `@monoblogger/core` | Build pipeline and built-in plugins |
| `@monoblogger/cli` | Command-line tool (`monoblogger init <name>`) |
| `@monoblogger/starter` | Template copied into newly scaffolded projects |
| `create-monoblogger` | Thin wrapper enabling `npm create monoblogger` |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to set up the monorepo and develop locally.
