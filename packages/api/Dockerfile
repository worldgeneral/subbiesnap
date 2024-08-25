FROM node:20-alpine AS node

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

# ==

FROM node AS base

RUN apk update && apk add --no-cache libc6-compat
RUN npm install --global pnpm
RUN pnpm add --global turbo@^2.0.14

# ==

FROM base AS setup

COPY . .

RUN turbo prune @subbiesnap/api --docker

# ==

FROM base AS installer

COPY --from=setup /app/out/json .
COPY --from=setup /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=setup /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN pnpm i

COPY --from=setup /app/out/full/ .

RUN pnpm turbo run build --filter=@subbiesnap/api

RUN pnpm i --prod

# ==

FROM node AS runner

USER node

COPY --from=installer --chown=node:node /app ./

CMD ["node", "packages/api/dist/index.js"]
