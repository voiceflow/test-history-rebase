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

const Hashids = require('hashids');

const { EmailManager } = require('../../../lib/services');

describe('emailManager integration tests', () => {
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
  beforeEach(async () => {
    await knexCleaner.clean(knex, { ignoreTables: ['knex_migrations', 'knex_migrations_lock'] });
  });

  after(async () => {
    await pool.end();
  });

  it('create Template', async () => {
    let data = await pool.query('INSERT INTO creators (name, email, gid) VALUES ($1, $2, $3) RETURNING creator_id', ['Steve2', 'steve@test.com', 'foo-gid']);
    const creatorId = data.rows[0].creator_id;
    data = await pool.query('INSERT INTO teams (creator_id) VALUES ($1) RETURNING team_id', [creatorId]);
    const teamId = data.rows[0].team_id;
    await pool.query('INSERT INTO team_members (team_id, creator_id) VALUES ($1, $2)', [teamId, creatorId]);
    data = await pool.query('INSERT INTO projects (creator_id, team_id) VALUES ($1, $2) RETURNING project_id', [creatorId, teamId]);
    const projectId = data.rows[0].project_id;
    data = await pool.query('INSERT INTO skills (project_id, diagram) VALUES ($1, $2) RETURNING skill_id', [projectId , "a"]);
    const skillId = data.rows[0].skill_id;

    const emailManager = new EmailManager({pool, hashids});

    let payload = {
      content:"a {test} b",
      subject:"c {thing} d",
      title:"t",
      sender:"s",
    };

    await emailManager.setTemplate(creatorId, skillId, Number.NaN, payload);
    const result = await pool.query('SELECT title, content, sender, subject from email_templates WHERE skill_id=$1', [skillId]);
    expect(result.rows[0]).to.eql(payload);
  });

  it('get Template', async () => {
    let data = await pool.query('INSERT INTO creators (name, email, gid) VALUES ($1, $2, $3) RETURNING creator_id', ['Steve2', 'steve@test.com', 'foo-gid']);
    const creatorId = data.rows[0].creator_id;
    data = await pool.query('INSERT INTO teams (creator_id) VALUES ($1) RETURNING team_id', [creatorId]);
    const teamId = data.rows[0].team_id;
    await pool.query('INSERT INTO team_members (team_id, creator_id) VALUES ($1, $2)', [teamId, creatorId]);
    data = await pool.query('INSERT INTO projects (creator_id, team_id) VALUES ($1, $2) RETURNING project_id', [creatorId, teamId]);
    const projectId = data.rows[0].project_id;
    data = await pool.query('INSERT INTO skills (project_id, diagram) VALUES ($1, $2) RETURNING skill_id', [projectId , "a"]);
    const skillId = data.rows[0].skill_id;

    const emailManager = new EmailManager({pool, hashids});

    let payload = {
      content:"a {test} b",
      subject:"c {thing} d",
      title:"t",
      sender:"s",
    };
    const emailIdh = await emailManager.setTemplate(creatorId, skillId, Number.NaN, payload);

    const {content, subject, variables} = await emailManager.getTemplate(creatorId, hashids.decode(emailIdh)[0]);

    expect(content).to.eql(payload.content);
    expect(subject).to.eql(payload.subject);
    expect(variables).to.eql(JSON.stringify(["test","thing"]));


  });

  it('get Templates', async () => {
    const emailManager = new EmailManager({pool, hashids});

    expect(await emailManager.getTemplates(1,1)).to.eql([]);

    let data = await pool.query('INSERT INTO creators (name, email, gid) VALUES ($1, $2, $3) RETURNING creator_id', ['Steve2', 'steve@test.com', 'foo-gid']);
    const creatorId = data.rows[0].creator_id;
    data = await pool.query('INSERT INTO teams (creator_id) VALUES ($1) RETURNING team_id', [creatorId]);
    const teamId = data.rows[0].team_id;
    await pool.query('INSERT INTO team_members (team_id, creator_id) VALUES ($1, $2)', [teamId, creatorId]);
    data = await pool.query('INSERT INTO projects (creator_id, team_id) VALUES ($1, $2) RETURNING project_id', [creatorId, teamId]);
    const projectId = data.rows[0].project_id;
    data = await pool.query('INSERT INTO skills (project_id, diagram) VALUES ($1, $2) RETURNING skill_id', [projectId , "a"]);
    const skillId = data.rows[0].skill_id;


    let payload = {
      content:"a {test} b",
      subject:"c {thing} d",
      title:"t",
      sender:"s",
    };
    const emailIdh = await emailManager.setTemplate(creatorId, skillId, Number.NaN, payload);

    const [{content, subject, variables}] = await emailManager.getTemplates(creatorId, skillId);

    expect(content).to.eql(payload.content);
    expect(subject).to.eql(payload.subject);
    expect(variables).to.eql(JSON.stringify(["test","thing"]));


  });

  it('delete Template', async () => {
    const emailManager = new EmailManager({pool, hashids});


    let data = await pool.query('INSERT INTO creators (name, email, gid) VALUES ($1, $2, $3) RETURNING creator_id', ['Steve2', 'steve@test.com', 'foo-gid']);
    const creatorId = data.rows[0].creator_id;
    data = await pool.query('INSERT INTO teams (creator_id) VALUES ($1) RETURNING team_id', [creatorId]);
    const teamId = data.rows[0].team_id;
    await pool.query('INSERT INTO team_members (team_id, creator_id) VALUES ($1, $2)', [teamId, creatorId]);
    data = await pool.query('INSERT INTO projects (creator_id, team_id) VALUES ($1, $2) RETURNING project_id', [creatorId, teamId]);
    const projectId = data.rows[0].project_id;
    data = await pool.query('INSERT INTO skills (project_id, diagram) VALUES ($1, $2) RETURNING skill_id', [projectId , "a"]);
    const skillId = data.rows[0].skill_id;


    let payload = {
      content:"a {test} b",
      subject:"c {thing} d",
      title:"t",
      sender:"s",
    };
    const emailIdh = await emailManager.setTemplate(creatorId, skillId, Number.NaN, payload);

    await emailManager.deleteTemplate(creatorId,hashids.decode(emailIdh)[0]);
    expect(await emailManager.getTemplates(creatorId, skillId)).to.eql([]);


  });


  it('set Template', async () => {
    let data = await pool.query('INSERT INTO creators (name, email, gid) VALUES ($1, $2, $3) RETURNING creator_id', ['Steve2', 'steve@test.com', 'foo-gid']);
    const creatorId = data.rows[0].creator_id;
    data = await pool.query('INSERT INTO teams (creator_id) VALUES ($1) RETURNING team_id', [creatorId]);
    const teamId = data.rows[0].team_id;
    await pool.query('INSERT INTO team_members (team_id, creator_id) VALUES ($1, $2)', [teamId, creatorId]);
    data = await pool.query('INSERT INTO projects (creator_id, team_id) VALUES ($1, $2) RETURNING project_id', [creatorId, teamId]);
    const projectId = data.rows[0].project_id;
    data = await pool.query('INSERT INTO skills (project_id, diagram) VALUES ($1, $2) RETURNING skill_id', [projectId , "a"]);
    const skillId = data.rows[0].skill_id;

    const emailManager = new EmailManager({pool, hashids});

    let payload = {
      content:"a {test} b",
      subject:"c {thing} d",
      title:"t",
      sender:"s",
    };
    const emailIdh = await emailManager.setTemplate(creatorId, skillId, Number.NaN, payload);

    payload.content="z";

    await emailManager.setTemplate(creatorId, skillId, hashids.decode(emailIdh)[0], payload);

    const {content, subject, variables} = await emailManager.getTemplate(creatorId, hashids.decode(emailIdh)[0]);

    expect(content).to.eql(payload.content);
    expect(subject).to.eql(payload.subject);
    expect(variables).to.eql(JSON.stringify(["thing"]));


  });





});
