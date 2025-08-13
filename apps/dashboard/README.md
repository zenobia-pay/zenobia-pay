# Merchant Dashboard

## Overview

The Merchant Dashboard is a Solid.js SPA for merchants to manage their payments. It also hosts the backend API for e-commerce platform integrations.

## Features

### Merchant Portal

- **Transaction Management**: View and track all payment transactions
- **Manual Orders**: Create and manage manual payment orders
- **QR Code Generation**: Generate payment QR codes for in-person transactions
- **KYB Verification**: Complete Know Your Business verification process
- **Settings & Configuration**: Manage account settings and payment preferences

### E-commerce Integrations

- **BigCommerce**: Full OAuth integration with checkout processing
- **Shopify**: Payment app integration with session management
- **Manual Stores**: Support for custom POS integrations
- **Webhook Processing**: Real-time payment status updates

## Tech Stack

- **Frontend**: Solid.js with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Auth0
- **Backend**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare KV
- **API**: GraphQL with code generation
- **Build Tools**: Vite, Wrangler

## Prerequisites

- Node.js 18+
- npm or pnpm
- Cloudflare account with Workers, D1, and KV access
- Auth0 account for authentication

## Installation

```bash
npm install
```

## Development

### Quick Start

```bash
# Run both frontend and backend locally
npm run dev
```

This starts:

- Vite dev server on http://localhost:3000 (frontend)
- Wrangler dev server on http://localhost:8787 (backend API)

### Individual Commands

```bash
# Frontend only
npm run dev:vite

# Backend only
npm run dev:worker

# Build for production
npm run build

# Deploy to Cloudflare
npm run deploy
```

## Project Structure

```
dashboard/
├── src/                    # Frontend application
│   ├── components/         # Reusable UI components
│   │   ├── admin/         # Dashboard tab components
│   │   ├── Dashboard.tsx  # Main dashboard layout
│   │   └── ...
│   ├── pages/             # Application pages
│   │   ├── MerchantKYB.tsx
│   │   ├── Onboarding.tsx
│   │   └── auth/
│   ├── context/           # State management
│   │   ├── AuthContext.tsx
│   │   └── MerchantContext.tsx
│   ├── services/          # API integration
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── navigation.ts
│   └── types/             # TypeScript definitions
├── functions/             # Cloudflare Worker endpoints
│   ├── bigcommerce/       # BigCommerce integration
│   ├── shopify/           # Shopify integration
│   ├── kyb/              # KYB verification
│   └── utils/            # Shared utilities
├── migrations/           # D1 database migrations
├── utils/                # Build and dev utilities
└── public/              # Static assets
```

## Key Features

### Manual Orders System

Merchants can create manual payment orders with:

- Custom amounts and descriptions
- QR code generation for payment collection
- Real-time status tracking
- Order management (edit, delete)

### Transaction Dashboard

- Real-time transaction monitoring
- Detailed transaction history
- Export capabilities
- Search and filtering

### Platform Integrations

#### BigCommerce

- OAuth-based app installation
- Checkout integration
- Webhook processing for order updates
- Store configuration management

#### Shopify

- Embedded app support
- Payment session handling
- Customer data management
- GDPR compliance endpoints

## Database Schema

The app uses Cloudflare D1 with the following main tables:

- `bigcommerce_stores` - BigCommerce store configurations
- `shopify_stores` - Shopify store configurations
- `merchant_kyb` - KYB verification data
- `orders` - Manual order records
- `manual_stores` - Custom integration configurations

Run migrations:

```bash
# Local development
wrangler d1 migrations apply MERCHANTS_OAUTH --local

# Production
wrangler d1 migrations apply MERCHANTS_OAUTH
```

## Environment Variables

Create a `.dev.vars` file for local development:

```bash
BIGCOMMERCE_CLIENT_ID: string
BIGCOMMERCE_CLIENT_SECRET: string
MERCHANTS_OAUTH: D1Database
ACCOUNTS_DOMAIN: string
ZENOBIA_CLIENT_ID: string
ZENOBIA_CLIENT_SECRET: string
ACCOUNTS_AUDIENCE: string
API_DOMAIN: string
API_BASE_URL: string
TRANSFER_MAPPINGS: KVNamespace
SUBSCRIBE_HMAC: string
SHOPIFY_CLIENT_ID: string
SHOPIFY_CLIENT_SECRET: string
SHOPIFY_ENCRYPTION_KEY: string
SHOPIFY_PROXY_SECRET: string
SHOPIFY_CHECKOUT_SESSION_KV: KVNamespace
MERCHANT_DASHBOARD_TYPES: KVNamespace
TESTMODE_API_BASE_URL: string
SLACK_WEBHOOK_URL?: string
MANUAL_ORDERS_ENCRYPTION_KEY: string
ASSETS: Fetcher
```

## API Development

### Adding New Endpoints

1. Create a function file in `functions/`
2. Export an `onRequest` handler
3. Add authentication/validation as needed
4. Test locally with Wrangler

Example:

```typescript
export async function onRequest(context) {
  // Your endpoint logic
}
```

### GraphQL Code Generation

```bash
npm run codegen
```

This generates TypeScript types from your GraphQL schema.

## Testing

### Manual Testing

1. Use the local dev environment
2. Test with real e-commerce platform dev stores
3. Verify webhook processing

### Integration Testing

- BigCommerce: Use development stores
- Shopify: Use development/partner stores
- Manual orders: Test QR code generation and payment flow

## Deployment

### Staging

```bash
npm run build
wrangler deploy --env staging
```

### Production

```bash
npm run deploy
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check allowed origins in worker configuration
2. **Auth Failures**: Verify Auth0 configuration and JWT settings
3. **Database Issues**: Check D1 bindings in wrangler.toml
4. **Build Errors**: Clear node_modules and dist folders

### Debug Commands

```bash
# Check D1 database
wrangler d1 execute MERCHANTS_OAUTH --command "SELECT * FROM orders"

# View worker logs
wrangler tail
```
