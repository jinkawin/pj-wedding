# Build arguments — update versions in one place
ARG NODE_VERSION=26.7.0

FROM node:${NODE_VERSION}-alpine

# Re-declare ARGs after FROM (they reset after each build stage)
ARG NODE_VERSION=26.7.0
ARG YARN_VERSION=4.18.0
ARG CROSS_SPAWN_VERSION=7.0.5
ARG GLOB_VERSION=11.1.0
ARG TAR_VERSION=7.5.19
ARG DIFF_VERSION=8.0.3
ARG IP_ADDRESS_VERSION=10.3.1
ARG BRACE_EXPANSION_VERSION=5.0.9
ARG TINYGLOBBY_VERSION=0.2.16

LABEL node_version="node:${NODE_VERSION}-alpine"

WORKDIR /app
COPY ./.yarn ./.yarn

# Configure Yarn
RUN npm install -g @yarnpkg/cli-dist@${YARN_VERSION} --force && \
    yarn config set -H enableStrictSsl false

# Patch vulnerable transitive dependencies inside npm's own node_modules.
# npm bundles older versions of cross-spawn, glob, tar, and diff that have
# known CVEs.  The steps below:
#   1. Install the patched versions globally
#   2. Overwrite npm's bundled copies with the safe versions
#   3. Update npm's package.json to reflect the new dependency versions
RUN npm cache clean --force && \
    npm install -g cross-spawn@${CROSS_SPAWN_VERSION} --force && \
    npm install -g glob@${GLOB_VERSION} --force && \
    npm install -g tar@${TAR_VERSION} --force && \
    npm install -g diff@${DIFF_VERSION} --force && \
    npm install -g ip-address@${IP_ADDRESS_VERSION} --force && \
    npm install -g brace-expansion@${BRACE_EXPANSION_VERSION} --force && \
    npm install -g tinyglobby@${TINYGLOBBY_VERSION} --force && \
    sed -i "s/\"glob\": \"\\\\^10.4.5\"/\"glob\": \"${GLOB_VERSION}\"/g" /usr/local/lib/node_modules/npm/package.json && \
    npm install -g npm@latest --force && \
    rm -rf /usr/local/lib/node_modules/npm/node_modules/tar && \
    rm -rf /usr/local/lib/node_modules/npm/node_modules/diff && \
    rm -rf /usr/local/lib/node_modules/npm/node_modules/ip-address && \
    rm -rf /usr/local/lib/node_modules/npm/node_modules/brace-expansion && \
    rm -rf /usr/local/lib/node_modules/npm/node_modules/tinyglobby && \
    cp -r /usr/local/lib/node_modules/tar /usr/local/lib/node_modules/npm/node_modules/tar && \
    cp -r /usr/local/lib/node_modules/diff /usr/local/lib/node_modules/npm/node_modules/diff && \
    cp -r /usr/local/lib/node_modules/ip-address /usr/local/lib/node_modules/npm/node_modules/ip-address && \
    cp -r /usr/local/lib/node_modules/brace-expansion /usr/local/lib/node_modules/npm/node_modules/brace-expansion && \
    cp -r /usr/local/lib/node_modules/tinyglobby /usr/local/lib/node_modules/npm/node_modules/tinyglobby && \
    sed -i "s/\"tar\": \"[^\"]*\"/\"tar\": \"${TAR_VERSION}\"/g" /usr/local/lib/node_modules/npm/package.json && \
    sed -i "s/\"diff\": \"[^\"]*\"/\"diff\": \"${DIFF_VERSION}\"/g" /usr/local/lib/node_modules/npm/package.json && \
    sed -i "s/\"ip-address\": \"[^\"]*\"/\"ip-address\": \"${IP_ADDRESS_VERSION}\"/g" /usr/local/lib/node_modules/npm/package.json && \
    sed -i "s/\"brace-expansion\": \"[^\"]*\"/\"brace-expansion\": \"${BRACE_EXPANSION_VERSION}\"/g" /usr/local/lib/node_modules/npm/package.json && \
    sed -i "s/\"tinyglobby\": \"[^\"]*\"/\"tinyglobby\": \"${TINYGLOBBY_VERSION}\"/g" /usr/local/lib/node_modules/npm/package.json && \
    npm config set save-exact=true && \
    npm config set legacy-peer-deps=true

# Apply OS-level security patches
RUN apk update && apk upgrade && apk add --no-cache \
    libssl3>=3.5.1-r0 \
    libcrypto3>=3.5.1-r0 \
    && rm -rf /var/cache/apk/*

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app

# Copy package manager files to leverage Docker cache
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Install dependencies
RUN YARN_ENABLE_SCRIPTS=false yarn install --immutable

# Stage 2: Build
FROM base AS builder
WORKDIR /app

# Copy only the files and folders needed for the build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarn ./.yarn

COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

# Set environment variables
ARG APP_ENV
RUN if [ -n "$APP_ENV" ]; then cp .env.${APP_ENV} .env.production; fi

# Build
RUN yarn workspaces focus --production
RUN YARN_ENABLE_SCRIPTS=false yarn install
RUN yarn build

# Stage 3: Serve the app using a lightweight node image
FROM base AS runner
WORKDIR /app

# Install font dependencies required by sharp/pango to render watermark text
RUN apk add --no-cache fontconfig freetype

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user for security BEFORE copying files so that --chown works
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

# Reducing size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --chown=nextjs:nodejs --from=builder /app/.next/standalone ./
COPY --chown=nextjs:nodejs --from=builder /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs --from=builder /app/public ./public
COPY --chown=nextjs:nodejs --from=builder /app/src/assets/fonts/kuriousLooped ./.next/standalone/src/assets/fonts/kuriousLooped

# Pre-create the Next.js image cache directory and ensure the nextjs user owns it.
# This avoids EACCES when Next.js tries to mkdir /app/.next/cache at runtime
# (e.g. when caching optimized images from next/image).
RUN mkdir -p /app/.next/cache/images && \
  chown -R nextjs:nodejs /app/.next

USER nextjs

CMD ["node", "server.js"]