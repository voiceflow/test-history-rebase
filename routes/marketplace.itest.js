const app = require('../app')
const request = require('supertest')
const { pool, hashids } = require('./../services')
const { team_hash } = require('./team_util')
const TEAM_ID = team_hash.encode(1)
const getTemplate = new Promise(async (resolve, reject) => {
  try{
    let rows = (await pool.query(`SELECT module_id FROM modules WHERE type = 'TEMPLATES' ORDER BY template_index DESC LIMIT 1`)).rows
    if(rows.length === 0){
      resolve(null)
    } else {
      resolve(rows[0].module_id)
    }
  } catch (err) {
    reject(err)
  }
})

describe('Marketplace', () => {
  let module_id
  let token
  let project_id
  let decoded_project_id
  let skill_id
  let decoded_skill_id
  let module_project_id
  let decoded_module_project_id

  beforeAll(async () => {
    try{
      module_id = await getTemplate
    } catch (e) {
      module_id = null
    }

    // Get Authentication Token
    await request(app)
    .put('/session')
    .send({user: {
        email: 'tests@getvoiceflow.com',
        password: 'password'
      }
    })
    .expect(200)
    .then(async res => {
      token = res.body.token
      // Create a new project
      await request(app)
      .post(`/team/${TEAM_ID}/copy/module/${hashids.encode(module_id)}`)
      .send({
        name: 'Marketplace Test',
        locales: ['en-US']
      })
      .set('cookie', `auth=${token}`)
      .expect(200)
      .expect(res => {
        if (!('skill_id' in res.body)) throw new Error('missing id')
      })
      .then(res => {
        skill_id = res.body.skill_id
        decoded_skill_id = hashids.decode(skill_id)[0]
        project_id = res.body.project_id
        decoded_project_id = hashids.decode(project_id)[0]

        // Saves a module
        request(app)
        .patch(`/marketplace/cert/${project_id}`)
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
          output: '[]'
        })
        .set('cookie', `auth=${token}`)
        .expect(200)
        .then(async res => {
          // Retrieve module_project_id for future use
          try{
            let module_data = (await pool.query(`SELECT * FROM modules WHERE project_id = $1`, [decoded_project_id])).rows
            module_project_id = module_data[0].project_id
            decoded_module_project_id = hashids.decode(module_project_id)[0]
          } catch (err) {
            console.log(err)
          }
        })      
      })
    })

    
  })

  afterAll(async () => {
    await request(app)
    .delete('/session')
    .set('cookie', `auth=${token}`)
    .expect(200)
  })

  describe('Certification', () => {
    it('requests certification', async (done) => {
      request(app)
      .post(`/marketplace/cert/${skill_id}/${project_id}`)
      .set('cookie', `auth=${token}`)
      .expect(200)
      .end(async (err, res) => {
        if (err) throw err
        let request_data = (await pool.query(`
          SELECT * 
          FROM modules
          INNER JOIN skills ON modules.module_project_id = skills.project_id
          WHERE modules.project_id = $1
          ORDER BY skills.skill_id DESC
        `, [decoded_project_id])).rows
        expect(request_data[0].cert_requested).not.toBe(null)
        expect(request_data[0].cert_approved).toEqual(null)
        done()
      })
    })

    it('updates certification', async (done) => {
      request(app)
      .patch(`/marketplace/cert/${project_id}`)
        .send({
          title: 'Awaken',
          descr: 'Bwam',
          creator_id: 1,
          tags: "['GREETINGS']",
          type: 'FLOW',
          overview: 'Cosmic Gate + Jason Ross',
          module_icon: '',
          color: '',
          input: '[]',
          output: '[]'
        })
        .set('cookie', `auth=${token}`)
        .expect(200)
        .then(async res => {
          let update_data = (await pool.query(`
            SELECT title, descr, creator_id, tags, type, overview, module_icon, color, input, output
            FROM modules
            WHERE project_id = $1
          `, [decoded_project_id])).rows[0]
          expect(update_data).toEqual({
            title: 'Awaken',
            descr: 'Bwam',
            creator_id: 1,
            tags: "['GREETINGS']",
            type: 'FLOW',
            overview: 'Cosmic Gate + Jason Ross',
            module_icon: null,
            color: '',
            input: '[]',
            output: '[]'
          })
          done()
        })  
    })
  })
})
