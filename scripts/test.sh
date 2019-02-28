#!/bin/bash

echo "UNIT TESTS"
npm run unit_tests

echo "INTEGRATION TESTS"
./scripts/before_test.sh
npm run integration_tests
./scripts/after_test.sh