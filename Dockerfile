## BASE ##
FROM node:16-alpine AS base

ARG APP_NAME
ARG NPM_TOKEN
ARG build_SEM_VER
ARG build_BUILD_NUM
ARG build_GIT_SHA
ARG build_BUILD_URL

ENV SEM_VER=${build_SEM_VER}
ENV BUILD_NUM=${build_BUILD_NUM}
ENV GIT_SHA=${build_GIT_SHA}
ENV BUILD_URL=${build_BUILD_URL}
ENV APP_NAME=${APP_NAME}

RUN apk --no-cache add git dumb-init && \
    npm install -g turbo@1.10.16

## PRUNER ##
FROM base AS pruner
WORKDIR /app

COPY . .

RUN turbo prune --scope="@voiceflow/${APP_NAME}"

## INSTALLER ##
FROM base AS installer
WORKDIR /app

ARG NPM_TOKEN

COPY .yarn/ ./.yarn/
COPY .yarnrc.yml ./.yarnrc.yml

COPY --from=pruner /app/out .
# Need to recopy the yarn lock file
COPY --from=pruner /app/yarn.lock .

RUN echo "$NPM_TOKEN" > .npmrc && \
    yarn config set 'npmRegistries["https://registry.yarnpkg.com"].npmAuthToken' "${NPM_TOKEN#"//registry.npmjs.org/:_authToken="}" && \
    yarn workspaces focus --all --production  && \
    rm -f .npmrc && \
    yarn cache clean

## RUNNER ##
FROM base AS runner
WORKDIR /usr/src/app

COPY --from=installer /app .

WORKDIR /usr/src/app/apps/${APP_NAME}

ENTRYPOINT [ "dumb-init" ]
CMD ["node", "--experimental-specifier-resolution=node", "--max-old-space-size=4096", "build/main.js"]
