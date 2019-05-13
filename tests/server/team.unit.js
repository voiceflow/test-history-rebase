'use strict';

const { expect } = require('chai');
const request = require('supertest');

const _ = require('lodash');
const sinon = require('sinon');
const GetApp = require('../getAppForTest');

const { createFixture, checkFixture } = require('./fixture');

const tests = [
  {
    method: 'post',
    calledPath: '/team',
    expected: {
      controllers: {
        Team: {
          addTeam: 1,
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
    calledPath: '/team/checkout',
    expected: {
      controllers: {
        Team: {
          checkout: 1,
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
    calledPath: '/teams',
    expected: {
      controllers: {
        Team: {
          getTeams: 1,
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
    namedPath: '/teams/:creator_id',
    calledPath: '/teams/creator-id',
    expected: {
      controllers: {
        Team: {
          getTeams: 1,
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
    namedPath: '/team/:team_id/invoice',
    calledPath: '/team/team-id/invoice',
    expected: {
      controllers: {
        Team: {
          getInvoice: 1,
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
    namedPath: '/team/:team_id/source',
    calledPath: '/team/team-id/source',
    expected: {
      controllers: {
        Team: {
          getSource: 1,
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
    namedPath: '/team/:team_id/source',
    calledPath: '/team/team-id/source',
    expected: {
      controllers: {
        Team: {
          updateSource: 1,
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
    namedPath: '/team/invite/:invite_code',
    calledPath: '/team/invite/invite-code',
    expected: {
      controllers: {
        Team: {
          checkInvite: 1,
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
    namedPath: '/team/:team_id/projects',
    calledPath: '/team/team-id/projects',
    expected: {
      controllers: {
        Team: {
          getProjects: 1,
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
    namedPath: '/team/:team_id/members',
    calledPath: '/team/team-id/members',
    expected: {
      controllers: {
        Team: {
          getMembers: 1,
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
    namedPath: '/team/:team_id/members',
    calledPath: '/team/team-id/members',
    expected: {
      controllers: {
        Team: {
          updateMembers: 1,
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
    namedPath: '/team/:team_id/copy/module/:module_id',
    calledPath: '/team/team-id/copy/module/module-id',
    expected: {
      controllers: {
        Marketplace: {
          copyDefaultTemplate: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verifyTeam: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'delete',
    namedPath: '/team/:team_id',
    calledPath: '/team/team-id',
    expected: {
      controllers: {
        Team: {
          deleteTeam: 1,
        },
      },
      middleware: {
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    namedPath: '/team/:team_id/picture',
    calledPath: '/team/team-id/picture',
    expected: {
      controllers: {
        Team: {
          updatePicture: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        uploadResize512: 1,
        verifyTeam: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    namedPath: '/version/:version_id/copy/team/:team_id',
    calledPath: '/version/version-id/copy/team/team-id',
    expected: {
      controllers: {
        utilities: {
          teamCopySkill: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verifyTeam: 1,
        verify: 1,
      },
    },
  },
  {
    method: 'post',
    namedPath: '/customer/webhook',
    calledPath: '/customer/webhook',
    expected: {
      controllers: {
        Team: {
          webhook: 1,
        },
      },
      middleware: {
        verify: 1,
      },
    },
  },
];

describe('team route unit tests', () => {
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
