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

const { AdminManager } = require('../../../lib/services');

describe('adminManager integration tests', () => {
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

  it('gets data from creator', async () => {
    const creatorId = (await pool.query('INSERT INTO creators (name) VALUES ($1) RETURNING creator_id', ['will'])).rows[0].creator_id;

    const skillId = (await pool.query('INSERT INTO skills (name, diagram) VALUES ($1, $2) RETURNING skill_id', ['skill_name', 'a'])).rows[0].skill_id;

    const teamId = (await pool.query('INSERT INTO teams (name, creator_id) VALUES ($1, $2) RETURNING team_id', ['team_name', creatorId])).rows[0]
      .team_id;

    const projectId = (await pool.query('INSERT INTO projects (creator_id, team_id, dev_version) VALUES ($1, $2, $3) RETURNING project_id', [
      creatorId,
      teamId,
      skillId,
    ])).rows[0].project_id;

    const services = {
      logging_pool: pool,
      pool,
    };

    const adminManager = new AdminManager(services);

    const results = await adminManager.getCreatorData(creatorId);

    expect(results).to.have.all.keys('boards', 'creator');
    expect(results.boards[teamId]).to.include.all.keys('team_id', 'name', 'seats', 'created', 'projects');
    expect(results.creator).to.include.all.keys('creator_id', 'name', 'created', 'admin');
    expect(results.boards[teamId]).to.deep.include({
      team_id: teamId,
      name: 'team_name',
    });
    expect(results.boards[teamId].projects[0]).to.deep.include({
      project_id: projectId,
    });
    expect(results.creator).to.deep.include({
      creator_id: creatorId,
      name: 'will',
    });
  });
});
