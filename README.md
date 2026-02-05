# CoinTrunk Articles

A decentralized news application built on the [BeeZee](https://getbze.com) blockchain.

## What is CoinTrunk?

CoinTrunk is a decentralized, censorship-resistant news platform. All articles are published on-chain, making the content transparent and publicly verifiable.

### How it works

- **Publishers** are trusted individuals approved by the community through on-chain governance proposals. They can publish articles for free.
- **Paid articles** can be submitted by anyone willing to pay a fee. These are anonymous and not backed by a trusted publisher — readers should always verify the source.
- **Accepted domains** are also governance-approved. Articles can only link to domains that the community has voted to allow, ensuring a baseline of source quality.
- **Respect** is a way to support publishers. Users send BZE tokens to show appreciation — 1 BZE equals 1 Respect point. A portion goes to the publisher and a community tax percentage goes back to the BeeZee ecosystem.

### Features

- Browse the latest on-chain articles in a Twitter/X-style feed
- View publisher profiles with stats (article count, respect, join date)
- Connect a Cosmos wallet (Keplr, Leap, Cosmostation) to interact with the blockchain
- Publish articles as a trusted publisher or as an anonymous paid submission
- Pay respect to publishers using BZE tokens

## Technical Overview

### Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 |
| Animations | Framer Motion 11 |
| Icons | Lucide React |
| Wallet | cosmos-kit v2 (`@cosmos-kit/react-lite`) |
| Blockchain SDK | `@bze/bzejs` |
| Chain Registry | `chain-registry` |

### Project Structure

```
src/
  app/                        # Next.js App Router pages
    page.tsx                  # Articles feed (home)
    publishers/page.tsx       # Publishers list
    publisher/[address]/      # Publisher detail
  components/
    providers.tsx             # ChainProvider (wallet context)
    navbar.tsx                # Top navigation bar
    article-card.tsx          # Article feed item
    publisher-card.tsx        # Publisher card with stats
    wallet-button.tsx         # Wallet connect/disconnect
    wallet-modal.tsx          # Wallet selection modal
    add-article-modal.tsx     # Publish article form
    pay-respect-modal.tsx     # Pay respect form
    about-banner.tsx          # Dismissible "how it works" banner
    badges.tsx                # Respect, active, domain, count badges
    feed-pagination.tsx       # Page navigation
    article-skeleton.tsx      # Loading placeholder
  lib/
    chain-config.ts           # Network configuration (mainnet/testnet)
    types.ts                  # TypeScript interfaces
    utils.ts                  # Formatting and helper utilities
    services/
      articles.ts             # Fetch articles from chain
      publishers.ts           # Fetch publishers (with localStorage cache)
      account.ts              # Query account balance
      accepted-domains.ts     # Fetch governance-approved domains
      params.ts               # Fetch CoinTrunk module parameters
```

### Setup

```bash
# Install dependencies
npm install

# Copy and configure environment
cp .env.dist .env.local
# Set NEXT_PUBLIC_NETWORK to "mainnet" or "testnet"

# Development
npm run dev

# Production build
npm run build
npm start
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_NETWORK` | `testnet` | Target network: `mainnet` or `testnet` |

### Network Endpoints

| Network | REST | RPC |
|---------|------|-----|
| Mainnet | `https://rest.getbze.com` | `https://rpc.getbze.com` |
| Testnet | `https://testnet.getbze.com` | `https://testnet-rpc.getbze.com` |
