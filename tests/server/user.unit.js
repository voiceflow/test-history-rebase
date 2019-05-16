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
    method: 'get',
    calledPath: '/user/verify/:token',
    expected: {
      controllers: {
        Authentication: {
          verifyUser: 1,
        },
      },
      middleware: {
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    calledPath: '/user/reset/password',
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
        Decode: {
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
        Decode: {
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
        LinkAccount: {
          getTemplate: 1,
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
    namedPath: '/link_account/template/:skill_id',
    calledPath: '/link_account/template/skill1',
    expected: {
      controllers: {
        LinkAccount: {
          setTemplate: 1,
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
    calledPath: '/email/templates',
    expected: {
      controllers: {
        Email: {
          getTemplates: 1,
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
    namedPath: '/email/template/:id',
    calledPath: '/email/template/some-id',
    expected: {
      controllers: {
        Email: {
          getTemplate: 1,
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
    calledPath: '/email/template',
    expected: {
      controllers: {
        Email: {
          setTemplate: 1,
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
    namedPath: '/email/template/:id',
    calledPath: '/email/template/some-id',
    expected: {
      controllers: {
        Email: {
          setTemplate: 1,
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
    namedPath: '/email/template/:id',
    calledPath: '/email/template/some-id',
    expected: {
      controllers: {
        Email: {
          deleteTemplate: 1,
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
