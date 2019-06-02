'use strict';

require('dotenv').config({ path: './.env.test' });

const { expect } = require('chai');
const request = require('supertest');

const sinon = require('sinon');
const GetApp = require('../getAppForTest');

const { createFixture, checkFixture } = require('./fixture');

const tests = [
  {
    method: 'post',
    calledPath: '/integrations/get_users',
    expected: {
      controllers: {
        integrations: {
          getAllUsers: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    calledPath: '/integrations/add_user',
    expected: {
      controllers: {
        integrations: {
          addUser: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    calledPath: '/integrations/delete_user',
    expected: {
      controllers: {
        integrations: {
          deleteUser: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    calledPath: '/integrations/service/endpoint',
    namedPath: '/integrations/*',
    expected: {
      controllers: {
        integrationProxy: {
          proxy: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verify: 1,
        getApiUser: 1,
      },
    },
  },
];

describe('integrations route unit tests', () => {
  let app;
  let fixture;
  let server;

  afterEach(async () => {
    sinon.restore();
    await server.stop();
  });

  tests.forEach((test) => {
    it(`${test.method} ${test.namedPath || test.calledPath}`, async () => {
      fixture = createFixture();
      ({ app, server } = await GetApp(fixture));

      const response = await request(app)[test.method](test.calledPath);

      checkFixture(fixture, test.expected);
      expect(response.body).to.eql({ done: 'done' });
    });
  });
});
