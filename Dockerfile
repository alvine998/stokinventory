# Use the official Node.js image
FROM node:18-alpine

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Tambahkan bun ke PATH
ENV PATH="/root/.bun/bin:$PATH"

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN bun install

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN bun run build

# Expose port 3000
EXPOSE 3005

# Start the Next.js app on port 3000
CMD ["bun", "run", "start", "--", "-p", "3005"]