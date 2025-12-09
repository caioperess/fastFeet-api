# ---- Base Stage ----
FROM node:24.11.1-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# ---- Dependencies Stage ----
FROM base AS deps
COPY package.json pnpm-lock.yaml .npmrc* ./
RUN pnpm install --prod --frozen-lockfile

# ---- Build Stage ----
FROM base AS builder
COPY package.json pnpm-lock.yaml .npmrc* ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# ---- Production Stage ----
FROM base AS production
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3333

RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .
COPY --from=builder /app/src/shared/infra/database/migrations ./src/shared/infra/database/migrations

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3333

CMD ["node", "dist/server.cjs"]
