FROM node:22-alpine
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@10.29.3 && pnpm install --frozen-lockfile

COPY . .

EXPOSE 3006
CMD ["node", "index.js"]
