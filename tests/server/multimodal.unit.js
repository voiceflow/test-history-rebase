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
    calledPath: '/multimodal/displays',
    expected: {
      controllers: {
        Multimodal: {
          getDisplays: 1,
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
    namedPath: '/multimodal/display/:id',
    calledPath: '/multimodal/display/some-id',
    expected: {
      controllers: {
        Multimodal: {
          getDisplay: 1,
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
    calledPath: '/multimodal/display',
    expected: {
      controllers: {
        Multimodal: {
          setDisplay: 1,
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
    namedPath: '/multimodal/display/:id',
    calledPath: '/multimodal/display/some-id',
    expected: {
      controllers: {
        Multimodal: {
          setDisplay: 1,
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
    namedPath: '/multimodal/display/render/:id',
    calledPath: '/multimodal/display/render/some-id',
    expected: {
      controllers: {
        Multimodal: {
          renderDisplay: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
];

describe('multimodal route unit tests', () => {
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
