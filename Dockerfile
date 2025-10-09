FROM oven/bun:latest AS dev
COPY . /app
WORKDIR /app
RUN bun install --frozen-lockfile

FROM oven/bun:latest AS prod
COPY ./package.json bun.lock* /app/
WORKDIR /app
RUN bun install --production --frozen-lockfile

FROM oven/bun:latest AS builder
COPY . /app/
COPY --from=dev /app/node_modules /app/node_modules
WORKDIR /app
RUN bun run build

FROM node:24-alpine AS release
COPY ./package.json /app/
COPY --from=prod /app/node_modules /app/node_modules
COPY --from=builder /app/build /app/build
WORKDIR /app
EXPOSE 3000
CMD ["npm", "run", "start"]