require('dotenv').config({path:'./.env.test'})

module.exports = {
  test: {
    client: 'postgresql',
    connection: {
      database: process.env.PSQL_DB,
      user: process.env.PSQL_USER,
      password: process.env.PSQL_PW,
      host: process.env.PSQL_HOST
    },
    pool: {
      min: 1,
      max: 1
    },
    migrations: {
      tableName: '_knex_migrations',
      directory: './migrations/sql'
    },
    seeds: {
      directory: './seeds/sql'
    }
  },
  development: {
    client: 'postgresql',
    connection: {
      database: process.env.PSQL_DB,
      user: process.env.PSQL_USER,
      password: process.env.PSQL_PW,
      host: process.env.PSQL_HOST
    },
    pool: {
      min: 1,
      max: 1
    },
    migrations: {
      tableName: '_knex_migrations',
      directory: './migrations/sql'
    }
  },
  staging: {
    client: 'postgresql',
    connection: {
      database: process.env.PSQL_DB,
      user: process.env.PSQL_USER,
      password: process.env.PSQL_PW,
      host: process.env.PSQL_HOST
    },
    pool: {
      min: 1,
      max: 1
    },
    migrations: {
      tableName: '_knex_migrations',
      directory: './migrations/sql'
    }
  },
  production: {
    client: 'postgresql',
    connection: {
      database: process.env.PSQL_DB,
      user: process.env.PSQL_USER,
      password: process.env.PSQL_PW,
      host: process.env.PSQL_HOST
    },
    pool: {
      min: 1,
      max: 1
    },
    migrations: {
      tableName: '_knex_migrations',
      directory: './migrations/sql'
    }
  }
};
