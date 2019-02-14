const app = require('../app')
const request = require('supertest')
const new_diagram = require('../test/new_diagram.json')
const { pool, hashids } = require('./../services')

jest.setTimeout(10000)

const generateID = () => {
    return "xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0
        const v = c === "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

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

describe('Skill', () => {
  var token = ''
  let diagram_id = generateID()
  let skill_id
  new_diagram.id = diagram_id

  beforeAll(async () => {
    // Get Authentication Token
    await request(app)
    .put('/session')
    .send({user: {
        email: 'tests@getvoiceflow.com',
        password: 'password'
      }
    })
    .expect(200)
    .then(res => {
      token = res.body.token
    })
  })

  describe('Creation', () => {
    let module_id

    beforeAll(async () => {
      try{
        module_id = await getTemplate
      } catch (e) {
        module_id = null
      }
    })

    it('creates skill', done => {
      request(app)
        .post(`/marketplace/template/${hashids.encode(module_id)}/copy`)
        .send({
          name: 'Test',
          locales: ['en-US']
        })
        .set('cookie', 'auth='+token)
        .expect(200)
        .expect(res => {
          if (!('skill_id' in res.body)) throw new Error('missing id')
        })
        .end((err, res) => {
          if (err) throw err
          skill_id = res.body.skill_id
          done()
        })
    })

    it('creates diagram', done => {
      request(app)
        .post('/diagram?new=1')
        .send({
          data: JSON.stringify(new_diagram),
          id: diagram_id,
          skill: skill_id,
          variables: ['path_selector', 'technic_angel']
        })
        .set('cookie', `auth=${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err
          done()
        })
    })
  })

  describe('Retrieval', () => {
    it('gets skills', done => {
      request(app)
        .get('/skills')
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(res => {
          if (res.body.length !== 1 || res.body[0].skill_id !== skill_id)
            throw new Error('incorrect result')
        })
        .end((err, res) => {
          if (err) throw err
          done()
        })
    })

    it('doesn\'t get skills if not authenticated', done => {
      request(app)
        .get('/skills')
        .expect(401)
        .end((err, res) => {
          if (err) throw err
          done()
        })
    })

    it('gets created skill', done => {
      request(app)
        .get(`/skill/${skill_id}`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(res => {
          if (res.body.skill_id !== skill_id) throw new Error('incorrect result')
        })
        .end((err, res) => {
          if (err) throw err
          done()
        })
    })

    it('gets created skill preview', done => {
      request(app)
        .get(`/skill/${skill_id}?preview=1`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(res => {
          if (res.body.skill_id !== skill_id) throw new Error('incorrect result')
          if (!('name' in res.body)) throw new Error('missing name')
          if (!('preview' in res.body)) throw new Error('missing preview')
        })
        .end((err, res) => {
          if (err) throw err
          done()
        })
    })

    it('gets created skill simple', done => {
      request(app)
        .get(`/skill/${skill_id}?simple=1`)
        .set('cookie', 'auth='+token)
        .expect(200)
        .expect(res => {
          if (res.body.skill_id !== skill_id) throw new Error('incorrect result')
          if (!('name' in res.body)) throw new Error('missing name')
          if (!('diagram' in res.body)) throw new Error('missing diagram')
          if ('summary' in res.body) throw new Error('additional data')
        })
        .end((err, res) => {
          if (err) throw err
          done()
        })
    })

    it('doesn\'t get skill if not authenticated', done => {
      request(app)
        .get(`/skill/${skill_id}`)
        .expect(401)
        .end((err, res) => {
          if (err) throw err
          done()
        })
    })

    it('gets created diagram', done => {
      request(app)
        .get(`/diagram/${diagram_id}`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(res => {
          if (res.body.id !== diagram_id) throw new Error('incorrect result')
        })
        .end((err, res) => {
          if (err) throw err
          done()
        })
    })

    it('updates diagram name', done => {
      request(app)
        .post(`/diagram/${diagram_id}/name`)
        .send({name: 'virtual_self'})
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(async (res) => {
          try {
            let diagram_data = (await pool.query(`SELECT * FROM diagrams WHERE id = $1`, [diagram_id])).rows
            expect(diagram_data[0].name).toEqual('virtual_self')
          } catch (err) {
            if(err) throw err
          }
        })
        .end((err, res) => {
          if(err) throw err
          done()
        })
    })

    it('doesn\'t allow empty diagram names', done => {
      request(app)
        .post(`/diagram/${diagram_id}/name`)
        .send({name: ''})
        .set('cookie', `auth=${token}`)
        .expect(401)
        .end((err, res) => {
          if(err) throw err
          done()
        })
    })

    it('gets diagram variables', done => {
      request(app)
      .get(`/diagram/${diagram_id}/variables`)
      .set('cookie', `auth=${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body).toEqual(['path_selector', 'technic_angel'])
      })
      .end((err, res) => {
        if(err) throw err
        done()
      })
    })

    it('doesn\'t get diagram if not authenticated', done => {
      request(app)
        .get(`/diagram/${diagram_id}`)
        .expect(401)
        .end((err, res) => {
          if (err) throw err
          done()
        })
    })

    it('creates a new version', done => {
      request(app)
        .post(`/diagram/${diagram_id}/${skill_id}/publish`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(async (res) => {
          try{
            let version_data = (await pool.query(`SELECT * FROM skill_versions WHERE canonical_skill_id = $1 ORDER BY skill_id ASC`, [hashids.decode(skill_id)[0]])).rows
            let skill_data = (await pool.query(`SELECT * FROM skills WHERE creator_id = 1`)).rows
            // Initial skill won't have default values for used-choices, used_intents, alexa_interfaces, alexa_permissions
            let filtered_fields = ['diagram', 'created', 'live', 'last_save', 'skill_id', 'used_choices', 'used_intents', 'alexa_interfaces', 'alexa_permissions']

            for(let i in skill_data){
              for(let field of filtered_fields){
                delete skill_data[i][field]
              }
            }
            expect(version_data[0]).toEqual({version: null, canonical_skill_id: 2, skill_id: 2, last_save: null})
            expect(version_data[1]).toEqual({version: 1, canonical_skill_id: 2, skill_id: 3, last_save: null})
            expect(skill_data[1]).toEqual(skill_data[2])
          } catch (err) {
            if(err) throw err
          }
        })
        .end((err, res) => {
          if(err) throw err
          done()
        })
    })
  })

  describe('Deletion', () => {
    it('deletes skill', done => {
      request(app)
        .delete(`/skill/${skill_id}`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err
          done()
        })
    })

    it('doesn\'t get deleted skill', done => {
      request(app)
        .get('/skills')
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(res => {
          if (res.body.length !== 0) throw new Error('incorrect result')
        })
        .end((err, res) => {
          if (err) throw err
          done()
        })
    })
  })

  afterAll(async () => {
    await request(app)
    .delete('/session')
    .set('cookie', 'auth='+token)
    .expect(200)
  })
})
