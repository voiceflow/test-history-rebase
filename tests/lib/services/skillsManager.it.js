'use strict';

require('dotenv').config({ path: './.env.test' });
const { expect } = require('chai');
const knexCleaner = require('knex-cleaner');
const Promise = require('bluebird');

const { Pool } = require('pg');
const { utils } = require('@voiceflow/common');
const Knex = require('knex');

const knexfile = require('@voiceflow/database/knexfile');

const knex = Knex(knexfile.test);

const { SkillsManager } = require('../../../lib/services');

describe('skillsManager integration tests', () => {
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

  it('get live skills for project', async () => {
    let data = await pool.query('INSERT INTO creators (name, email, gid) VALUES ($1, $2, $3) RETURNING creator_id', ['Steve2', 'steve@test.com', 'foo-gid']);

    const creatorId = data.rows[0].creator_id;
    data = await pool.query(`
                INSERT INTO projects (name, creator_id) 
                VALUES ($1, $2) 
                RETURNING project_id`, ['foo', creatorId]);

    const projectId = data.rows[0].project_id;

    const skills = [
      {
        diagram: 'foo-1',
        projectId,
        live: true,
      },
      {
        diagram: 'foo-2',
        projectId,
        live: false,
      },
      {
        diagram: 'foo-3',
        projectId,
        live: true,
      },
    ];

    const created = await Promise
      .map(skills, (skill) => pool.query(
        'INSERT INTO skills (diagram, project_id, live) VALUES ($1, $2, $3) RETURNING skill_id, live',
        [skill.diagram, skill.projectId, skill.live],
      ))
      .filter((_data) => _data.rows[0].live)
      .map((_data) => _data.rows[0].skill_id);

    const skillsManager = new SkillsManager({ pool }, {});

    const foundSkills = await skillsManager.getLiveSkills(projectId);

    expect(foundSkills.length).to.eql(2);
    expect(foundSkills.map((skill) => skill.skill_id)).to.eql(created);
    expect(await skillsManager.getLiveSkills(1234)).to.eql([]);
  });
});
