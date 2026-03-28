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

2. Create env file:

```bash
cp .env.dist .env
```

3. Fill required chain/API variables in `.env`.

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
