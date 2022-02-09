#!/bin/bash
set -e

if [[ $CI == true ]]; then
  if [[ "$CIRCLE_BRANCH" == "master" || "$CIRCLE_BRANCH" == "production" ]]; then
    echo "Building production image!"
    export VF_APP_BUILD_ENV=production
    export VF_APP_API_HOST=api.voiceflow.com
  else
    echo "Building development image!"
    export VF_APP_BUILD_ENV=staging
    export VF_APP_API_HOST=api-$CIRCLE_BRANCH.development.voiceflow.com
  fi
fi

NODE_ENV=production

yarn build:types
vite build
