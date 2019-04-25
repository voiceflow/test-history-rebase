#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
PROJECT_ROOT=$DIR'/..'

. $PROJECT_ROOT/util.sh

# Update Migrations Folder
if ! [ -d "./database" ]; then
  pretty_output 'Cloning Database Migrations'
  if ! (git clone git@github.com:storyflow/database.git) then
    git clone https://github.com/storyflow/database.git || exit 1
  fi
  cd ./database
else
  pretty_output 'Pulling Latest Migrations'
  cd ./database && git pull
fi

if ! [ -d "./node_modules" ]; then
  npm install
fi

npm run init:test
