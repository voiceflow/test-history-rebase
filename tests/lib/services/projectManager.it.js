'use strict';

require('dotenv').config({ path: './.env.test' });
const { expect } = require('chai');
const knexCleaner = require('knex-cleaner');

const { Pool } = require('pg');
const { utils } = require('@voiceflow/common');
const Hashids = require('hashids');

const Knex = require('knex');
const knexfile = require('@voiceflow/database/knexfile');

const knex = Knex(knexfile.test);

const { ProjectManager } = require('../../../lib/services');

describe('projectManager integration tests', () => {
  const pool = new Pool({
    user: utils.getProcessEnv('PSQL_USER'),
    host: utils.getProcessEnv('PSQL_HOST'),
    database: utils.getProcessEnv('PSQL_DB'),
    password: utils.getProcessEnv('PSQL_PW'),
    port: 5432,
  });

  const hashids = new Hashids(utils.getProcessEnv('CONFIG_ID_HASH'), 10);

  beforeEach(async () => {
    await knexCleaner.clean(knex, { ignoreTables: ['knex_migrations', 'knex_migrations_lock'] });
  });

  after(async () => {
    await pool.end();
  });

  it('checks if user is owner of project', async () => {
    let data = await pool.query('INSERT INTO creators (name, email, gid) VALUES ($1, $2, $3) RETURNING creator_id', ['Steve2', 'steve@test.com', 'foo-gid']);

    const creatorId = data.rows[0].creator_id;
    data = await pool.query(`
                INSERT INTO projects (name, creator_id) 
                VALUES ($1, $2) 
                RETURNING project_id`, ['foo', creatorId]);

    const projectId = data.rows[0].project_id;
    const projectManager = new ProjectManager({
      pool,
      hashids,
    }, {});

    expect(await projectManager.isOwner(projectId, creatorId)).to.eql(true);
    expect(await projectManager.isOwner(projectId, 1234)).to.eql(false);
  });
});
