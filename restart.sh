#!/bin/bash
npm install
forever stopall
pkill node
forever start -c "npm run start" .
forever list
