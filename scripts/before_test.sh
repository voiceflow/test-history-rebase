#!/bin/bash

pretty_output () {
    echo "$(tput setaf 208)♫ "$1" ♫$(tput sgr0)"
}

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_ROOT=$DIR'/..'

if [ -d "./migrations" ]; then
  pretty_output 'Cloning Migrations'
  git clone https://github.com/storyflow/migrations.git
fi

if [ $CIRCLECI == "TRUE" ]; then
    pretty_output "Perform Migrations"
    node ./test/migrate_dynamo.js

    KNEX="./node_modules/.bin/knex"
    $KNEX migrate:latest --env test
    $KNEX seed:run --env test

elif [[ "$OSTYPE" == "linux-gnu" ]]; then

    # # Start postgres if not up
    # PSQL_READY=`pg_isready -h localhost`

    # if [[ $PSQL_READY =~ "accepting connections" ]]; then
    #     pretty_output "Postgres server running"
    # else
    pretty_output "Starting postgres server..."
    # fi

    # Create postgresql user
    USER_CREATED=`psql -tc "SELECT 'created' FROM pg_roles WHERE rolname = 'voiceflowtest'"| grep created`
    if [[ $USER_CREATED == " created" ]]; then
        pretty_output "User voiceflowtest exists, continuing"
    else
        pretty_output "Creating role voiceflowtest"
        psql -c "CREATE ROLE voiceflowtest LOGIN PASSWORD 'dealflow';"
    fi

    # Create postgresql database
    DB_CREATED=`psql -tc "SELECT 'created' FROM pg_database WHERE datname = 'voiceflowtest'" | grep created`
    if [[ $DB_CREATED == " created" ]]; then
        pretty_output "Deleting existing test database"
        psql -c "DROP DATABASE voiceflowtest;"
    fi

    pretty_output "Creating DB voiceflowtest"
    psql -c "CREATE DATABASE voiceflowtest;"

    KNEX="./node_modules/.bin/knex"
    cd $PROJECT_ROOT

    # Stop dynamo if running
    DYNAMO_PID=`pgrep -f dynamo`
    if [[ "$DYNAMO_PID" == "" ]]; then
        pretty_output "No local Dynamodb instance found, continuing"
    else
        pretty_output "Terminating local Dynamodb"
        kill -TERM `pgrep -f dynamo`
    fi

    # Start local dynamo in background
    java -Djava.library.path=./tests/DynamoDBLocal_lib -jar ./test/dynamodb_local_latest/DynamoDBLocal.jar -sharedDb &

    # Perform dynamo migrations and seeds
    pretty_output "Start Dynamodb and Perform Migrations"
    node ./test/migrate_dynamo.js

    $KNEX migrate:latest --env test
    $KNEX seed:run --env test
elif [[ "$OSTYPE" == "darwin"* ]]; then

    # Start postgres if not up
    PSQL_READY=`pg_isready -h localhost`

    if [[ $PSQL_READY =~ "accepting connections" ]]; then
        pretty_output "Postgres server running"
    else
        pretty_output "Starting postgres server..."
        pg_ctl -D /usr/local/var/postgres start
    fi

    # Create postgresql user
    USER_CREATED=`psql -h localhost -U postgres -tc "SELECT 'created' FROM pg_user WHERE usename = 'voiceflowtest'"| grep created`
    if [[ $USER_CREATED == " created" ]]; then
        pretty_output "User voiceflowtest exists, continuing"
    else
        pretty_output "Creating user voiceflowtest"
        psql -h localhost -U postgres -c "CREATE ROLE voiceflowtest LOGIN PASSWORD 'dealflow';"
    fi

    # Create postgresql database
    DB_CREATED=`psql -h localhost -U postgres -tc "SELECT 'created' FROM pg_database WHERE datname = 'voiceflowtest'" | grep created`
    if [[ $DB_CREATED == " created" ]]; then
        pretty_output "Deleting existing test database"
        psql -h localhost -U postgres -c "DROP DATABASE voiceflowtest;"
    fi

    pretty_output "Creating DB voiceflowtest"
    psql -h localhost -U postgres -c "CREATE DATABASE voiceflowtest;"

    KNEX="./node_modules/.bin/knex"
    cd $PROJECT_ROOT

    # Stop dynamo if running
    DYNAMO_PID=`pgrep -f dynamo`
    if [[ "$DYNAMO_PID" == "" ]]; then
        pretty_output "No local Dynamodb instance found, continuing"
    else
        pretty_output "Terminating local Dynamodb"
        kill -TERM `pgrep -f dynamo`
    fi

    # Start local dynamo in background
    java -Djava.library.path=./tests/DynamoDBLocal_lib -jar ./test/dynamodb_local_latest/DynamoDBLocal.jar -sharedDb &

    # Perform dynamo migrations and seeds
    pretty_output "Start Dynamodb and Perform Migrations"
    node ./test/migrate_dynamo.js

    $KNEX migrate:latest --env test
    $KNEX seed:run --env test
fi

