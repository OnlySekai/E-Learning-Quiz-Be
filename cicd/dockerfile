# build docker file for nestjs application
FROM node:21-alpine3.19 as builder
WORKDIR /app
COPY .yarn .yarn
COPY package.json .yarnrc.yml ./
RUN yarn install
COPY . .
RUN yarn build

# build docker file for nestjs application
FROM node:21-alpine3.19
WORKDIR /app
COPY .yarn .yarn
COPY package.json .yarnrc.yml ./
COPY --from=builder /app/dist ./dist
RUN yarn install
CMD ["yarn", "start:prod"]
