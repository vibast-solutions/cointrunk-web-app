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

2. Create env file (pick a flavor — the dist files carry the full public
   config, nothing to fill in):

```bash
cp .env.mainnet.dist .env   # or .env.testnet.dist
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

Docker image (Next.js standalone server, no secrets baked):

```bash
docker build -f docker/prod/Dockerfile --build-arg FLAVOR=mainnet .
```

CI publishes to GHCR per branch, monorepo-style: push to `main-v2`
(default) builds the **mainnet** flavor (tag = commit short-SHA, deployed to
app.cointrunk.io), push to `develop` builds the **testnet** flavor
(tag = `testnet-<sha>`, deployed to testnet.cointrunk.io). The production
server auto-releases each stack from its branch.
