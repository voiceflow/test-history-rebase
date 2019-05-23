'use strict';

require('dotenv').config({ path: './.env.test' });
const { expect } = require('chai');
const knexCleaner = require('knex-cleaner');

const { Pool } = require('pg');
const { utils } = require('@voiceflow/common');
const Knex = require('knex');

const knexfile = require('@voiceflow/database/knexfile');

const knex = Knex(knexfile.test);

const { ProductManager } = require('../../../lib/services');

describe('productManager integration tests', () => {
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
    await knexCleaner.clean(knex, { ignoreTables: ['knex_migrations', 'knex_migrations_lock'] });
  });

  after(async () => {
    await pool.end();
  });

  it('get updates', async () => {
    const productManager = new ProductManager({ pool });

    expect(await productManager.getUpdates()).to.eql([]);

    await pool.query('INSERT INTO product_updates (type, details) VALUES ($1, $2)', ['a', 'b']);

    const updates = await productManager.getUpdates();

    expect(updates.length).to.eql(1);
    expect(updates[0].type).to.eql('a');
    expect(updates[0].details).to.eql('b');
  });

  it('create update', async () => {
    const productManager = new ProductManager({ pool });
    await productManager.createUpdate('a', 'b');

    const updates = (await pool.query('SELECT * FROM product_updates')).rows;
    expect(updates.length).to.eql(1);
    expect(updates[0].type).to.eql('a');
    expect(updates[0].details).to.eql('b');
  });
});
