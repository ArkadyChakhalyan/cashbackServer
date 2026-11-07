FROM node:22

WORKDIR /server

ARG NODE_ENV=production

RUN yarn global add @nestjs/cli

COPY ./package*.json ./

RUN yarn install

COPY . .

CMD ["yarn", "start:dev"]
