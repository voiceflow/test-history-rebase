#!/bin/bash

if [ -z "$1" ]
  then
    echo "ERROR: No environment supplied!"
    echo "Usage: yarn preview:clean [environment name]"
    exit 1
fi

git branch -D ephemeral-$1
git push origin --delete ephemeral-$1