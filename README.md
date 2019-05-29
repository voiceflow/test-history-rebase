# Creator

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/44589f9569c34d76b5f597c41105066c)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=storyflow/storyflow-creator&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/44589f9569c34d76b5f597c41105066c)](https://www.codacy.com?utm_source=github.com&utm_medium=referral&utm_content=storyflow/storyflow-creator&utm_campaign=Badge_Coverage)
[![CircleCI](https://circleci.com/gh/storyflow/storyflow-creator.svg?style=svg&circle-token=f8cb399f6c7d4ab14981f073347388b6a7cb9724)](https://circleci.com/gh/storyflow/storyflow-creator)

## Overview

Currently this repo contains both the UI and the backend for the UI.

In order to run the entire system locally you need to:

1. Start all databases in the background 
1. Start UI backend in a terminal window 
1. Start UI client in a terminal window 
1. Start UI server in a terminal window 
1. Start ngrok in a a terminal window (if testing alexa skills)

## Start databases

1. Clone storyflow/database and move to that directory
1. In that repo, run `npm i`
1. Make sure you have Docker installed and running by running `docker ps -a`
1. Start the database docker containers by running `npm run start` in the database repo
1. Prep the databases for local use by running `npm run init:local` in the database repo

## Starting UI backend

1. Move to this repo in a new terminal window
1. Run `npm i` in the root of this repo to install deps for the backend
1. Run `npm run local` to start the UI backend server

## Starting UI client

1. In a new terminal window, in this repo, run `npm run install-client` to install deps
1. Run `npm run client` to start the client in development mode
1. The first time the browser launches it'll say that the connection to localhost is insecure, this is fine.

## Starting storyflow server

1. Open another terminal window
1. Clone storyflow/storyflow-server and move to that directory
1. Run `npm i`
1. Run `npm run local`
1. If testing skills, open another terminal window and use ngrok to proxy calls to your local server
