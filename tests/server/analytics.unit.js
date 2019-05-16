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
    calledPath: '/analytics/track_onboarding',
    expected: {
      controllers: {
        Track: {
          trackOnboarding: 1,
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
    calledPath: '/analytics/track_session_time',
    expected: {
      controllers: {
        Track: {
          trackSessionTime: 1,
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
    calledPath: '/analytics/track_active_canvas',
    expected: {
      controllers: {
        Track: {
          trackCanvasTime: 1,
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
    calledPath: '/analytics/track_first_session_upload',
    expected: {
      controllers: {
        Track: {
          trackFirstSessionUpload: 1,
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
    calledPath: '/analytics/track_first_project',
    expected: {
      controllers: {
        Track: {
          trackFirstProject: 1,
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
    calledPath: '/analytics/track_dev_account',
    expected: {
      controllers: {
        Track: {
          trackDevAccount: 1,
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
    calledPath: '/analytics/track_flow_used',
    expected: {
      controllers: {
        Track: {
          trackFlowUsed: 1,
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
    namedPath: '/analytics/:project_id/users',
    calledPath: '/analytics/proj-id/users',
    expected: {
      controllers: {
        analytics: {
          getUsersData: 1,
        },
      },
      middleware: {
        isProjectOwner: 1,
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    namedPath: '/analytics/:project_id/:from/:to/:user_tz/DAU',
    calledPath: '/analytics/proj-id/from/to/user-tz/DAU',
    expected: {
      controllers: {
        analytics: {
          getDAU: 1,
        },
      },
      middleware: {
        isProjectOwner: 1,
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    namedPath: '/analytics/:project_id/',
    calledPath: '/analytics/proj-id',
    expected: {
      controllers: {
        analytics: {
          getStats: 1,
        },
      },
      middleware: {
        isProjectOwner: 1,
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
];

describe('analytics route unit tests', () => {
  let app;
  let server;

  afterEach(async () => {
    sinon.restore();
    await server.stop();
  });

  tests.forEach((test) => {
    it(`${test.method} ${test.namedPath || test.calledPath}`, async () => {
      const fixture = createFixture();

      ({
        app,
        server,
      } = await GetApp(fixture));

      const response = await request(app)[test.method](test.calledPath);

      checkFixture(fixture, test.expected);
      expect(response.body).to.eql({ done: 'done' });
    });
  });
});
