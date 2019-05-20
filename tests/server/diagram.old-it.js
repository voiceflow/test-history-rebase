'use strict';

require('dotenv').config({ path: './.env.test' });

const { expect } = require('chai');
const request = require('supertest');

const randomstring = require('randomstring');

const newDiagram = require('../resources/new_diagram.json');
const { pool, hashids } = require('../../services');
const { team_hash } = require('../../routes/team_util');

const GetApp = require('../../tests/getAppForTest');

const TEAM_ID = team_hash.encode(1);

const generateID = () =>
  randomstring.generate({
    charset: 'alphanumeric',
    capitalization: 'lowercase',
    length: 32,
  });

const getTemplate = new Promise(async (resolve, reject) => {
  try {
    const { rows } = await pool.query("SELECT module_id FROM modules WHERE type = 'TEMPLATES' ORDER BY template_index DESC LIMIT 1");
    if (rows.length === 0) {
      resolve(null);
    } else {
      resolve(rows[0].module_id);
    }
  } catch (err) {
    reject(err);
  }
});

describe('Diagram', function() {
  this.timeout(10000);

  let token = '';
  const diagramId = generateID();
  let moduleId;
  let skillId;

  let app;
  let server;

  before(async () => {
    ({ app, server } = await GetApp());

    // Get auth token
    await request(app)
      .put('/session')
      .send({
        user: {
          email: 'tests@getvoiceflow.com',
          password: 'password',
        },
      })
      .expect(200)
      .then(async (res) => {
        ({ token } = res.body);

        try {
          moduleId = await getTemplate;
          await request(app)
            .post(`/team/${TEAM_ID}/copy/module/${hashids.encode(moduleId)}`)
            .send({
              name: 'Test',
              locales: ['en-US'],
            })
            .set('cookie', `auth=${token}`)
            .then(() => {
              skillId = res.body.skill_id;
            });
        } catch (e) {
          moduleId = null;
        }
      });
  });

  after(async () => {
    try {
      await request(app)
        .delete(`/skill/${skillId}`)
        .then();
      if (server) await server.stop();
    } catch (err) {
      throw err;
    }
  });

  describe('Creation', () => {
    it('creates diagram', (done) => {
      request(app)
        .post('/diagram?new=1')
        .send({
          data: JSON.stringify(newDiagram),
          id: diagramId,
          skill: skillId,
          variables: ['path_selector', 'technic_angel'],
        })
        .set('cookie', `auth=${token}`)
        .expect(200)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('copies diagram', (done) => {
      request(app)
        .get(`/diagram/copy/${diagramId}`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .end(async (err) => {
          if (err) throw err;
          const diagramData = (await pool.query('SELECT * FROM diagrams WHERE skillId = $1', [hashids.decode(skillId)[0]])).rows;
          expect(diagramData.length).to.eql(3);
          done();
        });
    });

    it("doesn't copy missing diagram", (done) => {
      request(app)
        .get('/diagram/copy/123242')
        .set('cookie', `auth=${token}`)
        .expect(404)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('Retrieval', () => {
    it('gets created diagram', (done) => {
      request(app)
        .get(`/diagram/${diagramId}`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect((res) => {
          if (res.body.id !== diagramId) throw new Error('incorrect result');
        })
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('gets diagram variables', (done) => {
      request(app)
        .get(`/diagram/${diagramId}/variables`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.eql(['path_selector', 'technic_angel']);
        })
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it("doesn't get diagram if not authenticated", (done) => {
      request(app)
        .get(`/diagram/${diagramId}`)
        .expect(401)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('Update', () => {
    it('updates diagram name', (done) => {
      request(app)
        .post(`/diagram/${diagramId}/name`)
        .send({ name: 'virtual_self' })
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(async () => {
          try {
            const diagramData = (await pool.query('SELECT * FROM diagrams WHERE id = $1', [diagramId])).rows;
            expect(diagramData[0].name).to.eql('virtual_self');
          } catch (err) {
            if (err) throw err;
          }
        })
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it("doesn't allow empty diagram names", (done) => {
      request(app)
        .post(`/diagram/${diagramId}/name`)
        .send({ name: '' })
        .set('cookie', `auth=${token}`)
        .expect(401)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('updates diagram', (done) => {
      newDiagram.x = 0;
      newDiagram.y = 0;
      request(app)
        .post('/diagram')
        .send({
          data: JSON.stringify(newDiagram),
          id: diagramId,
          skill: skillId,
          variables: ['path_selector', 'technic_angel'],
        })
        .set('cookie', `auth=${token}`)
        .expect(200)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    // it('publishes test version', done => {
    //   request(app)
    //     .post(`/diagram/${diagramId}/test/publish`)
    //     .send({
    //       slots: [ { name: 'slot_one',
    //         inputs: [ 'dog', 'cow', 'cat', 'horse' ],
    //         type: { label: 'CUSTOM', value: 'CUSTOM' },
    //         key: 'sYCbueQF1wRW',
    //         open: true } ],
    //       intents: [ { name: 'intent_one',
    //         inputs: [ [Object], [Object], [Object] ],
    //         key: '1yWbnwrRcYIo',
    //         open: true } ]
    //     })
    //     .set('cookie', `auth=${token}`)
    //     .expect(200)
    //     .end((err) => {
    //       console.log('url', diagramId)
    //       if(err) throw err
    //       done()
    //     })
    // })

    it("doesn't publish without diagram id", (done) => {
      request(app)
        .post('/diagram/youmakemesosad/test/publish')
        .expect(401)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('rerenders the diagram', (done) => {
      request(app)
        .post(`/diagram/${diagramId}/${skillId}/rerender`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('Delete', () => {
    it('deletes diagram', (done) => {
      request(app)
        .delete(`/diagram/${diagramId}`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(async () => {
          try {
            const diagramData = (await pool.query('SELECT * FROM diagrams WHERE id = $1', [diagramId])).rows;
            expect(diagramData.length).to.eql(0);
          } catch (err) {
            if (err) throw err;
          }
        })
        .end(async (err) => {
          if (err) throw err;
          done();
        });
    });

    it("doesn't delete when diagram dne", (done) => {
      request(app)
        .delete('/diagram/12323')
        .set('cookie', `auth=${token}`)
        .expect(403)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });
});
