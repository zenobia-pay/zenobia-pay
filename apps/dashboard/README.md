# Zenobia Pay Dashboard

Welcome to the Zenobia Pay Dashboard codebase! This is a Cloudflare Worker application that serves as both a merchant dashboard web UI and the backend API for our POS integrations.

## What This Does

This app handles:

- **Merchant Dashboard**: Web interface where merchants manage their Zenobia Pay account, view transactions, and configure integrations
- **BigCommerce Integration**: OAuth flow, checkout processing, and webhook handling for BigCommerce stores
- **Shopify Integration**: Payment app integration, session management, and webhook processing for Shopify stores
- **Hosted Checkout**: Backend logic for processing payments from various POS platforms

## Project Structure

```
apps/dashboard/
├── src/                    # Frontend SolidJS application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Main application pages
│   ├── context/           # React-like context providers
│   ├── services/          # API service layer
│   └── types/             # TypeScript type definitions
├── functions/             # Cloudflare Worker API functions
│   ├── bigcommerce/       # BigCommerce integration endpoints
│   ├── shopify/           # Shopify integration endpoints
│   ├── kyb/               # Know Your Business verification
│   └── utils/             # Shared utility functions
├── migrations/            # D1 database migrations
└── dist/                  # Built frontend assets
```

## Key Concepts

### Frontend (SolidJS)

- **SolidJS**: Modern reactive framework (similar to React but with better performance)
- **Tailwind CSS**: Utility-first CSS framework for styling
- **DaisyUI**: Component library built on top of Tailwind
- **Auth0**: Authentication provider for merchant login

### Backend (Cloudflare Workers)

- **Functions**: Serverless API endpoints that handle specific routes
- **D1 Database**: SQLite database for storing merchant and store data
- **KV Storage**: Key-value storage for session management and temporary data
- **JWT Verification**: Secure token validation for API requests

### Integration Patterns

- **OAuth Flow**: Standard OAuth 2.0 for connecting to BigCommerce/Shopify
- **Webhook Handling**: Real-time updates from payment processing
- **Session Management**: Temporary storage for checkout sessions
- **Order Synchronization**: Keeping POS orders in sync with payment status

## Getting Started

### Prerequisites

- Node.js 18+
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account with D1 and KV access

### Local Development

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .dev.vars.example .dev.vars
   # Edit .dev.vars with your local development values
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

   This starts both the Vite dev server (frontend) and Wrangler dev server (backend) concurrently.

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8787

### Environment Variables

You'll need these in your `.dev.vars` file:

```bash
# Auth0 (for merchant authentication)
ACCOUNTS_DOMAIN=https://accounts.zenobiapay.com
ACCOUNTS_AUDIENCE=https://dashboard.zenobiapay.com
VITE_AUTH0_DOMAIN=accounts.zenobiapay.com
VITE_AUTH0_CLIENT_ID=your_auth0_client_id

# API endpoints
API_BASE_URL=https://api.zenobiapay.com
TESTMODE_API_BASE_URL=https://test-api.zenobiapay.com

# BigCommerce app credentials
BIGCOMMERCE_CLIENT_ID=your_bigcommerce_client_id
BIGCOMMERCE_CLIENT_SECRET=your_bigcommerce_client_secret

# Shopify app credentials
SHOPIFY_CLIENT_ID=your_shopify_client_id
SHOPIFY_CLIENT_SECRET=your_shopify_client_secret
SHOPIFY_ENCRYPTION_KEY=your_encryption_key
SHOPIFY_PROXY_SECRET=your_proxy_secret

# Cloudflare bindings (these are configured in wrangler.toml)
# MERCHANTS_OAUTH, TRANSFER_MAPPINGS, SHOPIFY_CHECKOUT_SESSION_KV
```

## Development Workflow

### Frontend Development

- **Components**: Located in `src/components/` - reusable UI pieces
- **Pages**: Located in `src/pages/` - main application views
- **State Management**: Uses SolidJS signals and context providers
- **Styling**: Tailwind CSS with DaisyUI components

### Backend Development

- **API Functions**: Located in `functions/` - each file handles a specific route
- **Database**: D1 SQLite database with migrations in `migrations/`
- **Storage**: KV namespaces for temporary data and sessions

### Key Files to Understand

#### Frontend

- `src/worker.ts` - Main Cloudflare Worker entry point
- `src/routes.ts` - Application routing configuration
- `src/components/Dashboard.tsx` - Main dashboard layout
- `src/components/admin/` - Dashboard tab components

#### Backend

- `functions/bigcommerce/oauth.ts` - BigCommerce OAuth callback
- `functions/bigcommerce/load.ts` - BigCommerce app configuration UI
- `functions/shopify/index.ts` - Shopify OAuth initiation
- `functions/shopify/checkout.ts` - Shopify payment session handling

## Database Schema

### Main Tables

- `bigcommerce_stores` - BigCommerce store configurations and OAuth tokens
- `shopify_stores` - Shopify store configurations and encrypted access tokens
- Additional tables for merchant data and KYB information

### Migrations

Run database migrations with:

```bash
wrangler d1 migrations apply MERCHANTS_OAUTH --local
```

## Testing Integrations

### BigCommerce Testing

1. Install the Zenobia app in a BigCommerce development store
2. Complete the OAuth flow
3. Configure Zenobia credentials in the app load interface
4. Test checkout integration

### Shopify Testing

1. Install the Zenobia payment app in a Shopify development store
2. Complete the OAuth flow
3. Test payment session creation and processing

## Common Development Tasks

### Adding a New API Endpoint

1. Create a new function file in `functions/`
2. Export an `onRequest` function
3. Add the route pattern to `src/worker.ts`
4. Test locally with `npm run dev`

### Modifying the Frontend

1. Edit components in `src/components/`
2. Update pages in `src/pages/`
3. Add new routes in `src/routes.ts`
4. Hot reload should work automatically

### Database Changes

1. Create a new migration file in `migrations/`
2. Run migrations locally: `wrangler d1 migrations apply MERCHANTS_OAUTH --local`
3. Deploy migrations: `wrangler d1 migrations apply MERCHANTS_OAUTH`

## Deployment

### Staging

```bash
npm run build
wrangler deploy --env staging
```

### Production

```bash
npm run build
wrangler deploy
```

## Troubleshooting

### Common Issues

- **CORS errors**: Check origin validation in API functions
- **JWT verification failures**: Verify Auth0 configuration
- **Database connection issues**: Check D1 binding configuration
- **Webhook failures**: Verify HMAC signatures and payload validation

### Debugging

- Check Cloudflare Workers logs in the dashboard
- Use `console.log()` in functions for debugging
- Monitor network requests in browser dev tools
- Check D1 database directly with `wrangler d1 execute`

## Code Style

- **TypeScript**: Strict mode enabled, prefer explicit types
- **SolidJS**: Use signals for reactive state, avoid unnecessary re-renders
- **Functions**: Keep functions small and focused, use proper error handling
- **Security**: Always validate inputs, use JWT/HMAC verification

## Getting Help

- Check the existing code for patterns and examples
- Review the Cloudflare Workers documentation
- Ask the team for guidance on integration-specific questions
- Use the development Slack channel for quick questions

Welcome to the team! 🚀
