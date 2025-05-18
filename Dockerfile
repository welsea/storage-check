FROM node:20

# Enable pnpm via Corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory inside the container
WORKDIR /cabin

# Copy only files needed to install dependencies first (for better caching)
COPY pnpm-lock.yaml package.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the app
COPY . .

# Build the SvelteKit app
RUN pnpm run build

# Set environment variable — ORIGIN must match your deployed domain
ENV ORIGIN=https://cabin.welsea.site

# Expose the port the app listens on
EXPOSE 3000

# Start the app
CMD ["node", "build"]