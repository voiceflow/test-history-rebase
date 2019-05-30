'use strict';

require('dotenv').config({ path: './.env.test' });

const { expect } = require('chai');
const request = require('supertest');

const sinon = require('sinon');
const GetApp = require('../getAppForTest');

const { createFixture, checkFixture } = require('./fixture');

const tests = [
  {
    method: 'get',
    calledPath: '/session/amazon/access_token',
    expected: {
      controllers: {
        account: {
          getAccessToken: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    namedPath: '/session/amazon/:code',
    calledPath: '/session/amazon/other',
    expected: {
      controllers: {
        account: {
          getAmazonCode: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'delete',
    calledPath: '/session/amazon',
    expected: {
      controllers: {
        account: {
          deleteAmazon: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    calledPath: '/session/google/access_token',
    expected: {
      controllers: {
        account: {
          hasGoogleAccessToken: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'delete',
    calledPath: '/session/google/access_token',
    expected: {
      controllers: {
        account: {
          deleteGoogleAccessToken: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    namedPath: '/session/google/dialogflow_access_token/:project_id',
    calledPath: '/session/google/dialogflow_access_token/project1',
    expected: {
      controllers: {
        account: {
          hasDialogflowToken: 1,
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
    calledPath: '/session/google/verify_token',
    expected: {
      controllers: {
        account: {
          verifyGoogleAccessToken: 1,
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
    calledPath: '/session/google/verify_dialogflow_token',
    expected: {
      controllers: {
        account: {
          verifyDialogflowToken: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'delete',
    calledPath: '/session/google/dialogflow_access_token',
    expected: {
      controllers: {
        account: {
          deleteDialogflowToken: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    calledPath: '/session',
    expected: {
      controllers: {
        account: {
          getSession: 1,
        },
      },
      middleware: {
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    calledPath: '/session/vendor',
    expected: {
      controllers: {
        account: {
          getVendor: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'put',
    calledPath: '/session',
    expected: {
      controllers: {
        account: {
          putSession: 1,
        },
      },
      middleware: {
        verify: 1,
      },
    },
  },
  {
    method: 'delete',
    calledPath: '/session',
    expected: {
      controllers: {
        account: {
          deleteSession: 1,
        },
      },
      middleware: {
        verify: 1,
      },
    },
  },
  {
    method: 'put',
    calledPath: '/googleLogin',
    expected: {
      controllers: {
        account: {
          googleLogin: 1,
        },
      },
      middleware: {
        verify: 1,
      },
    },
  },
  {
    method: 'put',
    calledPath: '/fbLogin',
    expected: {
      controllers: {
        account: {
          facebookLogin: 1,
        },
      },
      middleware: {
        verify: 1,
      },
    },
  },
];

describe('session route unit tests', () => {
  let app;
  let server;

  afterEach(async () => {
    sinon.restore();
    await server.stop();
  });

  tests.forEach((test) => {
    it(`${test.method} ${test.namedPath || test.calledPath}`, async () => {
      const fixture = createFixture();

      ({ app, server } = await GetApp(fixture));

      const response = await request(app)[test.method](test.calledPath);

      checkFixture(fixture, test.expected);
      expect(response.body).to.eql({ done: 'done' });
    });
  });
});
