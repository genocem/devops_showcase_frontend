# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
COPY package-lock.json* ./

# Install dependencies
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Build args for Next.js public env vars (baked at build time)
# this stuff seems to be important even tho i tried to have other ways to add env variables this is what stuck
# ARG NEXT_PUBLIC_STOCK_API
# ARG NEXT_PUBLIC_CART_API
# ARG NEXT_PUBLIC_TRANSACTION_API

# ENV NEXT_PUBLIC_STOCK_API=$NEXT_PUBLIC_STOCK_API
# ENV NEXT_PUBLIC_CART_API=$NEXT_PUBLIC_CART_API
# ENV NEXT_PUBLIC_TRANSACTION_API=$NEXT_PUBLIC_TRANSACTION_API



# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
