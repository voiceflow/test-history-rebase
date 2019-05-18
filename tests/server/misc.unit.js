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
    calledPath: '/onboard',
    expected: {
      controllers: {
        Onboard: {
          checkIfOnboarded: 1,
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
    calledPath: '/onboard',
    expected: {
      controllers: {
        Onboard: {
          submitOnboardSurvey: 1,
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
    calledPath: '/product_updates',
    expected: {
      controllers: {
        ProductUpdates: {
          getUpdates: 1,
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
    calledPath: '/product_updates',
    expected: {
      controllers: {
        ProductUpdates: {
          createUpdate: 1,
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
    calledPath: '/logs/:skill_id',
    expected: {
      controllers: {
        Logs: {
          getLogsUser: 1,
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
    calledPath: '/admin',
    expected: {
      controllers: {
        utilities: {
          // This is because it falls through the admin middleware
          readBuildFiles: 1,
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
    calledPath: '/admin/foo',
    expected: {
      controllers: {
        utilities: {
          // This is because it falls through the admin middleware
          readBuildFiles: 1,
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
    namedPath: '/codes/:num',
    calledPath: '/codes/foo',
    expected: {
      controllers: {
        Code: {
          endpoint: 1,
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
    namedPath: '/errors/:env',
    calledPath: '/errors/foo',
    expected: {
      controllers: {
        Problem: {
          getErrors: 1,
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
    namedPath: '/errors',
    calledPath: '/errors',
    expected: {
      controllers: {
        Problem: {
          sendError: 1,
        },
      },
      middleware: {
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    calledPath: '/voices',
    expected: {
      controllers: {
        Audio: {
          getVoices: 1,
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
    calledPath: '/audio',
    expected: {
      controllers: {
        Audio: {
          upload: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        uploadAudio: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    calledPath: '/raw_audio',
    expected: {
      controllers: {
        utilities: {
          s3Audio: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        uploadAudio: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    calledPath: '/image/large_icon',
    expected: {
      controllers: {
        utilities: {
          uploadTransformImage: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        uploadResize512: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    calledPath: '/image/small_icon',
    expected: {
      controllers: {
        utilities: {
          uploadTransformImage: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        uploadResize108: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    calledPath: '/image/module_icon',
    expected: {
      controllers: {
        utilities: {
          uploadTransformImage: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        uploadResize40: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    calledPath: '/image/card_icon',
    expected: {
      controllers: {
        utilities: {
          uploadTransformImage: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        uploadResize108: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    calledPath: '/image',
    expected: {
      controllers: {
        utilities: {
          uploadImage: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        uploadAny: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    calledPath: '/concat',
    expected: {
      controllers: {
        Audio: {
          concat: 1,
        },
      },
      middleware: {
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

      ({ app, server } = await GetApp(fixture));

      const response = await request(app)[test.method](test.calledPath);

      checkFixture(fixture, test.expected);
      expect(response.body).to.eql({ done: 'done' });
    });
  });
});
