'use strict';

require('dotenv').config({ path: './.env.test' });

const request = require('supertest');

const GetApp = require('../../tests/getAppForTest');

describe('Authentication', async () => {
  let app;
  let server;

  before(async () => {
    ({ app, server } = await GetApp());
  });

  after(async () => {
    if (server) await server.stop();
  });

  it("doesn't accept empty credentials", async () => {
    await request(app)
      .put('/session')
      .send({
        user: {},
      })
      .expect(400);
  });

  it("doesn't accept wrong email", async () => {
    await request(app)
      .put('/session')
      .send({
        user: {
          email: 'wrongemail@getvoiceflow.com',
          password: 'password',
        },
      })
      .expect(400);
  });

  it("doesn't accept wrong password", async () => {
    await request(app)
      .put('/session')
      .send({
        user: {
          email: 'tests@getvoiceflow.com',
          password: 'wrongpassword',
        },
      })
      .expect(400);
  });

  it('authenticates', async () => {
    await request(app)
      .put('/session')
      .send({
        user: {
          email: 'tests@getvoiceflow.com',
          password: 'password',
        },
      })
      .expect(200)
      .then((res) => {
        if (!('token' in res.body)) throw new Error('missing token');
      });
  });
});

describe('Logout', () => {
  let app;
  let server;

  after(async () => {
    if (server) server.stop();
  });

  let token = '';

  before(async () => {
    ({ app, server } = await GetApp());

    await request(app)
      .put('/session')
      .send({
        user: {
          email: 'tests@getvoiceflow.com',
          password: 'password',
        },
      })
      .expect(200)
      .then((res) => {
        if (!('token' in res.body)) throw new Error('missing token');
        ({ token } = res.body);
      });
  });

  it('unauthenticates', (done) => {
    request(app)
      .delete('/session')
      .set('cookie', `auth=${token}`)
      .expect(200)
      .end((err) => {
        if (err) throw err;
        done();
      });
  });

  it('unauthentication does nothing if not authenticated', async () => {
    await request(app)
      .delete('/session')
      .expect(200);
  });
});
