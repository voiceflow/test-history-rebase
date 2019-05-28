'use strict';

require('dotenv').config({ path: './.env.test' });

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

const sinon = require('sinon');

const Account = require('../../../lib/controllers/account');

describe('account controller unit tests', () => {
  beforeEach(() => sinon.restore());

  it('creates new session', async () => {
    const services = {
      accountManager: {
        checkLogin: sinon.stub().resolves('payload'),
        createSession: sinon.stub().resolves({
          userHash: 'a',
          token: 'b',
          user: 'c',
        }),
      },
    };

    const account = new Account(services);
    expect(await account.putSession({ body: { user: 'test' } })).to.deep.eq({
      token: 'ab',
      user: 'c',
    });

    expect(services.accountManager.checkLogin.args[0][0]).to.eq('test');
    expect(services.accountManager.createSession.args[0][0]).to.eq('payload');
  });

  it('handles google login', async () => {
    const services = {
      accountManager: {
        googleLogin: sinon.stub().resolves('payload'),
        createSession: sinon.stub().resolves({
          userHash: 'a',
          token: 'b',
          user: 'c',
        }),
      },
    };

    const account = new Account(services);
    expect(await account.googleLogin({ body: { user: 'test' } })).to.deep.eq({
      token: 'ab',
      user: 'c',
    });

    expect(services.accountManager.googleLogin.args[0][0]).to.eq('test');
    expect(services.accountManager.createSession.args[0][0]).to.eq('payload');
  });

  it('handles facebook login', async () => {
    const services = {
      accountManager: {
        facebookLogin: sinon.stub().resolves('payload'),
        createSession: sinon.stub().resolves({
          userHash: 'a',
          token: 'b',
          user: 'c',
        }),
      },
    };

    const account = new Account(services);
    expect(await account.facebookLogin({ body: { user: 'test' } })).to.deep.eq({
      token: 'ab',
      user: 'c',
    });

    expect(services.accountManager.facebookLogin.args[0][0]).to.eq('test');
    expect(services.accountManager.createSession.args[0][0]).to.eq('payload');
  });

  it('handles signup', async () => {
    const services = {
      accountManager: {
        createUser: sinon.stub().resolves('payload'),
        createSession: sinon.stub().resolves({
          userHash: 'a',
          token: 'b',
          user: 'c',
        }),
      },
    };

    const account = new Account(services);
    expect(await account.putUser({ body: { user: 'test' } })).to.deep.eq({
      token: 'ab',
      user: 'c',
    });

    expect(services.accountManager.createUser.args[0][0]).to.eq('test');
    expect(services.accountManager.createSession.args[0][0]).to.eq('payload');
  });

  it('throws access token error', () => {
    const services = {
      accountManager: {
        AmazonAccessToken: () => null,
      },
    };

    const account = new Account(services);

    expect(account.getAccessToken({ user: 'test' })).to.eventually.be.rejectedWith('no token associated with account');
  });

  it('fetches amazon token and profile', async () => {
    const services = {
      accountManager: {
        AmazonAccessToken: sinon.stub().returns('token'),
        fetchAmazonInfo: sinon.stub().returns('profile'),
      },
    };

    const account = new Account(services);
    expect(await account.getAccessToken({ user: 'test' })).to.deep.eq({
      token: 'token',
      profile: 'profile',
    });
  });
});
