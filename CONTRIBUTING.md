# Contributing to monoblogger

## Setup

```bash
git clone https://github.com/Michimono/monoblogger.git
cd monoblogger
npm install
```

Run `npm install` only at the repo root, npm workspaces links the local `@monoblogger/*` packages together automatically.

## Developing

Test changes to `core` or the starter template through the starter's build:

```bash
npm run build -w packages/starter
```

Output lands in `packages/starter/dist/index.xml` ready to be imported to blogger's theme editor.

Test the CLI by scaffolding into a throwaway directory outside the repo:

```bash
node packages/cli/bin/monoblogger.mjs init ../test-blog
```

Note: `npm install` inside a scaffolded project pulls `@monoblogger/core` from the public registry, not your local copy so test pipeline changes through `packages/starter`.

## Adding dependencies

Add them to the workspace whose code imports them, from the repo root:

```bash
npm install some-package -w packages/core
```

Commit both the workspace `package.json` and the root `package-lock.json`.

## Before opening a PR

- Don't commit scaffolded test projects or `dist/` output.

