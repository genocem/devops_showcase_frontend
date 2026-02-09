# DevOps Showcase - Frontend

A Next.js application for testing microservices (Stock, Cart, Transaction).

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes (server-side proxies)
│   │   │   ├── cart/           # Cart service proxy routes
│   │   │   ├── stock/          # Stock service proxy routes
│   │   │   └── transaction/    # Transaction service proxy routes
│   │   ├── cart/               # Cart page
│   │   ├── shop/               # Shop page
│   │   ├── stock/              # Stock management page
│   │   ├── transactions/       # Transactions page
│   │   ├── layout.tsx          # Root layout with navigation
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── MessageDisplay.tsx
│   │   ├── Navigation.tsx
│   │   ├── ProductCard.tsx
│   │   ├── StatusBadge.tsx
│   │   └── index.ts            # Component exports
│   └── lib/
│       ├── api.ts              # Server-side API client (for API routes only)
│       └── client-api.ts       # Client-side API client (for React components)
├── public/                     # Static assets
├── .env.local                  # Environment variables (server-side only)
├── next.config.ts              # Next.js configuration
└── package.json
```

## Architecture

### Environment Variables

Server-side environment variables in `.env.local`:

```env
STOCK_SERVICE_URL=http://stock_service:5000/api/stocks
CART_SERVICE_URL=http://cart_service:5000/api/carts
TRANSACTION_SERVICE_URL=http://transaction_service:5000/api/transactions
```

**Important:** These variables are NOT prefixed with `NEXT_PUBLIC_` to ensure they are only available server-side and never exposed to the client browser.

### API Architecture

1. **Client Components** (`'use client'`) call `/api/*` routes using `lib/client-api.ts`
2. **API Routes** (`app/api/*`) receive requests and use `lib/api.ts` to call backend services
3. **lib/api.ts** reads `process.env` at runtime to get internal container URLs

This pattern ensures:
- Internal container URLs (like `http://stock_service:5000`) are never exposed to the browser
- Environment variables are read at runtime, not build time
- Backend service calls happen server-side with proper error handling

### Flow Example

```
Browser → /api/stock (API Route) → lib/api.ts → http://stock_service:5000/api/stocks
```

## Development

```bash
npm install
npm run dev
```

## Docker

The frontend runs in standalone mode for optimized Docker builds:

```bash
docker build -t frontend .
docker run -p 3000:3000 frontend
```

## Pages

- **Home** (`/`) - Overview and test flow instructions
- **Stock Admin** (`/stock`) - Create, update, delete inventory
- **Shop** (`/shop`) - Browse products and add to cart
- **Cart** (`/cart`) - View cart, modify quantities, checkout
- **Transactions** (`/transactions`) - View and update transaction status
