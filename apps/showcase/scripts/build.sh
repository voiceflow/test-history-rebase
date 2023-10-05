#!/bin/bash
set -e

if [[ $CI == true ]]; then
  if [[ "$CIRCLE_BRANCH" == "master" || "$CIRCLE_BRANCH" == "production" ]]; then
    echo "Building production image!"
    export VF_APP_BUILD_ENV=production
  else
    echo "Building development image!"
    export VF_APP_BUILD_ENV=staging
  fi
fi

NODE_ENV=production

yarn types
yarn g:vite build
