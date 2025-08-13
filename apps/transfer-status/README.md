# Transfer Status Service

## Overview

The Transfer Status Service a websocket service for clients to monitor transaction status without refreshing. This is important for QR payments, which get scanned by a separate mobile device from the web page with the QR.

Note that transfer statuses are guarded behind a signature. When you call /create-transfer-request in the Core API you receive a signature that you can use to subscribe from the client.

## Purpose

This service acts as a centralized status tracking system that:

- Maintains real-time transfer status across the Zenobia Pay platform
- Provides WebSocket connections for live status updates

## Features

- **Real-time Updates**: WebSocket connections for instant status changes
- **Durable Objects**: Reliable state management using Cloudflare's Durable Objects
- **Status Persistence**: KV storage for transfer history
- **Dashboard Interface**: Web interface for monitoring transfers
- **HMAC Authentication**: Secure updates from authorized services
- **Multi-client Support**: Multiple clients can watch the same transfer

## Tech Stack

- **Runtime**: Cloudflare Workers with Durable Objects
- **Storage**: Cloudflare KV for persistence
- **WebSockets**: Real-time bidirectional communication
- **Frontend**: Vanilla JavaScript with Skeleton CSS
- **Authentication**: HMAC signature verification
- **Build Tools**: Wrangler, ESBuild, TypeScript

## Prerequisites

- Node.js 18+
- Cloudflare account with Workers and Durable Objects access
- Wrangler CLI installed (`npm install -g wrangler`)

## Installation

```bash
npm install
```

## Development

Start the local development server:

```bash
npm run dev
```

This starts a local Wrangler server that simulates the Cloudflare Workers environment.

## Building

Type check the code:

```bash
npm run check
```

Generate TypeScript types from Wrangler config:

```bash
npm run types
```

## Deployment

### Production

Deploy to production (auto-deploys from master branch):

```bash
npm run deploy
```

### Beta Environment

Deploy to beta environment:

```bash
wrangler deploy --env beta
```

### Secrets Management

Set secrets for an environment:

```bash
wrangler secret put MY_SECRET --env production
wrangler secret put MY_SECRET --env beta
```

Required secrets:

- `HMAC_SECRET`: Shared secret for authenticating status updates

## Project Structure

```
transfer-status/
├── src/
│   ├── server/           # Cloudflare Worker backend
│   │   ├── index.ts     # Main worker and Durable Object
│   │   └── tsconfig.json
│   ├── client/          # Frontend code (if any)
│   │   └── tsconfig.json
│   └── shared.ts        # Shared types and interfaces
├── public/              # Static assets
│   ├── dashboard.html   # Status dashboard UI
│   ├── styles.css      # Custom styles
│   └── css/            # Skeleton CSS framework
├── wrangler.json       # Cloudflare Workers configuration
└── package.json
```

## API Endpoints

### WebSocket Connection

```
wss://transfer-status.zenobiapay.com/ws/{transferId}
```

Connect to receive real-time updates for a specific transfer.

### HTTP Endpoints

#### Get Transfer Status

```http
GET /transfer/{transferId}
```

Returns the current status of a transfer.

#### Update Transfer Status

```http
POST /update
Headers:
  X-Signature: {HMAC signature}
Body: {
  "transferId": "transfer-123",
  "status": "completed",
  "message": "Payment successful"
}
```

Updates the status of a transfer (requires HMAC authentication).

#### List Recent Transfers

```http
GET /recent
```

Returns a list of recently updated transfers.

#### Dashboard

```http
GET /dashboard
```

Serves the web dashboard for monitoring transfers.

## Transfer Status Flow

1. **Transfer Created**: Initial status set to "pending"
2. **WebSocket Clients Connect**: Clients connect to watch status
3. **Status Updates**: Backend services send authenticated updates
4. **Real-time Broadcast**: All connected clients receive updates instantly
5. **Persistence**: Status saved to KV for history

## Status Types

```typescript
interface TransferStatus {
  id: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  message?: string;
  amount?: number;
  merchantId?: string;
  customerId?: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
```

## WebSocket Protocol

### Client Messages

```javascript
// Subscribe to transfer updates
ws.send(
  JSON.stringify({
    type: "subscribe",
    transferId: "transfer-123",
  })
);

// Ping to keep connection alive
ws.send(
  JSON.stringify({
    type: "ping",
  })
);
```

### Server Messages

```javascript
// Status update
{
  "type": "status",
  "transfer": {
    "id": "transfer-123",
    "status": "completed",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}

// Error message
{
  "type": "error",
  "message": "Transfer not found"
}

// Pong response
{
  "type": "pong"
}
```

## HMAC Authentication

Status updates require HMAC signatures for security:

```javascript
const crypto = require("crypto");

const payload = JSON.stringify({
  transferId: "transfer-123",
  status: "completed",
});

const signature = crypto
  .createHmac("sha256", HMAC_SECRET)
  .update(payload)
  .digest("hex");

// Send with X-Signature header
```
