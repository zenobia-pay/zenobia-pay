# Admin Console

## Overview

The Admin Console is the "God mode" administrative interface for Zenobia Pay.

## Features

- **Merchant Management**: View and manage all registered merchants
- **Transaction Overview**: Monitor all platform transactions in real-time
- **Transfer Management**: View, edit, and manage payment transfers
- **Dispute Resolution**: Mark transfers as disputed and manage resolution
- **Environment Switching**: Toggle between production and test environments

## Tech Stack

- **Framework**: SolidStart (Solid.js meta-framework)
- **Styling**: Tailwind CSS v4
- **Authentication**: Auth0
- **Deployment**: Cloudflare Workers
- **Runtime**: Node.js 22+

## Prerequisites

- Node.js >= 22
- npm or pnpm
- Cloudflare Workers account (for deployment)
- Auth0 tenant configured

## Installation

```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

This starts the Vinxi development server with hot module replacement.

## Building

Build for production:

```bash
npm run build
```

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

For local testing with Wrangler:

```bash
npm run dev:worker
```

## Project Structure

```
admin-console/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Nav.tsx
│   │   ├── TransferDetails.tsx
│   │   ├── MerchantsList.tsx
│   │   └── ...
│   ├── context/         # Context providers
│   │   ├── AuthContext.tsx
│   │   └── EnvironmentContext.tsx
│   ├── routes/          # Application routes
│   │   ├── index.tsx
│   │   ├── merchant.tsx
│   │   ├── transfer.tsx
│   │   └── login.tsx
│   ├── services/        # API and auth services
│   │   ├── api.ts
│   │   └── auth.ts
│   └── config/          # Configuration files
│       └── auth0.ts
├── public/              # Static assets
├── wrangler.toml        # Cloudflare Workers config
└── app.config.ts        # App configuration
```
