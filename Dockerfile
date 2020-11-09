FROM node:12 AS node-svc
FROM hayd/alpine-deno:1.2.0

COPY --from=node-svc . .

RUN node --version

EXPOSE 3000

WORKDIR /usr/app

COPY ./.env.example .env

COPY ./deps.ts .
RUN deno cache deps.ts

COPY . .

RUN npm i

CMD [ "run", "--unstable", "--allow-net", "--allow-env", "--allow-read", "--no-check", "--allow-run", "server.ts" ]
