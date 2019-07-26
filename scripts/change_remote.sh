#!/bin/bash

CURRENT_REMOTE=$(git remote get-url --push origin)
NEW_REMOTE=$(echo "${CURRENT_REMOTE//storyflow/voiceflow}")
echo -e "Your current git remote origin is: $CURRENT_REMOTE"
git remote set-url origin $NEW_REMOTE
echo -e "Your new git remote origin is: $(git remote get-url --push origin)"
