#!/bin/bash

echo "UNIT TESTS"
NODE_ENV=test ./node_modules/.bin/jest --setupFiles dotenv/config --testPathIgnorePatterns=/app/ --coverage --testMatch=\"**/(*.)+(test).js?(x)\"

./scripts/test_setup.sh
echo "INTEGRATION TESTS"
NODE_ENV=test ./node_modules/.bin/jest --testPathIgnorePatterns=/app/ --coverage --runInBand --forceExit --testMatch="**/(*.)+(itest).js?(x)" "$@"
./scripts/test_after.sh