FROM node:20

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /cabin

# Copy and install dependencies
COPY pnpm-lock.yaml package.json ./
RUN pnpm install

# Copy the rest of the app
COPY . .

# Build the app
RUN pnpm run build
RUN node --env-file=.env build
# Expose the port and run the preview server
EXPOSE 3000
CMD ["node","build/index.js"]

