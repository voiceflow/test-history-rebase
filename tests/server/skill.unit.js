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
    calledPath: '/test/api',
    expected: {
      controllers: {
        test: {
          api: 1,
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
    namedPath: '/skill/:skill_id',
    calledPath: '/skill/skill-id',
    expected: {
      controllers: {
        Skill: {
          getSkill: 1,
        },
      },
      middleware: {
        getProjectFromSkill: 1,
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    namedPath: '/skill/google/:id',
    calledPath: '/skill/google/skill-id',
    expected: {
      controllers: {
        Skill: {
          getGoogleSkill: 1,
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
    namedPath: '/skill/:id/diagrams',
    calledPath: '/skill/some-id/diagrams',
    expected: {
      controllers: {
        Skill: {
          getDiagrams: 1,
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
    namedPath: '/skill/:restore/restore',
    calledPath: '/skill/some-id/restore',
    expected: {
      controllers: {
        Skill: {
          restoreSkillVersion: 1,
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
    namedPath: '/interaction_model/:amzn_id/status',
    calledPath: '/interaction_model/some-id/status',
    expected: {
      controllers: {
        Skill: {
          checkInterationModel: 1,
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
    namedPath: '/interaction_model/:amzn_id/enable',
    calledPath: '/interaction_model/some-id/enable',
    expected: {
      controllers: {
        Skill: {
          enableSkill: 1,
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
    namedPath: '/skill/:id/:pid/:target_creator/copy',
    calledPath: '/skill/skill-id/p-id/creator-id/copy',
    expected: {
      controllers: {
        Skill: {
          copyProduct: 1,
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
    calledPath: '/skill/product',
    expected: {
      controllers: {
        Skill: {
          setProduct: 1,
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
    namedPath: '/skill/:id/products',
    calledPath: '/skill/some-id/products',
    expected: {
      controllers: {
        Skill: {
          getProducts: 1,
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
    namedPath: '/skill/:id/product/:pid',
    calledPath: '/skill/some-id/product/p-id',
    expected: {
      controllers: {
        Skill: {
          getProduct: 1,
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
    namedPath: '/amazon/:id/:amzn_id/certify',
    calledPath: '/amazon/some-id/amzn-id/certify',
    expected: {
      controllers: {
        Skill: {
          certifySkill: 1,
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
    namedPath: '/amazon/:amzn_id/withdraw',
    calledPath: '/amazon/amzn-id/withdraw',
    expected: {
      controllers: {
        Skill: {
          withdrawSkill: 1,
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
    namedPath: '/skill/:id',
    calledPath: '/skill/skill-id',
    expected: {
      controllers: {
        Skill: {
          patchSkill: 1,
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
    namedPath: '/skill/:id/product/:pid',
    calledPath: '/skill/skill-id/product/p-id',
    expected: {
      controllers: {
        Skill: {
          deleteProduct: 1,
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
    namedPath: '/version/:version_id/info',
    calledPath: '/version/version-id/info',
    expected: {
      controllers: {
        Skill: {
          getVersionInfo: 1,
        },
      },
      middleware: {
        ensureAdmin: 1,
        verify: 1,
      },
    },
  },
];

describe('skill route unit tests', () => {
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
