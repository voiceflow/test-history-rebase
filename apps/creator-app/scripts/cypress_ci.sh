if npx wait-on --timeout 6000 $CYPRESS_API_URL; then
  E2E=true NODE_ENV=test npx cypress-cloud --env CI=true --parallel --record --group=\"ci-run\" --ci-build-id=\"$CIRCLE_WORKFLOW_ID\" --config defaultCommandTimeout=20000
else
  E2E=true NODE_ENV=test cypress run --browser electron --env CI=true --parallel --record --group=\"ci-run\" --ci-build-id=\"$CIRCLE_WORKFLOW_ID\" --config defaultCommandTimeout=20000
fi
