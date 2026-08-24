FROM node:24-slim AS deps

RUN apt-get update -y \
	&& apt-get install -y --no-install-recommends openssl ca-certificates \
	&& update-ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /team4-backend

COPY package*.json ./
RUN npm ci --ignore-scripts

FROM deps AS build

COPY prisma ./prisma
COPY prisma.config.ts tsconfig.json ./
COPY src ./src
RUN NODE_TLS_REJECT_UNAUTHORIZED=0 \
	DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres" \
	PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 \
	npx prisma generate \
	&& npm run build \
	&& npm prune --omit=dev

FROM node:24-slim AS runtime

RUN apt-get update -y \
	&& apt-get install -y --no-install-recommends openssl ca-certificates \
	&& update-ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
	PORT=4000

WORKDIR /team4-backend

COPY --from=build --chown=node:node /team4-backend/node_modules ./node_modules
COPY --from=build --chown=node:node /team4-backend/dist ./dist
COPY --from=build --chown=node:node /team4-backend/prisma/schema.prisma ./prisma/schema.prisma
COPY --chown=node:node entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

USER node

EXPOSE 4000

ENTRYPOINT ["./entrypoint.sh"]