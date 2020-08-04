FROM hayd/alpine-deno:1.2.2

WORKDIR /app

USER deno

ADD . .

RUN deno cache level1.ts

CMD ["run", "--allow-net", "level1.ts"]