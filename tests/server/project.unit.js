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
    namedPath: '/project/:project_id/version/:version_id',
    calledPath: '/project/some-project/version/some-version',
    expected: {
      controllers: {
        Skill: {
          getSkill: 1,
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
    namedPath: '/projects/:project_id/',
    calledPath: '/projects/some-project/',
    expected: {
      controllers: {
        Project: {
          deleteProject: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verifyProjectAccess: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    namedPath: '/project/:project_id/live_version',
    calledPath: '/project/some-project/live_version',
    expected: {
      controllers: {
        Project: {
          getLiveVersion: 1,
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
    namedPath: '/project/:project_id/dev_version',
    calledPath: '/project/some-project/dev_version',
    expected: {
      controllers: {
        Project: {
          getDevVersion: 1,
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
    namedPath: '/project/:project_id/versions',
    calledPath: '/project/some-project/versions',
    expected: {
      controllers: {
        Project: {
          getProjectVersions: 1,
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
    namedPath: '/project/:project_id/render',
    calledPath: '/project/some-project/render',
    expected: {
      controllers: {
        Project: {
          render: 1,
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
    namedPath: '/project/:project_id/version/:version_id/alexa',
    calledPath: '/project/some-project/version/:version_id/google',
    expected: {
      controllers: {
        Skill: {
          buildGoogleSkill: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'patch',
    namedPath: '/project/:project_id/amzn_id',
    calledPath: '/project/some-project/amzn_id',
    expected: {
      controllers: {
        Project: {
          updateSkillId: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verifyProjectAccess: 1,
        verify: 1,
      },
    },
  },
];

describe('project route unit tests', () => {
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
