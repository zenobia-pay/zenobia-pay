# Kodwa Pay

## Overview

Open source payments! Like pix or UPI or wechat, for the Europe and Africa.
Kodwa Pay is an open-source payment platform that enables merchants to accept payments through bank transfers, eliminating traditional credit card processing fees.

## Architecture

This is a monorepo containing all the web apps used in Zenobia Pay. For the core payment service, see the core repo. For the ios app, see the ios repo.

### Apps

#### Core Applications

- **[Admin Console](./apps/admin-console/)** - Administrative "God mode" interface for viewing all merchants and transactions
- **[Dashboard](./apps/dashboard/)** - Merchant SPA for transaction management, manual orders, and platform integrations
- **[Landing Page](./apps/landing-page/)** - Public website with marketing content, blog, and CDN for integration scripts

#### Services

- **[Transfer Status](./apps/transfer-status/)** - Real-time WebSocket service for payment status tracking
- **[Verified](./apps/verified/)** - Verification service for transaction authenticity

#### Examples & Demos

- **[Merchant Solid](./apps/merchant-solid/)** - Sample e-commerce site demonstrating Kodwa Pay integration

### Packages

#### Public NPM Packages

- **[@zenobia/client](./packages/client/)** - Core JavaScript SDK for payment integration
- **[@zenobia/ui-solid](./packages/ui-solid/)** - Solid.js UI components including the "Pay with Kodwa" button

## Key Features

- **Bank Transfer Payments**: Direct bank-to-bank transfers without credit card fees
- **Real-time Status Updates**: WebSocket-based payment tracking
- **E-commerce Integrations**: Shopify and BigCommerce apps
- **Merchant Dashboard**: Complete payment management interface
- **QR Code Payments**: Mobile-friendly payment collection
- **Multi-environment Support**: Production and sandbox environments
- **Open Source**: Full source code available

## Tech Stack

- **Frontend**: Solid.js, Tailwind CSS
- **Backend**: Cloudflare Workers, Durable Objects
- **Database**: Cloudflare D1 (SQLite), KV storage
- **Authentication**: Auth0
- **Deployment**: Cloudflare Pages/Workers
- **Build Tools**: Vite, Wrangler, TypeScript
- **Payments**: Bank transfer infrastructure

## Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- Cloudflare account (for deployment)

### Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/teopeurt/Kodwa-pay.git
cd Kodwa-pay
```

2. **Install dependencies**

```bash
# Install all app dependencies (if using workspaces)
npm install

# Or install for specific apps
cd apps/dashboard && npm install
cd apps/admin-console && npm install
```

3. **Environment Configuration**

Each app has its own environment configuration. See individual app READMEs for specific setup instructions.

4. **Run Development Servers**

```bash
# Dashboard (merchants)
cd apps/dashboard && npm run dev

# Admin Console (internal)
cd apps/admin-console && npm run dev

# Landing Page (public)
cd apps/landing-page && npm start

# Transfer Status Service
cd apps/transfer-status && npm run dev
```

## Project Structure

```
zenobia-pay/
├── apps/
│   ├── admin-console/      # Administrative interface
│   ├── dashboard/          # Merchant dashboard
│   ├── landing-page/       # Public website & CDN
│   ├── merchant-solid/     # Example integration
│   ├── transfer-status/    # Real-time status service
│   └── verified/          # Verification service
├── packages/
│   ├── client/            # Core JavaScript SDK
│   └── ui-solid/          # Solid.js UI components
└── README.md              # This file
```

## Integration Guide

### For Merchants

#### 1. Using NPM Packages

```bash
npm install @zenobia/ui-solid
```

```jsx
import { KodwaPayButton } from "@zenobia/ui-solid";

<KodwaPayButton
  amount={100.0}
  orderId="order-123"
  merchantId="your-merchant-id"
  onSuccess={handlePaymentSuccess}
/>;
```

#### 2. Using Script Tags

```html
<script src="https://kodwapay.com/embed/latest/zenobia-pay.js"></script>
<script>
  KodwaPay.mount("#payment-button", {
    amount: 100.0,
    orderId: "order-123",
    merchantId: "your-merchant-id",
  });
</script>
```

#### 3. E-commerce Platform Apps

- Install the Kodwa Pay app from Shopify App Store
- Install the Kodwa Pay app from BigCommerce Marketplace

### For Developers

See the [Merchant Solid example app](./apps/merchant-solid/) for a complete integration reference.

## Deployment

### Production Deployments

Each app has its own deployment process:

```bash
# Dashboard
cd apps/dashboard && npm run deploy

# Admin Console
cd apps/admin-console && npm run deploy

# Landing Page
cd apps/landing-page && npm run deploy

# Transfer Status
cd apps/transfer-status && npm run deploy
```

### Package Publishing

```bash
# Client SDK
cd packages/client && npm run release

# UI Components
cd packages/ui-solid && npm run release
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Development Workflow

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

**Open source payments for everyone!** 🚀
