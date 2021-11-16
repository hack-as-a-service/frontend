FROM node:16

WORKDIR /app

COPY . .

RUN yarn install && yarn cache clean && \
    yarn build

ENV NODE_ENV production

EXPOSE 3000

CMD ["yarn", "start"]
