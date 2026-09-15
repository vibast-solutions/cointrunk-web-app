# CoinTrunk Articles App

Web app for browsing and publishing CoinTrunk articles on BeeZee.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Chakra UI
- Interchain wallet tooling (`@interchain-kit/*`)

## Features

- Article feed with pagination and refresh
- Publisher profile pages
- Wallet-aware publishing flow
- BeeZee-focused chain and asset integration

## Prerequisites

- Node.js 20+
- npm

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create the env file (the template carries the full public testnet config,
   nothing to fill in):

```bash
cp .env.dist .env
```

## Development

```bash
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
npm run start
```

## Important Paths

- `src/app/page.tsx` - main feed
- `src/app/publishers/page.tsx` - publishers listing
- `src/app/publisher/[address]/page.tsx` - publisher profile
- `src/query/` - chain/data access layer
- `src/constants/` - chain/network configuration

## Production

Docker image (Next.js standalone server, no secrets baked; the build-time
`NEXT_PUBLIC_*` values come in as a BuildKit secret, see the Dockerfile):

```bash
docker build -f docker/prod/Dockerfile --secret id=build_env,src=.env.dist .
```

CI publishes to GHCR per branch, monorepo-style: push to `main-v2`
(default) builds the **mainnet** flavor (tag = commit short-SHA, deployed to
app.cointrunk.io), push to `develop` builds the **testnet** flavor
(tag = `testnet-<sha>`, deployed to testnet.cointrunk.io). Each flavor's
production env is the matching `build.env` in the private deploy repo
(`vibast-solutions/vibast-deploy`), not a file in this repo. After the push,
CI dispatches that repo's `deploy` workflow for the flavor's site and waits
for it — merging to a release branch is deploying, and a failed release shows
up as a red run here too.
