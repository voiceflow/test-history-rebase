#!/bin/bash

if [ -z "$1" ]
  then
    echo "ERROR: No environment supplied!"
    echo "Usage: yarn preview [environment name]"
    exit 1
fi

ENV_NAME=$1
CURRENT_BRANCH=$(git branch --show-current)

git stash save "EPHEMERAL_ENV_SAVE" # Stash changes with this name if applicable
git branch -D ephemeral-$ENV_NAME # Force delete the ephemeral branch for safety
git checkout -b ephemeral-$ENV_NAME
git push --force --set-upstream origin ephemeral-$ENV_NAME --no-verify

git checkout $CURRENT_BRANCH

STASH_NAME=$(git stash list | head -1 | awk -F'. ' ' { print $NF }')
if [ "$STASH_NAME" == "EPHEMERAL_ENV_SAVE" ]; then
  git stash pop # Only pop if the previous stash is made by the ephemeral environments preview
fi
git branch -D ephemeral-$ENV_NAME # Force delete the ephemeral branch to prevent direct user modification
