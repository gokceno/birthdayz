FROM python:slim-bullseye AS base

RUN apt-get update && apt-get install -y curl unzip

RUN curl -fsSL https://bun.sh/install | bash && \
    ln -s $HOME/.bun/bin/bun /usr/local/bin/bun

FROM base AS install

WORKDIR /app
COPY package.json .
RUN bun install

FROM install AS run

WORKDIR /app
COPY . .
COPY --from=install /app/node_modules .

LABEL org.opencontainers.source=https://github.com/gokceno/birthdayz/

ENTRYPOINT ["bun"]
