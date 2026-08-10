FROM node:24-slim

# Prisma on slim may require OpenSSL. Keep certs updated for engine downloads.
RUN apt-get update -y \
	&& apt-get install -y openssl ca-certificates \
	&& update-ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /team4-backend

# Some environments cannot fetch checksum files for Prisma engines; this keeps
# builds/startup resilient for local reviewer setups.
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Copy package files first for better layer caching.
COPY package*.json ./

# Skip repository hook scripts in container builds.
RUN npm ci --ignore-scripts

# Copy source.
COPY . .

RUN chmod +x /team4-backend/entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["/team4-backend/entrypoint.sh"]