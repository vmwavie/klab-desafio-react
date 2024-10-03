FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

RUN npm install -g npm@latest

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV NODE_ENV development

CMD ["npm", "run", "dev"]
