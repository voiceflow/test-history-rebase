'use strict';

require('dotenv').config({ path: './.env.test' });
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const knexCleaner = require('knex-cleaner');
const sinon = require('sinon');

chai.use(chaiAsPromised);
const { expect } = chai;

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { generateEmptyServices, getProcessEnv } = require('@voiceflow/common').utils;
const Knex = require('knex');

const knexfile = require('@voiceflow/database/knexfile');

const knex = Knex(knexfile.test);

const { AccountManager } = require('../../../lib/services');

const DEFAULT_SERVICES = generateEmptyServices(AccountManager.CONSTANTS.SERVICE_DEPENDENCIES);

describe('accountManager integration tests', () => {
  let pool;

  before(async () => {
    pool = new Pool({
      user: getProcessEnv('PSQL_USER'),
      host: getProcessEnv('PSQL_HOST'),
      database: getProcessEnv('PSQL_DB'),
      password: getProcessEnv('PSQL_PW'),
      port: 5432,
    });
  });

  beforeEach(async () => {
    await knexCleaner.clean(knex, { ignoreTables: ['knex_migrations', 'knex_migrations_lock'] });
  });

  after(async () => {
    await pool.end();
  });

  it('allows google login', async () => {
    const email = 'login@google.com';
    const name = 'john doe';
    const googleId = 'foo-gid';
    const PAYLOAD = { sub: 'test', email };

    const services = {
      ...DEFAULT_SERVICES,
      googleClient: {
        verifyIdToken: () => ({ getPayload: () => PAYLOAD }),
      },
      pool,
    };

    await pool.query('INSERT INTO creators (name, email, gid) VALUES ($1, $2, $3) RETURNING *', [name, email, googleId]);

    const accountManager = new AccountManager(services);

    const account = await accountManager.googleLogin({ name, email, googleId, token: 'TOKEN' });

    expect(account).to.deep.include({
      email,
      name,
      gid: googleId,
    });
  });

  it('denies google login on email mismatch', async () => {
    const email = 'login@google.com';
    const name = 'john doe';
    const googleId = 'foo-gid';
    const PAYLOAD = { sub: 'test', email: 'different@google.com' };

    const services = {
      ...DEFAULT_SERVICES,
      googleClient: {
        verifyIdToken: () => ({ getPayload: () => PAYLOAD }),
      },
    };

    await pool.query('INSERT INTO creators (name, email, gid) VALUES ($1, $2, $3) RETURNING *', [name, email, googleId]);

    const accountManager = new AccountManager(services);

    expect(accountManager.googleLogin({ name, email, googleId, token: 'TOKEN' })).to.eventually.be.rejectedWith('Invalid Token');
  });

  it('updates google id on existing account', async () => {
    const email = 'login@google.com';
    const name = 'john doe';
    const googleId = 'foo-gid';
    const PAYLOAD = { sub: 'test', email };

    const services = {
      ...DEFAULT_SERVICES,
      googleClient: {
        verifyIdToken: () => ({ getPayload: () => PAYLOAD }),
      },
      pool,
    };

    const [account] = (await pool.query('INSERT INTO creators (name, email, gid) VALUES ($1, $2, $3) RETURNING *', [name, email, googleId])).rows;

    const accountManager = new AccountManager(services);

    await accountManager.googleLogin({ name, email, googleId: 'newGoogleId', token: 'TOKEN' });

    const [updatedAccount] = (await pool.query('SELECT gid FROM creators WHERE creator_id = $1', [account.creator_id])).rows;

    expect(updatedAccount.gid).to.eq('newGoogleId');
  });

  it('creates new account for google login', async () => {
    const email = 'new@google.com';
    const name = 'john doe';
    const googleId = 'foo-gid';
    const PAYLOAD = { sub: 'test', email };

    const services = {
      ...DEFAULT_SERVICES,
      googleClient: {
        verifyIdToken: () => ({ getPayload: () => PAYLOAD }),
      },
      teamManager: {
        createPersonalTeam: sinon.stub(),
      },
      pool,
    };

    const accountManager = new AccountManager(services);
    const account = await accountManager.googleLogin({ name, email, googleId, token: 'TOKEN' });

    expect(account).to.deep.include({
      name,
      email,
      gid: googleId,
    });

    expect(services.teamManager.createPersonalTeam.args[0][0]).to.deep.eq({
      id: account.creator_id,
      email,
    });
  });

  it('allows facebook login', async () => {
    const email = 'login@facebook.com';
    const name = 'john doe';
    const fbId = 'foo-fid';

    const services = {
      ...DEFAULT_SERVICES,
      axios: {
        get: sinon.stub().returns({
          data: {
            user_id: fbId,
          },
        }),
      },
      pool,
    };

    await pool.query('INSERT INTO creators (name, email, fid) VALUES ($1, $2, $3) RETURNING *', [name, email, fbId]);

    const accountManager = new AccountManager(services);

    const account = await accountManager.facebookLogin({ name, email, fbId, code: 'CODE' });

    expect(account).to.deep.include({
      email,
      name,
      fid: fbId,
    });
  });

  it('denies facebook login on mismatch', async () => {
    const email = 'login@facebook.com';
    const name = 'john doe';
    const fbId = 'foo-fid';

    const services = {
      ...DEFAULT_SERVICES,
      axios: {
        get: sinon.stub().returns({
          data: {
            user_id: 'different_id',
          },
        }),
      },
    };

    const accountManager = new AccountManager(services);

    expect(accountManager.facebookLogin({ name, email, fbId, code: 'CODE' })).to.eventually.be.rejectedWith('Invalid Token');
  });

  it('updates facebook id on existing account', async () => {
    const email = 'login@facebook.com';
    const name = 'john doe';

    const services = {
      ...DEFAULT_SERVICES,
      axios: {
        get: sinon.stub().returns({
          data: {
            user_id: 'newFbId',
          },
        }),
      },
      pool,
    };

    const [account] = (await pool.query('INSERT INTO creators (name, email) VALUES ($1, $2) RETURNING *', [name, email])).rows;

    const accountManager = new AccountManager(services);

    await accountManager.facebookLogin({ name, email, fbId: 'newFbId', code: 'CODE' });

    const [updatedAccount] = (await pool.query('SELECT fid FROM creators WHERE creator_id = $1', [account.creator_id])).rows;

    expect(updatedAccount.fid).to.eq('newFbId');
  });

  it('creates new account for facebook login', async () => {
    const email = 'new@facebook.com';
    const name = 'john doe';
    const fbId = 'foo-fid';

    const services = {
      ...DEFAULT_SERVICES,
      axios: {
        get: sinon.stub().returns({
          data: {
            user_id: fbId,
          },
        }),
      },
      teamManager: {
        createPersonalTeam: sinon.stub(),
      },
      pool,
    };

    const accountManager = new AccountManager(services);
    const account = await accountManager.facebookLogin({ name, email, fbId, code: 'CODE' });

    expect(account).to.deep.include({
      name,
      email,
      fid: fbId,
    });

    expect(services.teamManager.createPersonalTeam.args[0][0]).to.deep.eq({
      id: account.creator_id,
      email,
    });
  });

  it('rejects sign up if exists', async () => {
    const email = 'login@voiceflow.com';
    const name = 'john doe';

    const services = {
      ...DEFAULT_SERVICES,
      pool,
    };

    await pool.query('INSERT INTO creators (name, email) VALUES ($1, $2) RETURNING *', [name, email]);

    const accountManager = new AccountManager(services);
    expect(accountManager.createUser({ name, email, password: 'password1' })).to.eventually.be.rejectedWith('this email already exists');
  });

  it('creates new user', async () => {
    const email = 'login@voiceflow.com';
    const name = 'john doe';

    const services = {
      ...DEFAULT_SERVICES,
      teamManager: {
        createPersonalTeam: sinon.stub(),
      },
      bcrypt,
      pool,
    };

    const accountManager = new AccountManager(services);
    const account = await accountManager.createUser({ name, email, password: 'password1' });

    expect(account).to.deep.include({
      name,
      email,
    });

    expect(services.teamManager.createPersonalTeam.args[0][0]).to.deep.eq({
      id: account.creator_id,
      email,
    });

    expect(await bcrypt.compare('password1', account.password)).to.be.true;
  });

  it('returns dialog flow token status', async () => {
    const email = 'login@voiceflow.com';
    const name = 'john doe';
    const dialogflowToken = { token: 'token' };

    const services = {
      ...DEFAULT_SERVICES,
      hashids: {
        encode: (a) => a,
        decode: (a) => [a],
      },
      pool,
    };

    const [account] = (await pool.query('INSERT INTO creators (name, email) VALUES ($1, $2) RETURNING *', [name, email])).rows;
    const [project] = (await pool.query('INSERT INTO projects (name) VALUES ($1) RETURNING *', [name])).rows;
    await pool.query('INSERT INTO project_members (creator_id, project_id, dialogflow_token) VALUES ($1, $2, $3)', [
      account.creator_id,
      project.project_id,
      dialogflowToken,
    ]);

    const accountManager = new AccountManager(services);

    expect(await accountManager.hasDialogflowToken(account.creator_id, project.project_id)).to.be.true;
  });
});
