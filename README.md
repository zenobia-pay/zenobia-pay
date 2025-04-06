# Solid.js Cloudflare Pages Functions Demo

This is a Solid.js application with Cloudflare Pages Functions integration. It demonstrates how to use Cloudflare Pages Functions with a Solid.js frontend.

## Features

- Solid.js frontend built with Vite and TailwindCSS
- Cloudflare Pages Functions for serverless backend functionality
- Example GET and POST API endpoints
- Frontend UI for testing the API endpoints

## Development

### Prerequisites

- Node.js (v16 or newer recommended)
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install
```

### Local Development

To run the application locally with Cloudflare Pages Functions emulation:

```bash
# Build the application
npm run build
# or
pnpm build

# Run with Cloudflare Pages local development server
npm run pages:dev
# or
pnpm pages:dev
```

This will start a local development server that emulates the Cloudflare Pages environment, including the Functions.

### Regular Development (Without Functions)

If you want to develop just the frontend without the Functions:

```bash
npm run dev
# or
pnpm dev
```

## Deployment

### Deploy to Cloudflare Pages

To deploy the application to Cloudflare Pages:

1. Ensure you have Wrangler CLI authenticated with Cloudflare

   ```bash
   npx wrangler login
   ```

2. Build and deploy
   ```bash
   npm run pages:deploy
   # or
   pnpm pages:deploy
   ```

## API Endpoints

The project includes the following API endpoints:

- `GET /api/hello` - Returns a simple JSON response with a message and timestamp
- `POST /api/submit` - Accepts JSON data and returns it along with a success message

## Project Structure

- `/src` - Frontend Solid.js application
- `/functions` - Cloudflare Pages Functions
  - `/functions/api` - API endpoints
  - `/functions/_routes.json` - Routes configuration

## License

MIT

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)

## This project was created with the [Solid CLI](https://solid-cli.netlify.app)
