FROM node:22

# Set working directory
WORKDIR /cabin

# Copy files
COPY package*.json ./
RUN pnpm install

COPY . .

# Build the app
RUN pnpm run build

# Start the app in production mode
EXPOSE 3000
CMD ["pnpm", "run", "preview", "--", "--port", "3000", "--host"]
