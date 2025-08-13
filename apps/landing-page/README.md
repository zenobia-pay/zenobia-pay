# Landing Page

## Overview

Solid start landing page for Zenobia Pay with Blog. Also serves as our CDN.

## Features

- **Marketing Pages**: Homepage with product information and features
- **Blog System**: MDX-powered blog with articles about payments and security
- **Legal Pages**: Terms of service, privacy policy, and debit authorization
- **About & Careers**: Company information and job listings
- **Contact Form**: User inquiries and support requests
- **Embedded Payment Scripts**: Hosts the Zenobia Pay button integration scripts

## Tech Stack

- **Framework**: SolidStart (Static Site Generation)
- **Styling**: Tailwind CSS
- **Content**: MDX for blog posts and legal content
- **Deployment**: Cloudflare Pages
- **Build Tool**: Vinxi
- **CDN**: Cloudflare for static asset delivery

## Prerequisites

- Node.js 18+
- npm or pnpm
- Cloudflare account (for deployment)

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run start
```

The site will be available at http://localhost:3000

## Building

Build for production:

```bash
npm run build
```

## Deployment

### Production

```bash
npm run deploy
```

### Beta Environment

```bash
npm run deploy:beta
```

## Project Structure

```
landing-page/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Nav.tsx        # Navigation header
│   │   ├── Footer.tsx     # Site footer
│   │   ├── SectionCard.tsx
│   │   └── SmoothScroll.tsx
│   ├── content/           # MDX content files
│   │   ├── blog/         # Blog articles
│   │   │   ├── chargebacks-fraud.mdx
│   │   │   ├── counterfeit-jewelry.mdx
│   │   │   └── security-overview.mdx
│   │   └── legal/        # Legal documents
│   │       ├── terms.mdx
│   │       ├── privacy.mdx
│   │       └── debit-auth.mdx
│   ├── routes/           # Application routes
│   │   ├── index.tsx     # Homepage
│   │   ├── about.tsx
│   │   ├── careers.tsx
│   │   ├── contact.tsx
│   │   ├── blog/
│   │   │   ├── index.tsx
│   │   │   └── [slug].tsx
│   │   └── sitemap.xml.tsx
│   ├── lib/             # Utilities
│   │   └── mdx.ts       # MDX processing
│   └── fonts/           # Custom Ronzino font files
├── public/              # Static assets
│   ├── embed/          # Zenobia Pay integration scripts
│   │   └── latest/
│   │       ├── zenobia-pay.js
│   │       └── zenobia-pay-modal.js
│   ├── fonts/          # Web fonts
│   └── ...             # Favicons, videos, images
└── app.config.ts       # App configuration
```

## Content Management

### Adding Blog Posts

1. Create a new `.mdx` file in `src/content/blog/`
2. Add frontmatter metadata:

```mdx
---
title: "Your Article Title"
date: "2024-01-15"
excerpt: "Brief description"
author: "Author Name"
---

Your content here...
```

3. The post will be automatically available at `/blog/your-filename`

### Updating Legal Pages

Edit the MDX files in `src/content/legal/`:

- `terms.mdx` - Terms of Service
- `privacy.mdx` - Privacy Policy
- `debit-auth.mdx` - Debit Authorization

## Hosting Integration Scripts

The landing page hosts the Zenobia Pay button scripts that merchants embed on their sites:

```html
<!-- Merchants add this to their sites -->
<script src="https://zenobiapay.com/embed/latest/zenobia-pay.js"></script>
```
