# Production image. Build from the repo root:
#
#   docker build -f docker/prod/Dockerfile --secret id=build_env,src=.env.dist .
#
# Build-time env: Next inlines the NEXT_PUBLIC_* values of `.env` into the
# client bundle at build time. That file is .dockerignore'd and comes in as
# the BuildKit secret `build_env`, mounted as /app/.env for the build step
# only — never in the build context, an image layer or the build log. CI
# mounts the flavor's values from the private deploy repo
# (vibast-deploy/app.cointrunk.io/build.env on main-v2 = mainnet,
# vibast-deploy/testnet.cointrunk.io/build.env on develop = testnet); the
# command above uses the dev template (testnet) for a local build. All values
# are public by definition; no secrets are baked.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# Next's output tracing copies .env into the standalone bundle — drop that copy
# so the env file never reaches the final stage.
RUN --mount=type=secret,id=build_env,target=/app/.env,required=true \
    npm run build && rm -f .next/standalone/.env

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
