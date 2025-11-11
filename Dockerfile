FROM node:20-slim AS base
ARG DATABASE_URL="postgresql://postgres:postgres@localhost:5432/atmos?schema=public"
ENV DATABASE_URL="${DATABASE_URL}"
WORKDIR /usr/src/app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install --production=false || true
COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM node:20-slim
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/tsconfig-paths-bootstrap.js ./tsconfig-paths-bootstrap.js
COPY --from=base /usr/src/app/tsconfig.json ./tsconfig.json
COPY --from=base /usr/src/app/tsconfig.build.json ./tsconfig.build.json
COPY package.json ./
CMD ["node", "-r", "./tsconfig-paths-bootstrap", "dist/server.js"]
