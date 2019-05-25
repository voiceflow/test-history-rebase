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
    calledPath: '/user',
    expected: {
      controllers: {
        Authentication: {
          getUser: 1,
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
    calledPath: '/user',
    expected: {
      controllers: {
        Authentication: {
          putUser: 1,
        },
      },
      middleware: {
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    calledPath: '/user/reset',
    expected: {
      controllers: {
        Authentication: {
          resetPasswordEmail: 1,
        },
      },
      middleware: {
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    calledPath: '/user/reset/:token',
    expected: {
      controllers: {
        Authentication: {
          checkReset: 1,
        },
      },
      middleware: {
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    calledPath: '/user/reset/:token',
    expected: {
      controllers: {
        Authentication: {
          resetPassword: 1,
        },
      },
      middleware: {
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    calledPath: '/user/profile/picture',
    expected: {
      controllers: {
        Authentication: {
          updateProfilePicture: 1,
        },
      },
      middleware: {
        uploadResize512: 1,
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    namedPath: '/decode/:id',
    calledPath: '/decode/foo',
    expected: {
      controllers: {
        decode: {
          decodeId: 1,
        },
      },
      middleware: {
        ensureAdmin: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    namedPath: '/encode/:id',
    calledPath: '/encode/foo',
    expected: {
      controllers: {
        decode: {
          encodeId: 1,
        },
      },
      middleware: {
        ensureAdmin: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    calledPath: '/creator/privacy_policy',
    expected: {
      controllers: {
        utilities: {
          policy: 1,
        },
      },
      middleware: {
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    calledPath: '/creator/terms',
    expected: {
      controllers: {
        utilities: {
          terms: 1,
        },
      },
      middleware: {
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    namedPath: '/link_account/template/:skill_id',
    calledPath: '/link_account/template/skill1',
    expected: {
      controllers: {
        linkAccount: {
          getTemplate: 1,
        },
      },
      middleware: {
        hasSkillAccess: 1,
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    namedPath: '/link_account/template/:skill_id',
    calledPath: '/link_account/template/skill1',
    expected: {
      controllers: {
        linkAccount: {
          setTemplate: 1,
        },
      },
      middleware: {
        hasSkillAccess: 1,
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    namedPath: '/user/:creator_id/projects',
    calledPath: '/user/some-id/projects',
    expected: {
      controllers: {
        Project: {
          getUserProjects: 1,
        },
      },
      middleware: {
        ensureAdmin: 1,
        verify: 1,
      },
    },
  },
];

describe('user route unit tests', () => {
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
