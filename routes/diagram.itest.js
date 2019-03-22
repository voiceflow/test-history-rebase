const app = require('../app')
const request = require('supertest')
const new_diagram = require('../test/new_diagram.json')
const { pool, hashids } = require('./../services')
const axios = require('axios')

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

describe('Diagram', () => {
  let token = ''
  let diagram_id = generateID() 
  let module_id
  let skill_id
  
  beforeAll(async () => {
    // Get auth token
    await request(app)
    .put('/session')
    .send({user: {
      email: 'tests@getvoiceflow.com',
      password: 'password'
    }})
    .expect(200)
    .then(async res => {
      token = res.body.token
      try{
        module_id = await getTemplate
        await request(app)
          .post(`/marketplace/template/${hashids.encode(module_id)}/copy`)
          .send({
            name: 'Test', 
            locales: ['en-US']
          })
          .set('cookie', `auth=${token}`)
          .then(res => {
            skill_id = res.body.skill_id
          })
      } catch (e) {
        module_id = null
      }
    })
  })

  afterAll(async () => {
    try {
      await request(app).delete(`/skill/${skill_id}`)
    } catch (err) {
      throw err
    }
  })

  describe('Creation', () => {
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

    it('copies diagram', done => {
      request(app)
        .get(`/diagram/copy/${diagram_id}`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .end(async (err, res) => {
          if(err) throw err
          let diagram_data = (await pool.query(`SELECT * FROM diagrams WHERE skill_id = $1`, [hashids.decode(skill_id)[0]])).rows
          expect(diagram_data.length).toEqual(3)
          done()
        })
    })

    it('doesn\'t copy missing diagram', done => {
      request(app)
      .get(`/diagram/copy/123242`)
      .set('cookie', `auth=${token}`)
      .expect(404)
      .end((err, res) => {
        if(err) throw err
        done()
      })
    })
  })

  describe('Retrieval', () => {
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

    it('gets diagram variables', done => {
      request(app)
        .get(`/diagram/${diagram_id}/variables`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toEqual(['path_selector', 'technic_angel'])
        })
        .end((err, res) => {
          if (err) throw err
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
  })

  describe('Update', () => {
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

    it('updates diagram', done => {
      new_diagram.x = 0
      new_diagram.y = 0
      request(app)
        .post('/diagram')
        .send({
          data: JSON.stringify(new_diagram),
          id: diagram_id,
          skill: skill_id,
          variables: ['path_selector', 'technic_angel']
        })
        .set('cookie', `auth=${token}`)
        .expect(200)
        .end((err, res) => {
          if(err) throw err
          done()
        })
    })

    it('publishes test version', done => {
      request(app)
        .post(`/diagram/${diagram_id}/test/publish`)
        .send({
          slots: [ { name: 'slot_one',
            inputs: [ 'dog', 'cow', 'cat', 'horse' ],
            type: { label: 'CUSTOM', value: 'CUSTOM' },
            key: 'sYCbueQF1wRW',
            open: true } ],
          intents: [ { name: 'intent_one',
            inputs: [ [Object], [Object], [Object] ],
            key: '1yWbnwrRcYIo',
            open: true } ]
        })
        .set('cookie', `auth=${token}`)
        .expect(200)
        .end((err, res) => {
          console.log('url', diagram_id)
          if(err) throw err
          done()
        })
    })

    it('doesn\'t publish without diagram id', done => {
      request(app)
        .post(`/diagram/youmakemesosad/test/publish`)
        .expect(401)
        .end((err, res) => {
          if(err) throw err
          done()
        })
    })

    it('rerenders the diagram', done => {
      request(app)
        .post(`/diagram/${diagram_id}/${skill_id}/rerender`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .end((err, res) => {
          if(err) throw err
          done()
        })
    })
  })

  describe('Delete', () => {
    it('deletes diagram', done => {
      request(app)
        .delete(`/diagram/${diagram_id}`)
        .set('cookie', `auth=${token}`)
        .expect(200)
        .expect(async (res) => {
          try {
            let diagram_data = (await pool.query(`SELECT * FROM diagrams WHERE id = $1`, [diagram_id])).rows
            expect(diagram_data.length).toEqual(0)
          } catch (err) {
            if(err) throw err
          }
        })
        .end(async (err, res) => {
          if (err) throw err
          done()
        })
    })

    it('doesn\t delete when diagram dne', done => {
      request(app)
      .delete(`/diagram/12323`)
      .set('cookie', `auth=${token}`)
      .expect(404)
      .end((err, res) => {
        if(err) throw err
        done()
      })
    })
  })
})