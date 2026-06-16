# 1. Base Image: Use the lightweight Node 20 on Alpine Linux
# "alpine" is a tiny Linux distro (~5MB) perfect for containers
FROM node:20-alpine

# 2. Workspace: Set the working directory inside the container
WORKDIR /app

# 3. Dependencies: Copy ONLY package files first
# This allows Docker to cache dependencies. If you change your code
# but not your dependencies, Docker skips this step = SUPER FAST BUILDS.
COPY package.json package-lock.json ./

# 4. Install: Use 'npm ci' instead of 'npm install'
# 'ci' (Clean Install) is stricter. It ensures the versions match
# package-lock.json exactly. It's meant for robots/servers.
RUN npm ci

# 5. Source Code: Copy the rest of your app files
# (This respects .dockerignore, so node_modules is skipped)
COPY . .

# 6. Build: Compile TypeScript -> JavaScript
# This creates the .next folder inside the container
RUN npm run build

# 7. Expose: Document that this container listens on port 3000
EXPOSE 8080

# 8. Start: The command to run the app
CMD ["npm", "start"]