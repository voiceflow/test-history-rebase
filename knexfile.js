const fs = require('fs')

if(process.env.NODE_ENV && fs.existsSync(`./.env.${process.env.NODE_ENV}`)){
    if (process.env.NODE_ENV !== 'test') console.log(`Running in ${process.env.NODE_ENV} environment`)
    require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` })
}else{
    console.log(`No Environment Set/Not Found! Using Test Migration`)
    require('dotenv').config({path:'./.env.test'})
}

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
