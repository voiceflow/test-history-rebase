'use strict';

require('dotenv').config({ path: './.env.test' });

const { expect } = require('chai');

const request = require('supertest');
const new_diagram = require('../resources/new_diagram.json');
const { pool, hashids } = require('../../services');
const { team_hash } = require('../../routes/team_util');
const moxios = require('moxios');

const GetApp = require('../../tests/getAppForTest');

const TEAM_ID = team_hash.encode(1);

// jest.setTimeout(100000);

const generateID = () => 'xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = (Math.random() * 16) | 0;
  const v = c === 'x' ? r : (r & 0x3) | 0x8;
  return v.toString(16);
});

const getTemplate = new Promise(async (resolve, reject) => {
  try {
    const { rows } = await pool.query('SELECT module_id FROM modules WHERE type = \'TEMPLATES\' ORDER BY template_index DESC LIMIT 1');
    if (rows.length === 0) {
      resolve(null);
    } else {
      resolve(rows[0].module_id);
    }
  } catch (err) {
    reject(err);
  }
});

describe('Skill', function () {
  this.timeout(10000);

  let token = '';
  const diagram_id = generateID();
  let skill_id;
  let project_id;
  new_diagram.id = diagram_id;

  let accessMock;

  let app;
  let server;

  before(async () => {
    ({ app, server } = await GetApp());

    // Get Authentication Token
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
        token = res.body.token;
      });
  });

  describe('Creation', () => {
    let module_id;

    before(async () => {
      try {
        module_id = await getTemplate;
      } catch (e) {
        module_id = null;
      }
    });

    it('creates skill', (done) => {
      request(app)
        .post(`/team/${TEAM_ID}/copy/module/${hashids.encode(module_id)}`)
        .send({
          name: 'Test',
          locales: ['en-US'],
        })
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect((res) => {
          if (!('skill_id' in res.body)) throw new Error('missing id');
        })
        .end((err, res) => {
          if (err) throw err;
          skill_id = res.body.skill_id;
          project_id = res.body.project_id;
          done();
        });
    });

    // it('creates a new version', done => {
    //   request(app)
    //     // .post(`/diagram/${diagram_id}/${skill_id}/publish`)
    //     .post(`/project/${project_id}/render`)
    //     .set('cookie', `auth=${token}`)
    //     .expect(200)
    //     .expect(async (res) => {
    //       try{
    //         let decoded_skill_id = hashids.decode(skill_id)[0]
    //         let version_data = (await pool.query(`SELECT * FROM skill_versions WHERE canonical_skill_id = $1 ORDER BY skill_id ASC`, [decoded_skill_id])).rows
    //         let skill_data = (await pool.query(`SELECT * FROM skills WHERE creator_id = 1`)).rows
    //         // Initial skill won't have default values for used-choices, used_intents, alexa_interfaces, alexa_permissions
    //         let filtered_fields = ['diagram', 'created', 'live', 'skill_id', 'used_choices', 'used_intents', 'alexa_interfaces', 'alexa_permissions']

    //         for(let i in skill_data){
    //           for(let field of filtered_fields){
    //             delete skill_data[i][field]
    //           }
    //         }
    //         expect(version_data[0]).to.eql({version: null, canonical_skill_id: decoded_skill_id, skill_id: decoded_skill_id, google_versions: null, published_platform: 'alexa'})
    //         expect(version_data[1]).to.eql({version: 1, canonical_skill_id: decoded_skill_id, skill_id: decoded_skill_id + 1, google_versions: null, published_platform: 'alexa'})
    //         expect(skill_data[0]).to.eql(skill_data[1])
    //       } catch (err) {
    //         if(err) throw err
    //       }
    //     })
    //     .end((err, res) => {
    //       if(err) throw err
    //       done()
    //     })
    // })
  });

  describe('Retrieval', () => {
    // it('gets projects, no params', done => {
    //   request(app)
    //     .get('/projects')
    //     .set('cookie', `auth=${token}`)
    //     .expect(200)
    //     .expect(res => {
    //       // One for default template, one for new skill made
    //       expect(res.body.length).to.eql(1)
    //     })
    //     .end((err, res) => {
    //       if (err) throw err
    //       done()
    //     })
    // })

    it('doesn\'t get projects if not authenticated', (done) => {
      request(app)
        .get(`/team/${TEAM_ID}/projects`)
        .expect(401)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('gets created skill', (done) => {
      request(app)
        .get(`/skill/${skill_id}`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect((res) => {
          if (res.body.skill_id !== skill_id) throw new Error('incorrect result');
        })
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('gets created skill preview', (done) => {
      request(app)
        .get(`/skill/${skill_id}?preview=1`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect((res) => {
          if (res.body.skill_id !== skill_id) throw new Error('incorrect result');
          if (!('name' in res.body)) throw new Error('missing name');
          if (!('preview' in res.body)) throw new Error('missing preview');
        })
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    // Also doesn't apply
    // it('gets created skill simple', done => {
    //   request(app)
    //     .get(`/skill/${skill_id}?simple=1`)
    //     .set('cookie', `auth=${token}`)
    //     .expect(200)
    //     .expect(res => {
    //       if (res.body.skill_id !== skill_id) throw new Error('incorrect result')
    //       if (!('name' in res.body)) throw new Error('missing name')
    //       if (!('diagram' in res.body)) throw new Error('missing diagram')
    //       if ('summary' in res.body) throw new Error('additional data')
    //     })
    //     .end((err, res) => {
    //       if (err) throw err
    //       done()
    //     })
    // })

    it('gets skills diagrams', (done) => {
      request(app)
        .get(`/skill/${skill_id}/diagrams`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(async (res) => {
          try {
            const diagram_data = (await pool.query(`SELECT d.id, d.name, d.sub_diagrams, d.module_id FROM diagrams d
                                                  INNER JOIN skills s ON s.skill_id = d.skill_id WHERE d.skill_id = $1`, [hashids.decode(skill_id)[0]])).rows;
            expect(diagram_data).to.eql(res.body);
          } catch (err) {
            throw err;
          }
        })
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('doesn\'t get skill if not authenticated', (done) => {
      request(app)
        .get(`/skill/${skill_id}`)
        .expect(401)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('doesn\'t check the interaction model if no token', (done) => {
      request(app)
        .get('/interaction_model/1/status')
        .expect(401)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('Update', () => {
    // it('builds a skill', done => {
    //   request(app)
    //     .post(`/skill/${skill_id}`)
    //     .set('cookie', `auth=${token}`)
    //     .send({

    //     })
    //     .expect(200)
    //     .end((err, res) => {
    //       if(err) throw err
    //       done()
    //     })
    // })

    beforeEach(() => {
      moxios.install();

      moxios.stubRequest('/say/hello', {
        status: 200,
        responseText: 'hello',
      });
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('updates a skill, defaults', (done) => {
      request(app)
        .patch(`/skill/${skill_id}`)
        .set('cookie', `auth=${token}`)
        .send({})
        .expect(200)
        .expect(async (res) => {
          try {
            const skill_data = (await pool.query('SELECT * FROM skills WHERE skill_id = $1', [hashids.decode(skill_id)[0]])).rows;
            const r = skill_data[0];
            expect(r.locales).to.eql(['en-US']);
            expect(r.fulfillment).to.eql({});
            expect(r.name).to.eql('UNTITLED PROJECT');
          } catch (err) {
            if (err) throw err;
            done();
          }
        })
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('updates a skill, fulfillment', (done) => {
      request(app)
        .patch(`/skill/${skill_id}?fulfillment=1`)
        .set('cookie', `auth=${token}`)
        .send({
          name: 'The Gorge',
          fulfillment: {
            G4cjZLQZaAEn: { slot_config: { '9N4Xdah9UShx': ['level one', 'level 1'] } },
            Q5pVbSymoAjz: { slot_config: { j0Hqhna45404: ['level two', 'level 2', 'open level two'] } },
            uDk5iYNOCm8W: { slot_config: { hjNq9UjHOVI9: [] } }
          },
        })
        .expect(200)
        .expect(async (res) => {
          try {
            const skill_data = (await pool.query('SELECT * FROM skills WHERE skill_id = $1', [hashids.decode(skill_id)[0]])).rows;
            const r = skill_data[0];
            expect(r.fulfillment).to.eql({
              G4cjZLQZaAEn: { slot_config: { '9N4Xdah9UShx': ['level one', 'level 1'] } },
              Q5pVbSymoAjz: { slot_config: { j0Hqhna45404: ['level two', 'level 2', 'open level two'] } },
              uDk5iYNOCm8W: { slot_config: { hjNq9UjHOVI9: [] } }
            });
            expect(r.name).to.eql('UNTITLED PROJECT'); // shouldn't update name
          } catch (err) {
            if (err) throw err;
            done();
          }
        })
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('updates a skill, intents', (done) => {
      request(app)
        .patch(`/skill/${skill_id}?intents=1`)
        .set('cookie', `auth=${token}`)
        .send({
          name: 'The Gorge',
          intents: '[{"name":"intent_one","inputs":[{"slots":["rhuwpeOxWqnw"],"text":"I think it is {{[slot_one].rhuwpeOxWqnw}}"},{"slots":["rhuwpeOxWqnw"],"text":"{{[slot_one].rhuwpeOxWqnw}}"},{"slots":["rhuwpeOxWqnw"],"text":"the answer is {{[slot_one].rhuwpeOxWqnw}}"},{"slots":["rhuwpeOxWqnw"],"text":"answer is {{[slot_one].rhuwpeOxWqnw}}"},{"slots":["rhuwpeOxWqnw"],"text":"{{[slot_one].rhuwpeOxWqnw}} is the answer"}],"key":"c2u2h6a0qfZg","open":true,"_platform":null},{"name":"intent_two","inputs":[{"slots":["Of0UMzUuNKVz"],"text":"{{[slot_two].Of0UMzUuNKVz}}"}],"key":"cyLDdu9cvygL","open":true,"_platform":"alexa"},{"name":"intent_open","inputs":[{"slots":["9N4Xdah9UShx"],"text":"{{[open_lvlone].9N4Xdah9UShx}}"}],"key":"G4cjZLQZaAEn","open":true,"_platform":null},{"name":"intent_lvltwo","inputs":[{"slots":["j0Hqhna45404"],"text":"{{[opne_lvltwo].j0Hqhna45404}}"}],"key":"Q5pVbSymoAjz","open":true,"_platform":null},{"name":"intent_mini","inputs":[{"slots":["hjNq9UjHOVI9"],"text":"{{[slot_mini].hjNq9UjHOVI9}}"}],"key":"uDk5iYNOCm8W","open":true,"_platform":null},{"name":"payment_intent","inputs":[{"slots":["afh8RUpdYt3e"],"text":"{{[payment_slot].afh8RUpdYt3e}}"},{"slots":["afh8RUpdYt3e"],"text":"i want {{[payment_slot].afh8RUpdYt3e}}"},{"slots":["afh8RUpdYt3e"],"text":"purchase {{[payment_slot].afh8RUpdYt3e}}"}],"key":"Nr70HvSr5NTG","open":true,"_platform":null},{"name":"refund","inputs":[{"slots":[],"text":"refund"},{"slots":[],"text":"refund payment"},{"slots":[],"text":"return payment"},{"slots":[],"text":"get a refund"},{"slots":[],"text":"return premium content"}],"key":"WYPBdRB4zctc","open":true,"_platform":null}]',
          slots: '[{"name":"slot_one","inputs":["dinosaur","one","two","three","velociraptor","t-rex","1993","1997","1995","2001","2018","2015"],"type":{"label":"CUSTOM","value":"CUSTOM"},"key":"rhuwpeOxWqnw","open":true},{"name":"slot_two","inputs":[],"type":{"label":"AMAZON.NUMBER","value":"AMAZON.NUMBER"},"key":"Of0UMzUuNKVz","open":true},{"name":"open_lvlone","inputs":["level 1","level one"],"type":{"label":"CUSTOM","value":"CUSTOM"},"key":"9N4Xdah9UShx","open":true},{"name":"opne_lvltwo","inputs":["level 2","level two","level to","level too"],"type":{"label":"CUSTOM","value":"CUSTOM"},"key":"j0Hqhna45404","open":true},{"name":"slot_mini","inputs":["mini games","mini","games"],"type":{"label":"CUSTOM","value":"CUSTOM"},"key":"hjNq9UjHOVI9","open":true},{"name":"payment_slot","inputs":["premium content","premium","purchase","upgrade","upgrade game","purchase upgrade"],"type":{"label":"CUSTOM","value":"CUSTOM"},"key":"afh8RUpdYt3e","open":true}]',
          platform: 'alexa',
        })
        .expect(200)
        .expect(async (res) => {
          try {
            const skill_data = (await pool.query('SELECT * FROM skills WHERE skill_id = $1', [hashids.decode(skill_id)[0]])).rows;
            const r = skill_data[0];
            expect(r.intents).to.eql([{
              name: 'intent_one',
              inputs: [{
                slots: ['rhuwpeOxWqnw'],
                text: 'I think it is {{[slot_one].rhuwpeOxWqnw}}'
              }, {
                slots: ['rhuwpeOxWqnw'],
                text: '{{[slot_one].rhuwpeOxWqnw}}'
              }, {
                slots: ['rhuwpeOxWqnw'],
                text: 'the answer is {{[slot_one].rhuwpeOxWqnw}}'
              }, {
                slots: ['rhuwpeOxWqnw'],
                text: 'answer is {{[slot_one].rhuwpeOxWqnw}}'
              }, {
                slots: ['rhuwpeOxWqnw'],
                text: '{{[slot_one].rhuwpeOxWqnw}} is the answer'
              }],
              key: 'c2u2h6a0qfZg',
              open: true,
              _platform: null,
            }, {
              name: 'intent_two',
              inputs: [{
                slots: ['Of0UMzUuNKVz'],
                text: '{{[slot_two].Of0UMzUuNKVz}}'
              }],
              key: 'cyLDdu9cvygL',
              open: true,
              _platform: 'alexa',
            }, {
              name: 'intent_open',
              inputs: [{
                slots: ['9N4Xdah9UShx'],
                text: '{{[open_lvlone].9N4Xdah9UShx}}'
              }],
              key: 'G4cjZLQZaAEn',
              open: true,
              _platform: null,
            }, {
              name: 'intent_lvltwo',
              inputs: [{
                slots: ['j0Hqhna45404'],
                text: '{{[opne_lvltwo].j0Hqhna45404}}'
              }],
              key: 'Q5pVbSymoAjz',
              open: true,
              _platform: null,
            }, {
              name: 'intent_mini',
              inputs: [{
                slots: ['hjNq9UjHOVI9'],
                text: '{{[slot_mini].hjNq9UjHOVI9}}'
              }],
              key: 'uDk5iYNOCm8W',
              open: true,
              _platform: null,
            }, {
              name: 'payment_intent',
              inputs: [{
                slots: ['afh8RUpdYt3e'],
                text: '{{[payment_slot].afh8RUpdYt3e}}'
              }, {
                slots: ['afh8RUpdYt3e'],
                text: 'i want {{[payment_slot].afh8RUpdYt3e}}'
              }, {
                slots: ['afh8RUpdYt3e'],
                text: 'purchase {{[payment_slot].afh8RUpdYt3e}}'
              }],
              key: 'Nr70HvSr5NTG',
              open: true,
              _platform: null,
            }, {
              name: 'refund',
              inputs: [{
                slots: [],
                text: 'refund'
              }, {
                slots: [],
                text: 'refund payment'
              }, {
                slots: [],
                text: 'return payment'
              }, {
                slots: [],
                text: 'get a refund'
              }, {
                slots: [],
                text: 'return premium content'
              }],
              key: 'WYPBdRB4zctc',
              open: true,
              _platform: null,
            }]);
            expect(r.slots).to.eql([{
              name: 'slot_one',
              inputs: ['dinosaur', 'one', 'two', 'three', 'velociraptor', 't-rex', '1993', '1997', '1995', '2001', '2018', '2015'],
              type: {
                label: 'CUSTOM',
                value: 'CUSTOM'
              },
              key: 'rhuwpeOxWqnw',
              open: true,
            }, {
              name: 'slot_two',
              inputs: [],
              type: {
                label: 'AMAZON.NUMBER',
                value: 'AMAZON.NUMBER'
              },
              key: 'Of0UMzUuNKVz',
              open: true,
            }, {
              name: 'open_lvlone',
              inputs: ['level 1', 'level one'],
              type: {
                label: 'CUSTOM',
                value: 'CUSTOM'
              },
              key: '9N4Xdah9UShx',
              open: true,
            }, {
              name: 'opne_lvltwo',
              inputs: ['level 2', 'level two', 'level to', 'level too'],
              type: {
                label: 'CUSTOM',
                value: 'CUSTOM'
              },
              key: 'j0Hqhna45404',
              open: true,
            }, {
              name: 'slot_mini',
              inputs: ['mini games', 'mini', 'games'],
              type: {
                label: 'CUSTOM',
                value: 'CUSTOM'
              },
              key: 'hjNq9UjHOVI9',
              open: true,
            }, {
              name: 'payment_slot',
              inputs: ['premium content', 'premium', 'purchase', 'upgrade', 'upgrade game', 'purchase upgrade'],
              type: {
                label: 'CUSTOM',
                value: 'CUSTOM'
              },
              key: 'afh8RUpdYt3e',
              open: true,
            }]);
            expect(r.name).to.eql('UNTITLED PROJECT'); // shouldn't update name
          } catch (err) {
            if (err) throw err;
            done();
          }
        })
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('updates a skill, inv_name', (done) => {
      request(app)
        .patch(`/skill/${skill_id}?inv_name=1`)
        .set('cookie', `auth=${token}`)
        .send({
          inv_name: 'Vegas',
        })
        .expect(200)
        .expect(async (res) => {
          try {
            const skill_data = (await pool.query('SELECT * FROM skills WHERE skill_id = $1', [hashids.decode(skill_id)[0]])).rows;
            const r = skill_data[0];
            expect(r.inv_name).to.eql('Vegas');
          } catch (err) {
            if (err) throw err;
            done();
          }
        })
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('updates a skill, settings', (done) => {
      request(app)
        .patch(`/skill/${skill_id}?settings=1`)
        .set('cookie', `auth=${token}`)
        .send({
          name: 'pikachu',
          resume_prompt: '{"voice":"Alexa","content":""}',
          error_prompt: '{"voice":"Alexa","content":""}',
          restart: true,
        })
        .expect(200)
        .expect(async (res) => {
          try {
            const skill_data = (await pool.query('SELECT * FROM skills WHERE skill_id = $1', [hashids.decode(skill_id)[0]])).rows;
            const r = skill_data[0];
            expect(r.name).to.eql('pikachu');
            expect(r.resume_prompt).to.eql({
              voice: 'Alexa',
              content: ''
            });
            expect(r.error_prompt).to.eql({
              voice: 'Alexa',
              content: ''
            });
            expect(r.restart).to.eql(true);
          } catch (err) {
            if (err) throw err;
            done();
          }
        })
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('updates a skill, preview', (done) => {
      request(app)
        .patch(`/skill/${skill_id}?preview=1`)
        .set('cookie', `auth=${token}`)
        .send({
          isPreview: true,
        })
        .expect(200)
        .expect(async (res) => {
          try {
            const skill_data = (await pool.query('SELECT * FROM skills WHERE skill_id = $1', [hashids.decode(skill_id)[0]])).rows;
            const r = skill_data[0];
            expect(r.preview).to.eql(true);
          } catch (err) {
            if (err) throw err;
            done();
          }
        })
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('updates a skill, publish google', (done) => {
      request(app)
        .patch(`/skill/${skill_id}?publish=1&platform=google`)
        .set('cookie', `auth=${token}`)
        .send({
          google_publish_info: {
            project_id: 'triad-stepping-exercise-6ace1',
            locales: [],
            main_locale: 'en',
            uploaded: true,
            google_link_user: '0',
          },
        })
        .expect(200)
        .expect(async (res) => {
          try {
            const skill_data = (await pool.query('SELECT * FROM skills WHERE skill_id = $1', [hashids.decode(skill_id)[0]])).rows;
            const r = skill_data[0];
            expect(r.google_publish_info).to.eql({
              project_id: 'triad-stepping-exercise-6ace1',
              locales: [],
              main_locale: 'en',
              uploaded: true,
              google_link_user: '0',
            });
          } catch (err) {
            if (err) throw err;
            done();
          }
        })
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('updates a skill, publish amazon', (done) => {
      request(app)
        .patch(`/skill/${skill_id}?publish=1&platform=amazon`)
        .set('cookie', `auth=${token}`)
        .send({
          name: 'Tetsuo',
          inv_name: 'Kaneda',
          summary: 'Post apocalyptic battle',
          description: 'Really sugoi',
        })
        .expect(200)
        .expect(async (res) => {
          try {
            const skill_data = (await pool.query('SELECT * FROM skills WHERE skill_id = $1', [hashids.decode(skill_id)[0]])).rows;
            const r = skill_data[0];
            expect(r.name).to.eql('Tetsuo');
            expect(r.inv_name).to.eql('Kaneda');
            expect(r.summary).to.eql('Post apocalyptic battle');
            expect(r.description).to.eql('Really sugoi');
          } catch (err) {
            if (err) throw err;
            done();
          }
        })
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('doesn\'t enable a skill without token', (done) => {
      request(app)
        .put('/interaction_model/1/enable')
        .set('cookie', `auth=${token}`)
        .expect(401)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('Product', () => {
    it('creates a new product', (done) => {
      request(app)
        .post('/skill/product?new=1')
        .send({
          skill: skill_id,
          data: { burritos: 'yummy' },
          name: 'A Long Way From Home',
        })
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(async (res) => {
          try {
            const product_data = (await pool.query('SELECT * FROM products WHERE skill_id = $1 AND name=\'A Long Way From Home\'', [hashids.decode(skill_id)[0]])).rows;
            expect(product_data.length).to.eql(1);
          } catch (err) {
            throw err;
          }
        })
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('gets skills products', (done) => {
      request(app)
        .get(`/skill/${skill_id}/products`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(async (res) => {
          try {
            const product_data = (await pool.query('SELECT id, name, data FROM products WHERE skill_id = $1', [hashids.decode(skill_id)[0]])).rows;
            expect(product_data).to.eql(res.body);
          } catch (err) {
            throw err;
          }
        })
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('gets a product', (done) => {
      request(app)
        .get(`/skill/${skill_id}/product/1`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(async (res) => {
          try {
            const product_data = (await pool.query('SELECT id, name, data FROM products WHERE skill_id = $1 AND id = $2', [hashids.decode(skill_id)[0], 1])).rows;
            expect(product_data).to.eql(res.body);
          } catch (err) {
            throw err;
          }
        })
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('updates an existing product', (done) => {
      request(app)
        .post('/skill/product')
        .send({
          skill: skill_id,
          data: { tacos: 'soft' },
          id: 1,
          name: 'Red Rocks',
        })
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(async (res) => {
          try {
            const product_data = (await pool.query('SELECT * FROM products WHERE id = 1')).rows;
            expect(product_data[0].name).to.eql('Red Rocks');
          } catch (err) {
            throw err;
          }
        })
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    // it('deletes a product from the db', done => {
    //   request(app)
    //     .del(`/skill/${skill_id}/product/1`)
    //     .set('cookie', `auth=${token}`)
    //     .expect(200)
    //     .expect(async res => {
    //       try{
    //         let product_data = (await pool.query(`SELECT * FROM products WHERE skill_id = $1 AND name='A Long Way From Home'`, [hashids.decode(skill_id)[0]])).rows
    //         expect(product_data.length).to.eql(0)
    //       } catch (err) {
    //         throw err
    //       }
    //     })
    //     .end((err, res) => {
    //       if(err) throw err
    //       done()
    //     })
    // })

    it('doesn\'t delete a missing product from the db', (done) => {
      request(app)
        .del(`/skill/${skill_id}/product/0`)
        .set('cookie', `auth=${token}`)
        .expect(404)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('Deletion', () => {
    // it('deletes version', done => {
    //   request(app)
    //     .delete(`/skill/${skill_id}`)
    //     .set('cookie', `auth=${token}`)
    //     .expect(200)
    //     .end((err, res) => {
    //       if (err) throw err
    //       done()
    //     })
    // })

    // This case doesn't apply anymore
    // it('doesn\'t get deleted skill', done => {
    //   request(app)
    //     .get('/projects')
    //     .set('cookie', `auth=${token}`)
    //     .expect(200)
    //     .expect(res => {
    //       console.log(res.body)
    //       if (res.body.length !== 0) throw new Error('incorrect result')
    //     })
    //     .end((err, res) => {
    //       if (err) throw err
    //       done()
    //     })
    // })
  });

  after(async () => {
    await request(app)
      .delete('/session')
      .set('cookie', `auth=${token}`)
      .expect(200);

    if (server) await server.stop();
  });
});
