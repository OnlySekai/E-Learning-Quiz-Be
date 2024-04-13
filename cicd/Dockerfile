# build docker file for nestjs application
FROM node:20.11.1-alpine3.19 as builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

# build docker file for nestjs application
FROM node:20.11.1-alpine3.19
WORKDIR /app
ENV  NODE_ENV=production
COPY .yarn .yarn
COPY package.json .yarnrc.yml .env ./
COPY --from=builder /app/dist ./dist
RUN yarn install
CMD ["yarn", "start:prod"]
