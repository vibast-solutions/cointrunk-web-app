# Production image. Build from the repo root:
#
#   docker build -f docker/prod/Dockerfile --build-arg FLAVOR=mainnet .
#
#   FLAVOR = mainnet | testnet — selects .env.<FLAVOR>.dist, whose
#            NEXT_PUBLIC_* values are inlined into the client bundle at build
#            time. All of them are public by definition; no secrets are baked.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ARG FLAVOR=mainnet
RUN cp ".env.${FLAVOR}.dist" .env && npm run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
