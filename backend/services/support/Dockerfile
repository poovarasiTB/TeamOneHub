FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY src/ ./src/
COPY tsconfig.json ./

RUN npm install -D typescript @types/node ts-node

EXPOSE 3007

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3007/health || exit 1

CMD ["npx", "ts-node", "src/index.ts"]
