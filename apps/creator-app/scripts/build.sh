#!/bin/bash
set -e

if [[ $CI == true ]]; then
  if [[ "$CIRCLE_BRANCH" == "master" || "$CIRCLE_BRANCH" == "production" ]]; then
    echo "Building production image!"
    export VF_APP_API_HOST=api.voiceflow.com
    export VF_APP_BUILD_ENV=production
    export VF_APP_MAINTENANCE_STATUS_SOURCE=https://s3.amazonaws.com/com.voiceflow.maintenance/maintenance.json
  else
    echo "Building development image!"
    export VF_APP_BUILD_ENV=staging
    export VF_APP_API_HOST=api-$CIRCLE_BRANCH.development.voiceflow.com
    export VF_APP_MAINTENANCE_STATUS_SOURCE=https://s3.amazonaws.com/com.voiceflow.dev.maintenance/maintenance.json
  fi
fi

NODE_ENV=production
export NODE_OPTIONS=--max_old_space_size=4096

yarn types
vite build
yarn build:copy-prototype
