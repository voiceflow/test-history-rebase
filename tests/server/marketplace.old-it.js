'use strict';

/* eslint-disable */
/* Uncomment out without beta */

require('dotenv').config({ path: './.env.test' });

// const { expect } = require('chai');

const request = require('supertest');
const { pool, hashids } = require('./../../services');
const { team_hash } = require('../../routes/team_util');

const GetApp = require('../getAppForTest');

const TEAM_ID = team_hash.encode(1);
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

describe.skip('Marketplace', () => {
  let moduleId;
  let token;
  let projectId;
  let decodedProjectId;
  let skillId;
  let decodedSkillId;
  let moduleProjectId;
  let decodedModuleProjectId;

  let app;
  let server;

  before(async () => {
    ({ app, server } = await GetApp());

    try {
      moduleId = await getTemplate;
    } catch (e) {
      moduleId = null;
    }

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
      .then(async (res) => {
        token = res.body.token;
        // TODO: remove after beta
        return;
        // Create a new project
        await request(app)
          .post(`/team/${TEAM_ID}/copy/module/${hashids.encode(moduleId)}`)
          .send({
            name: 'Marketplace Test',
            locales: ['en-US'],
          })
          .set('cookie', `auth=${token}`)
          .expect(200)
          .expect((res) => {
            if (!('skillId' in res.body)) throw new Error('missing id');
          })
          .then((res) => {
            skillId = res.body.skill_id;
            decodedSkillId = hashids.decode(skillId)[0];
            projectId = res.body.project_id;
            decodedProjectId = hashids.decode(projectId)[0];

            // Saves a module
            request(app)
              .patch(`/marketplace/cert/${projectId}`)
              .send({
                title: 'Call to Arms',
                descr: 'This is a call to arms',
                creator_id: 1,
                tags: "['ORDERING']",
                type: 'FLOW',
                overview: 'Gareth Emery remixed by Cosmic Gate',
                module_icon: '',
                color: '',
                input: '[]',
                output: '[]',
              })
              .set('cookie', `auth=${token}`)
              .expect(200)
              .then(async (res) => {
                // Retrieve moduleProjectId for future use
                try {
                  const module_data = (await pool.query('SELECT * FROM modules WHERE projectId = $1', [decodedProjectId])).rows;
                  moduleProjectId = module_data[0].project_id;
                  decodedModuleProjectId = hashids.decode(moduleProjectId)[0];
                } catch (err) {
                  console.log(err);
                }
              });
          });
      });
  });

  after(async () => {
    await request(app)
      .delete('/session')
      .set('cookie', `auth=${token}`)
      .expect(200);

    if (server) await server.stop();
  });

  describe('Certification', () => {
    // TODO: remove after beta
    it('passes beta', (done) => {
      done();
    });
    // it('requests certification', async (done) => {
    //   request(app)
    //   .post(`/marketplace/cert/${skillId}/${projectId}`)
    //   .set('cookie', `auth=${token}`)
    //   .expect(200)
    //   .end(async (err, res) => {
    //     if (err) throw err
    //     let request_data = (await pool.query(`
    //       SELECT *
    //       FROM modules
    //       INNER JOIN skills ON modules.moduleProjectId = skills.projectId
    //       WHERE modules.projectId = $1
    //       ORDER BY skills.skillId DESC
    //     `, [decodedProjectId])).rows
    //     expect(request_data[0].cert_requested).not.toBe(null)
    //     expect(request_data[0].cert_approved).to.eql(null)
    //     done()
    //   })
    // })

    // it('updates certification', async (done) => {
    //   request(app)
    //   .patch(`/marketplace/cert/${projectId}`)
    //     .send({
    //       title: 'Awaken',
    //       descr: 'Bwam',
    //       creator_id: 1,
    //       tags: "['GREETINGS']",
    //       type: 'FLOW',
    //       overview: 'Cosmic Gate + Jason Ross',
    //       module_icon: '',
    //       color: '',
    //       input: '[]',
    //       output: '[]'
    //     })
    //     .set('cookie', `auth=${token}`)
    //     .expect(200)
    //     .then(async res => {
    //       let update_data = (await pool.query(`
    //         SELECT title, descr, creator_id, tags, type, overview, module_icon, color, input, output
    //         FROM modules
    //         WHERE projectId = $1
    //       `, [decodedProjectId])).rows[0]
    //       expect(update_data).to.eql({
    //         title: 'Awaken',
    //         descr: 'Bwam',
    //         creator_id: 1,
    //         tags: "['GREETINGS']",
    //         type: 'FLOW',
    //         overview: 'Cosmic Gate + Jason Ross',
    //         module_icon: null,
    //         color: '',
    //         input: '[]',
    //         output: '[]'
    //       })
    //       done()
    //     })
    // })
  });
});
