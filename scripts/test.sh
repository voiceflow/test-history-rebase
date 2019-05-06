#!/bin/bash

echo "UNIT TESTS"
npm run unit_tests

./scripts/before_test.sh

echo "INTEGRATION TESTS"
npm run integration_tests