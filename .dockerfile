FROM node:24-alpine

WORKDIR /team4-backend

# Copy package files
COPY package*.json ./

# Install dependencies (skip prepare script that installs git hooks)
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port (adjust if needed)
EXPOSE 4000

# Start application
CMD ["npm", "start"]