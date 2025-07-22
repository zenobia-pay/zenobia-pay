# Verified

A SolidStart application for verification services, deployed on Cloudflare Workers.

## Features

- Built with SolidStart
- Tailwind CSS for styling
- Cloudflare Workers deployment
- Smooth scrolling with Lenis
- Responsive navigation

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Deployment

```bash
# Deploy to Cloudflare Workers
npm run deploy

# Deploy to staging
npm run deploy:staging
```

## Project Structure

```
src/
├── components/     # Reusable components
├── routes/         # Page routes
├── app.tsx         # Main app component
├── app.css         # Global styles
└── entry-*.tsx     # Entry points
```

## Configuration

- `app.config.ts` - SolidStart configuration
- `wrangler.toml` - Cloudflare Workers configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
