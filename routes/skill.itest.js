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
        .set('cookie', `auth=${token}`)
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

    it('creates a new product', done => {
      request(app)
        .post(`/skill/product?new=1`)
        .send({
          skill: skill_id,
          data: {burritos: 'yummy'},
          name: 'A Long Way From Home'
        })
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(async res => {
          try{
            let product_data = (await pool.query(`SELECT * FROM products WHERE skill_id = $1 AND name='A Long Way From Home'`, [hashids.decode(skill_id)[0]])).rows
            expect(product_data.length).toEqual(1)
          } catch (err) {
            throw err
          }
        })
        .end((err, res) => {
          if(err) throw err
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
            let decoded_skill_id = hashids.decode(skill_id)[0]
            let version_data = (await pool.query(`SELECT * FROM skill_versions WHERE canonical_skill_id = $1 ORDER BY skill_id ASC`, [decoded_skill_id])).rows
            let skill_data = (await pool.query(`SELECT * FROM skills WHERE creator_id = 1`)).rows
            // Initial skill won't have default values for used-choices, used_intents, alexa_interfaces, alexa_permissions
            let filtered_fields = ['diagram', 'created', 'live', 'last_save', 'skill_id', 'used_choices', 'used_intents', 'alexa_interfaces', 'alexa_permissions']

            for(let i in skill_data){
              for(let field of filtered_fields){
                delete skill_data[i][field]
              }
            }
            
            expect(version_data[0]).toEqual({version: null, canonical_skill_id: decoded_skill_id, skill_id: decoded_skill_id, last_save: null})
            expect(version_data[1]).toEqual({version: 1, canonical_skill_id: decoded_skill_id, skill_id: decoded_skill_id + 1, last_save: null})
            expect(skill_data[0]).toEqual(skill_data[1])
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

  describe('Retrieval', () => {
    it('gets skills, no params', done => {
      request(app)
        .get('/skills')
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(res => {
          // One for default template, one for new skill made
          expect(res.body.length).toEqual(1)
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
        .set('cookie', `auth=${token}`)
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

    it('gets skills diagrams', done => {
      request(app)
        .get(`/skill/${skill_id}/diagrams`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(async res => {
          try{
            let diagram_data = (await pool.query(`SELECT d.id, d.name, d.sub_diagrams FROM diagrams d
                                                  INNER JOIN skills s ON s.skill_id = d.skill_id WHERE d.skill_id = $1`, [hashids.decode(skill_id)[0]])).rows
            expect(diagram_data).toEqual(res.body)
          } catch (err) {
            throw err
          }
        })
        .end((err, res) => {
          if(err) throw err
          done()
        })
    })

    it('gets skills products', done => {
      request(app)
        .get(`/skill/${skill_id}/products`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(async res => {
          try{
            let product_data = (await pool.query(`SELECT id, name, data FROM products WHERE skill_id = $1`, [hashids.decode(skill_id)[0]])).rows
            expect(product_data).toEqual(res.body)
          } catch (err) {
            throw err
          }
        })
        .end((err, res) => {
          if(err) throw err
          done()
        })
    })

    it('gets a product', done => {
      request(app)
        .get(`/skill/${skill_id}/product/1`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(async res => {
          try{
            let product_data = (await pool.query(`SELECT id, name, data FROM products WHERE skill_id = $1 AND id = $2`, [hashids.decode(skill_id)[0], 1])).rows
            expect(product_data).toEqual(res.body)
          } catch (err) {
            throw err
          }
        })
        .end((err, res) => {
          if(err) throw err
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
  })

  describe('Update', () => {
    it('updates an existing product', done => {
      request(app)
        .post(`/skill/product`)
        .send({
          skill: skill_id,
          data: {tacos: 'soft'},
          id: 1,
          name: 'Red Rocks'
        })
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(async res => {
          try{
            let product_data = (await pool.query(`SELECT * FROM products WHERE id = 1`)).rows
            expect(product_data[0].name).toEqual('Red Rocks')
          } catch (err) {
            throw err
          }
        })
        .end((err, res) => {
          if(err) throw err
          done()
        })
    })

    it('tries to update a skill without body', done => {
      request(app)
        .patch(`/skill/${skill_id}`)
        .set('cookie', `auth=${token}`)
        .expect(401)
        .end((err, res) => {
          if(err) throw err
          done()
        })
    })

    it('updates a skill, defaults', done => {
      request(app)
        .patch(`/skill/${skill_id}`)
        .set('cookie', `auth=${token}`)
        .send({})
        .expect(200)
        .expect(async res => {
          try { 
            let skill_data = (await pool.query(`SELECT * FROM skills WHERE skill_id = $1`, [hashids.decode(skill_id)[0]])).rows
            let r = skill_data[0]
            expect(r.locales).toEqual('["en-US"]')
            expect(r.fulfillment).toEqual('{}')
            expect(r.name).toEqual('UNTITLED PROJECT')
          } catch (err) {
            if(err) throw err
            done()
          }
        })
        .end((err, res) => {
          if(err) throw err
          done()
        })
    })

    // it('updates a skill', done => {
    //   request(app)
    //     .patch(`/skill/${skill_id}`)
    //     .set('cookie', `auth=${token}`)
    //     .send()
    //     .expect(200)
    //     .expect(async res => {

    //     })
    //     .end((err, res) => {
    //       if(err) throw err
    //       done()
    //     })
    // })
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

    // it('deletes a product from the db', done => {
    //   request(app)
    //     .del(`/skill/${skill_id}/product/1`)
    //     .set('cookie', `auth=${token}`)
    //     .expect(200)
    //     .expect(async res => {
    //       try{
    //         let product_data = (await pool.query(`SELECT * FROM products WHERE skill_id = $1 AND name='A Long Way From Home'`, [hashids.decode(skill_id)[0]])).rows
    //         expect(product_data.length).toEqual(0)
    //       } catch (err) {
    //         throw err
    //       }
    //     })
    //     .end((err, res) => {
    //       if(err) throw err
    //       done()
    //     })
    // })

    it('doesn\'t delete a missing product from the db', done => {
      request(app)
        .del(`/skill/${skill_id}/product/0`)
        .set('cookie', `auth=${token}`)
        .expect(412)
        .end((err, res) => {
          if(err) throw err
          done()
        })
    })
  })

  afterAll(async () => {
    await request(app)
    .delete('/session')
    .set('cookie', `auth=${token}`)
    .expect(200)
  })
})
