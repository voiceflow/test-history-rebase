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
    calledPath: '/marketplace/default_templates',
    expected: {
      controllers: {
        Marketplace: {
          getDefaultTemplates: 1,
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
    namedPath: '/marketplace/template/:module_id/copy',
    calledPath: '/marketplace/template/module-id/copy',
    expected: {
      controllers: {
        Marketplace: {
          copyDefaultTemplate: 1,
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
    calledPath: '/marketplace/featured',
    expected: {
      controllers: {
        Marketplace: {
          getFeaturedModules: 1,
        },
      },
      middleware: {
        ensureBeta: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    calledPath: '/marketplace/cert/pending',
    expected: {
      controllers: {
        Marketplace: {
          getPendingModules: 1,
        },
      },
      middleware: {
        ensureAdmin: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    namedPath: '/marketplace/user_module/:project_id/:module_id',
    calledPath: '/marketplace/user_module/proj-id/module-id',
    expected: {
      controllers: {
        Marketplace: {
          giveAccess: 1,
        },
      },
      middleware: {
        ensureBeta: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    namedPath: '/marketplace/user_module/:project_id/:module_id',
    calledPath: '/marketplace/user_module/proj-id/module-id',
    expected: {
      controllers: {
        Marketplace: {
          checkConflicts: 1,
        },
      },
      middleware: {
        ensureBeta: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'delete',
    namedPath: '/marketplace/user_module/:project_id/:module_id',
    calledPath: '/marketplace/user_module/proj-id/module-id',
    expected: {
      controllers: {
        Marketplace: {
          removeAccess: 1,
        },
      },
      middleware: {
        ensureBeta: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    namedPath: '/marketplace/user_module/:project_id/',
    calledPath: '/marketplace/user_module/proj-id/',
    expected: {
      controllers: {
        Marketplace: {
          getUserModules: 1,
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
    namedPath: '/marketplace/cert/status/:project_id/',
    calledPath: '/marketplace/cert/status/proj-id/',
    expected: {
      controllers: {
        Marketplace: {
          certStatus: 1,
        },
      },
      middleware: {
        ensureBeta: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    namedPath: '/marketplace/cert/:skill_id/:project_id/',
    calledPath: '/marketplace/cert/skill-id/proj-id/',
    expected: {
      controllers: {
        Marketplace: {
          requestCertification: 1,
        },
      },
      middleware: {
        ensureBeta: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'delete',
    namedPath: '/marketplace/cert/:skill_id/:project_id/',
    calledPath: '/marketplace/cert/skill-id/proj-id/',
    expected: {
      controllers: {
        Marketplace: {
          cancelCertification: 1,
        },
      },
      middleware: {
        ensureBeta: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    namedPath: '/marketplace/cert/:project_id/',
    calledPath: '/marketplace/cert/proj-id/',
    expected: {
      controllers: {
        Marketplace: {
          getCertModule: 1,
        },
      },
      middleware: {
        ensureBeta: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'put',
    namedPath: '/marketplace/cert/:project_id/',
    calledPath: '/marketplace/cert/proj-id/',
    expected: {
      controllers: {
        Marketplace: {
          giveCertification: 1,
        },
      },
      middleware: {
        ensureAdmin: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'patch',
    namedPath: '/marketplace/cert/:project_id/',
    calledPath: '/marketplace/cert/proj-id/',
    expected: {
      controllers: {
        Marketplace: {
          saveCertification: 1,
        },
      },
      middleware: {
        ensureBeta: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'get',
    namedPath: '/marketplace/template/:module_id/',
    calledPath: '/marketplace/template/module-id/',
    expected: {
      controllers: {
        Marketplace: {
          retrieveTemplate: 1,
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
    calledPath: '/marketplace/default_templates',
    expected: {
      controllers: {
        Marketplace: {
          getDefaultTemplates: 1,
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
    calledPath: '/marketplace/initial_template',
    expected: {
      controllers: {
        Marketplace: {
          getInitialTemplate: 1,
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
    namedPath: '/marketplace/:project_id/',
    calledPath: '/marketplace/proj-id/',
    expected: {
      controllers: {
        Marketplace: {
          getModules: 1,
        },
      },
      middleware: {
        ensureBeta: 1,
        verify: 1,
      },
    },
  },
  // This is broken in the code
  // {
  //   method: 'get',
  //   namedPath: '/marketplace/:module_id/',
  //   calledPath: '/marketplace/mod-id/',
  //   expected: {
  //     controllers: {
  //       Marketplace: {
  //         getModule: 1,
  //       },
  //     },
  //     middleware: {
  //       ensureBeta: 1,
  //       verify: 1,
  //     },
  //   },
  // },
  {
    method: 'get',
    namedPath: '/marketplace/diagram/:module_id/',
    calledPath: '/marketplace/diagram/mod-id/',
    expected: {
      controllers: {
        Marketplace: {
          getModuleDiagram: 1,
        },
      },
      middleware: {
        ensureBeta: 1,
        verify: 1,
      },
    },
  },
];

describe('marketplace route unit tests', () => {
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
