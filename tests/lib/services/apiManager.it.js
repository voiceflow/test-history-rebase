'use strict';

require('dotenv').config({ path: './.env.test' });
const { expect } = require('chai');
const knexCleaner = require('knex-cleaner');

const sinon = require('sinon');

const { Pool } = require('pg');
const { utils } = require('@voiceflow/common');

const Knex = require('knex');

const knexfile = require('@voiceflow/database/knexfile');

const knex = Knex(knexfile.test);

const { APIManager } = require('../../../lib/services');

describe('apiManager integration tests', () => {
  let pool;

  before(async () => {
    pool = new Pool({
      user: utils.getProcessEnv('PSQL_USER'),
      host: utils.getProcessEnv('PSQL_HOST'),
      database: utils.getProcessEnv('PSQL_DB'),
      password: utils.getProcessEnv('PSQL_PW'),
      port: 5432,
    });
  });

  beforeEach(async () => {
    sinon.restore();
    await knexCleaner.clean(knex, { ignoreTables: ['knex_migrations', 'knex_migrations_lock'] });
  });

  after(async () => {
    await pool.end();
  });

  it('gen token', async () => {
    const creatorId = (await pool.query('INSERT INTO creators (name) VALUES ($1) RETURNING creator_id', ['will'])).rows[0].creator_id;

    const services = {
      pool,
    };

    const apiManager = APIManager(services);

    const token = await apiManager.genToken(creatorId);

    const result = (await pool.query('SELECT api_key FROM creators WHERE creator_id=$1', [creatorId])).rows[0].api_key;

    expect(token).to.eql(result);
  });

  it('get user', async () => {
    const creatorId = (await pool.query('INSERT INTO creators (name, email) VALUES ($1, $2) RETURNING creator_id', ['will', 'a@b.c'])).rows[0]
      .creator_id;

    const services = {
      pool,
    };

    const apiManager = APIManager(services);

    const token = await apiManager.genToken(creatorId);

    const result = await apiManager.getUser(token);

    expect(result).to.eql({ id: creatorId, name: 'will', email: 'a@b.c', admin: 0 });
  });

  it('get token', async () => {
    const creatorId = (await pool.query('INSERT INTO creators (name, email) VALUES ($1, $2) RETURNING creator_id', ['will', 'a@b.c'])).rows[0]
      .creator_id;

    const services = {
      pool,
    };

    const apiManager = APIManager(services);

    const token = await apiManager.genToken(creatorId);

    const result = await apiManager.getToken(creatorId);

    expect(result).to.eql(token);
  });

  it('genget token', async () => {
    const creatorId = (await pool.query('INSERT INTO creators (name, email) VALUES ($1, $2) RETURNING creator_id', ['will', 'a@b.c'])).rows[0]
      .creator_id;

    const services = {
      pool,
    };

    const apiManager = APIManager(services);

    const token = await apiManager.getToken(creatorId);

    const result = await apiManager.getToken(creatorId);

    expect(result).to.eql(token);
  });
});
