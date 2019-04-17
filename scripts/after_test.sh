#!/bin/bash
pretty_output () {
    echo "$(tput setaf 208)♫ "$1" ♫$(tput sgr0)"
}

# Kill Dynamo
kill -TERM `pgrep -f dynamo`
pretty_output "Dynamodb Stopped"

# Kill Dynamo
# rm -rf migrations
# pretty_output "Removing Migrations"