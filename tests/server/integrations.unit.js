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
    calledPath: '/integrations/get_users',
    expected: {
      controllers: {
        Integrations: {
          getAllUsers: 1,
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
    calledPath: '/integrations/add_user',
    expected: {
      controllers: {
        Integrations: {
          addUser: 1,
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
    calledPath: '/integrations/delete_user',
    expected: {
      controllers: {
        Integrations: {
          deleteUser: 1,
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
    calledPath: '/integrations/google_sheets/spreadsheets',
    expected: {
      controllers: {
        GoogleSheets: {
          getSpreadsheets: 1,
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
    calledPath: '/integrations/google_sheets/spreadsheet_sheets',
    expected: {
      controllers: {
        GoogleSheets: {
          getSpreadsheetSheets: 1,
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
    calledPath: '/integrations/google_sheets/sheet_headers',
    expected: {
      controllers: {
        GoogleSheets: {
          getSheetHeaders: 1,
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
    calledPath: '/integrations/google_sheets/retrieve_data',
    expected: {
      controllers: {
        GoogleSheets: {
          retrieveData: 1,
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
    calledPath: '/integrations/google_sheets/create_data',
    expected: {
      controllers: {
        GoogleSheets: {
          createData: 1,
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
    calledPath: '/integrations/google_sheets/update_data',
    expected: {
      controllers: {
        GoogleSheets: {
          updateData: 1,
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
    calledPath: '/integrations/google_sheets/delete_data',
    expected: {
      controllers: {
        GoogleSheets: {
          deleteData: 1,
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
    calledPath: '/integrations/custom/make_test_api_call',
    expected: {
      controllers: {
        Custom: {
          makeTestAPICall: 1,
        },
      },
      middleware: {
        ensureLoggedIn: 1,
        verify: 1,
      },
    },
  },
];

describe('integrations route unit tests', () => {
  let app;
  let fixture;

  beforeEach(() => sinon.restore());

  tests.forEach((test) => {
    it(`${test.method} ${test.namedPath || test.calledPath}`, async () => {
      fixture = createFixture();
      ({ app } = await GetApp(fixture));

      const response = await request(app)[test.method](test.calledPath);

      checkFixture(fixture, test.expected);
      expect(response.body).to.eql({ done: 'done' });
    });
  });
});
