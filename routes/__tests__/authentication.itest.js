const request = require('supertest');
const app = require('../../app');

describe('Authentication', () => {
  describe('Login', () => {
    it('doesn\'t accept empty credentials', async () => {
      await request(app)
        .put('/session')
        .send({
          user: {},
        })
        .expect(400);
    });

    it('doesn\'t accept wrong email', async () => {
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

    it('doesn\'t accept wrong password', async () => {
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

  it('unauthentication does nothing if not authenticated', async () => {
    await request(app)
      .delete('/session')
      .expect(200);
  });

  describe('Logout', () => {
    let token = '';

    beforeAll(async () => {
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
          token = res.body.token;
        });
    });

    it('unauthenticates', (done) => {
      request(app)
        .delete('/session')
        .set('cookie', `auth=${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });
  });
});
