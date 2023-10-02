FROM node:16-alpine as backend

WORKDIR /app

RUN apk --no-cache add --virtual builds-deps build-base python3

COPY package.json .
COPY yarn.lock .
COPY nest-cli.json .
COPY tsconfig.json .
COPY tsconfig.build.json .

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["sh", "-c", "yarn start:prod"]

FROM postgres:16-alpine as database

COPY ./docker/postgres/migrations /docker-entrypoint-initdb.d

EXPOSE 5432

CMD ["postgres"]
