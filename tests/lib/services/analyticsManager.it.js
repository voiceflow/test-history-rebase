'use strict';

require('dotenv').config({ path: './.env.test' });
const { expect } = require('chai');
const knexCleaner = require('knex-cleaner');
const Promise = require('bluebird');
const sinon = require('sinon');

const { Pool } = require('pg');
const { utils } = require('@voiceflow/common');
const Knex = require('knex');

const knexfile = require('@voiceflow/database/knexfile');

const knex = Knex(knexfile.test_logging);

const { AnalyticsManager } = require('../../../lib/services');

describe('analyticsManager integration tests', () => {
  let pool;

  before(async () => {
    pool = new Pool({
      user: utils.getProcessEnv('LOGGING_USER'),
      host: utils.getProcessEnv('LOGGING_HOST'),
      database: utils.getProcessEnv('LOGGING_DB'),
      password: utils.getProcessEnv('LOGGING_PW'),
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

  it('get stats for skill', async () => {
    const skillId = 10;

    const sessions = [
      {
        sessionId: 'foo-1',
        skillId,
        sessionBegin: 10,
        sessionEnd: 20,
      },
      {
        sessionId: 'foo-2',
        skillId,
        sessionBegin: 40,
        sessionEnd: 60,
      },
      {
        sessionId: 'foo-1',
        skillId,
        sessionBegin: 20,
        sessionEnd: 30,
      },
      {
        sessionId: 'foo-2',
        skillId: 30,
        sessionBegin: 120,
        sessionEnd: 130,
      },
    ];

    await Promise.map(sessions, ({ sessionId, sessionBegin, sessionEnd, skillId: _skillId }) =>
      pool.query('INSERT INTO sessions (session_id, session_begin, session_end, skill_id) VALUES ($1, $2, $3, $4)', [
        sessionId,
        sessionBegin,
        sessionEnd,
        _skillId,
      ])
    );

    await Promise.map(sessions, ({ sessionId }) => pool.query('INSERT INTO utterances (session_id) VALUES ($1)', [sessionId]));

    const services = {
      logging_pool: pool,
      skillsManager: {
        getLiveSkills: sinon.stub().resolves([{ skill_id: skillId }]),
      },
    };

    const analyticsManager = new AnalyticsManager(services);

    const results = await analyticsManager.getUsersData(123);

    expect(results).to.eql([
      {
        user_id: null,
        sessions: '2',
        utterances: '6',
        last_interaction: '60',
        first_interaction: '10',
      },
    ]);
  });

  it('getDAU for skill over time range', async () => {
    const skillId = 10;

    const sessions = [
      {
        sessionId: 'foo-1',
        skillId,
        userId: '1',
        sessionBegin: 10,
        sessionEnd: 20,
      },
      {
        sessionId: 'foo-2',
        skillId,
        userId: '1',
        sessionBegin: 40,
        sessionEnd: 60,
      },
      {
        sessionId: 'foo-1',
        skillId,
        userId: '1',
        sessionBegin: 20,
        sessionEnd: 30,
      },
      {
        sessionId: 'foo-2',
        skillId,
        userId: '2',
        sessionBegin: 120,
        sessionEnd: 130,
      },
    ];

    await Promise.map(sessions, ({ sessionId, sessionBegin, sessionEnd, skillId: _skillId, userId }) =>
      pool.query('INSERT INTO sessions (session_id, session_begin, session_end, skill_id, user_id) VALUES ($1, $2, $3, $4, $5)', [
        sessionId,
        sessionBegin,
        sessionEnd,
        _skillId,
        userId,
      ])
    );

    const services = {
      logging_pool: pool,
      skillsManager: {
        getLiveSkills: sinon.stub().resolves([{ skill_id: skillId }]),
      },
    };

    const analyticsManager = new AnalyticsManager(services);

    const results = await analyticsManager.getDAU(123, 0, 1000, 0);

    expect(results[0].user_count).to.eql('2');
    expect(results[0].dau_date).to.not.be.undefined;
  });

  it('get overall stats', async () => {
    const skillId = 10;

    const sessions = [
      {
        sessionId: 'foo-1',
        skillId,
        sessionBegin: 10,
        sessionEnd: 20,
      },
      {
        sessionId: 'foo-2',
        skillId,
        sessionBegin: 40,
        sessionEnd: 60,
      },
      {
        sessionId: 'foo-1',
        skillId,
        sessionBegin: 20,
        sessionEnd: 30,
      },
      {
        sessionId: 'foo-2',
        skillId: 30,
        sessionBegin: 120,
        sessionEnd: 130,
      },
    ];

    await Promise.map(sessions, ({ sessionId, sessionBegin, sessionEnd, skillId: _skillId }) =>
      pool.query('INSERT INTO sessions (session_id, session_begin, session_end, skill_id) VALUES ($1, $2, $3, $4)', [
        sessionId,
        sessionBegin,
        sessionEnd,
        _skillId,
      ])
    );

    await Promise.map(sessions, ({ sessionId }) => pool.query('INSERT INTO utterances (session_id) VALUES ($1)', [sessionId]));

    const services = {
      logging_pool: pool,
      skillsManager: {
        getLiveSkills: sinon.stub().resolves([{ skill_id: skillId }]),
      },
    };

    const analyticsManager = new AnalyticsManager(services);

    const results = await analyticsManager.getStats(123);

    expect(results).to.eql({
      interactions: 4,
      sessions: 2,
      users: 0,
    });
  });
});
