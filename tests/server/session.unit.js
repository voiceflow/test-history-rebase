'use strict';

const { expect } = require('chai');
const request = require('supertest');

const _ = require('lodash');
const sinon = require('sinon');
const GetApp = require('../getAppForTest');

const { createFixture, checkFixture } = require('./fixture');

const tests = [
  {
    method: 'get',
    calledPath: '/session/amazon/access_token',
    expected: {
      controllers: {
        Authentication: {
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
        Authentication: {
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
        Authentication: {
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
        Authentication: {
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
        Authentication: {
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
        Authentication: {
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
        Authentication: {
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
        Authentication: {
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
        Authentication: {
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
        Authentication: {
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
        Authentication: {
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
        Authentication: {
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
        Authentication: {
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
        Authentication: {
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
        Authentication: {
          fbLogin: 1,
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

  afterEach(() => sinon.restore());

  tests.forEach((test) => {
    it(`${test.method} ${test.namedPath || test.calledPath}`, async () => {
      const fixture = createFixture();

      ({ app } = await GetApp(fixture));

      const response = await request(app)[test.method](test.calledPath);

      checkFixture(fixture, test.expected);
      expect(response.body).to.eql({ done: 'done' });
    });
  });
});
