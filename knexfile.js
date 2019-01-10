require('dotenv').config()

module.exports = {
  test: {
    client: 'postgresql',
    connection: {
      database: process.env.PSQL_DB_TEST,
      user: process.env.PSQL_USER_TEST,
      password: process.env.PSQL_PW_TEST,
      host: process.env.PSQL_HOST_TEST
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
      database: process.env.PSQL_DB_DEVELOPMENT,
      user: process.env.PSQL_USER_DEVELOPMENT,
      password: process.env.PSQL_PW_DEVELOPMENT,
      host: process.env.PSQL_HOST_DEVELOPMENT
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
      database: process.env.PSQL_DB_STAGING,
      user: process.env.PSQL_USER_STAGING,
      password: process.env.PSQL_PW_STAGING,
      host: process.env.PSQL_HOST_STAGING
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
      database: process.env.PSQL_DB_PRODUCTION,
      user: process.env.PSQL_USER_PRODUCTION,
      password: process.env.PSQL_PW_PRODUCTION,
      host: process.env.PSQL_HOST_PRODUCTION
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
