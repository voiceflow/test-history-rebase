'use strict';

require('dotenv').config({ path: './.env.test' });
const { expect } = require('chai');
const knexCleaner = require('knex-cleaner');

const { Pool } = require('pg');
const { utils } = require('@voiceflow/common');
const Knex = require('knex');

const knexfile = require('@voiceflow/database/knexfile');

const knex = Knex(knexfile.test);

const Hashids = require('hashids');
const { JWT } = require('../../../lib/clients');

const { LinkManager } = require('../../../lib/services');

describe('linkManager integration tests', () => {
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

  const hashids = new Hashids(utils.getProcessEnv('CONFIG_ID_HASH'), 10);
  const jwt = new JWT(process.env.JWT_SECRET);
  beforeEach(async () => {
    await knexCleaner.clean(knex, { ignoreTables: ['knex_migrations', 'knex_migrations_lock'] });
  });

  after(async () => {
    await pool.end();
  });

  it('get Template', async () => {
    let data = await pool.query('INSERT INTO creators (name, email, gid) VALUES ($1, $2, $3) RETURNING creator_id', [
      'Steve2',
      'steve@test.com',
      'foo-gid',
    ]);
    const creatorId = data.rows[0].creator_id;
    data = await pool.query('INSERT INTO teams (creator_id) VALUES ($1) RETURNING team_id', [creatorId]);
    const teamId = data.rows[0].team_id;
    await pool.query('INSERT INTO team_members (team_id, creator_id) VALUES ($1, $2)', [teamId, creatorId]);
    data = await pool.query('INSERT INTO projects (creator_id, team_id) VALUES ($1, $2) RETURNING project_id', [creatorId, teamId]);
    const projectId = data.rows[0].project_id;
    data = await pool.query('INSERT INTO skills (project_id, diagram) VALUES ($1, $2) RETURNING skill_id', [projectId, 'a']);
    const skillId = data.rows[0].skill_id;

    const linkManager = new LinkManager({ pool, hashids, jwt });

    await linkManager.setTemplate(skillId, { domains: ['test'] });
    const result = await linkManager.getTemplate(skillId);
    const [domain] = result.account_linking.domains;
    expect(domain).to.eql('test');
  });
  it('set Template', async () => {
    let data = await pool.query('INSERT INTO creators (name, email, gid) VALUES ($1, $2, $3) RETURNING creator_id', [
      'Steve2',
      'steve@test.com',
      'foo-gid',
    ]);
    const creatorId = data.rows[0].creator_id;
    data = await pool.query('INSERT INTO teams (creator_id) VALUES ($1) RETURNING team_id', [creatorId]);
    const teamId = data.rows[0].team_id;
    await pool.query('INSERT INTO team_members (team_id, creator_id) VALUES ($1, $2)', [teamId, creatorId]);
    data = await pool.query('INSERT INTO projects (creator_id, team_id) VALUES ($1, $2) RETURNING project_id', [creatorId, teamId]);
    const projectId = data.rows[0].project_id;
    data = await pool.query('INSERT INTO skills (project_id, diagram) VALUES ($1, $2) RETURNING skill_id', [projectId, 'a']);
    const skillId = data.rows[0].skill_id;

    const linkManager = new LinkManager({ pool, hashids, jwt });

    await linkManager.setTemplate(skillId, { domains: ['test'] });
    const result = await pool.query('SELECT * from SKILLS WHERE skill_id=$1', [skillId]);
    const [domain] = result.rows[0].account_linking.domains;
    expect(domain).to.eql('test');
  });
});
