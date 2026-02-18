# ───────────────────── Stage 1 – Dependencies ─────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci

# ───────────────────── Stage 2 – Builder ──────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma needs the schema at generate time
RUN npx prisma generate

# Build Next.js in standalone mode
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ───────────────────── Stage 3 – CLI tooling (prisma + tsx + seed deps) ───────
FROM node:20-alpine AS tooling
WORKDIR /app
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Install ONLY the packages needed at container startup (migrate + seed)
RUN npm init -y > /dev/null 2>&1 && \
    npm install --no-save \
      prisma@$(node -e "console.log(require('/app/package.json').devDependencies.prisma || 'latest')") \
      @prisma/client@$(node -e "console.log(require('/app/package.json').dependencies['@prisma/client'] || 'latest')") \
      tsx esbuild get-tsconfig resolve-pkg-maps bcryptjs 2>&1 && \
    npx prisma generate && \
    # Smoke-test that prisma runs offline
    ./node_modules/.bin/prisma --version

# ───────────────────── Stage 4 – Production ───────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PATH="/app/node_modules/.bin:$PATH"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy CLI tooling (prisma, tsx, bcryptjs and ALL transitive deps)
COPY --from=tooling /app/node_modules ./node_modules

# Prisma schema + migrations needed at runtime
COPY --from=builder /app/prisma ./prisma

# Copy src/lib for seed imports
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/package.json ./package.json

# Entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Verify prisma CLI is fully available offline (build fails if not)
RUN ./node_modules/.bin/prisma --version

# The standalone server listens on 3000
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Run as root for migrations, then drop to nextjs via entrypoint
ENTRYPOINT ["/app/docker-entrypoint.sh"]
