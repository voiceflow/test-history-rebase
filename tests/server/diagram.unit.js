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
    namedPath: '/diagram/:id',
    calledPath: '/diagram/dia-id',
    expected: {
      controllers: {
        Diagram: {
          getDiagram: 1,
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
    namedPath: '/diagram/:id/variables',
    calledPath: '/diagram/dia-id/variables',
    expected: {
      controllers: {
        Diagram: {
          getVariables: 1,
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
    namedPath: '/diagram/:id/:skill-id/rerender',
    calledPath: '/diagram/dia-id/skill-id/rerender',
    expected: {
      controllers: {
        Diagram: {
          rerenderDiagram: 1,
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
    namedPath: '/diagram/:id/',
    calledPath: '/diagram/dia-id/',
    expected: {
      controllers: {
        Diagram: {
          deleteDiagram: 1,
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
    calledPath: '/diagram/',
    expected: {
      controllers: {
        Diagram: {
          setDiagram: 1,
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
    namedPath: '/diagram/:id/name',
    calledPath: '/diagram/dia-id/name',
    expected: {
      controllers: {
        Diagram: {
          updateName: 1,
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
    namedPath: '/diagram/:diagram_id/test/publish',
    calledPath: '/diagram/dia-id/test/publish',
    expected: {
      controllers: {
        Diagram: {
          publishTest: 1,
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
    namedPath: '/diagram/copy/:diagram_id/',
    calledPath: '/diagram/copy/dia-id/',
    expected: {
      controllers: {
        Diagram: {
          copyDiagram: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
];

describe('diagram route unit tests', () => {
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
