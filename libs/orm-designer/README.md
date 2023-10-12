# Designer ORM

## Installation

```sh
yarn add --exact @voiceflow/orm-designer
```

## New Migration

```sh
# make sure all the latest changes have been built
yarn build

# generate a new migration
yarn db:migrate:new

# build the migration before running it
yarn build
```

## Migrate

### Local Migration

Make sure you have the local `vf` docker stack running.

```sh
# executes all migrations against the local database
yarn db:migrate:up:local
```

### Remote Migration

Create a new `.env.remote` file with the following contents:

```sh
MIKRO_ORM_HOST='pg-postgresql.<env name>'
MIKRO_ORM_PORT=5432
MIKRO_ORM_USER='postgres'
MIKRO_ORM_PASSWORD='<password>'
MIKRO_ORM_DB_NAME='voiceflow'
```

Now you can run the migration against the remote database.

```sh
yarn db:migrate:up:remote
```
