const app = require('../app')
const request = require('supertest')
const new_diagram = require('../test/new_diagram.json')
const {pool} = require('./../services')

const generateID = () => {
    return "xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0
        const v = c === "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

const getTemplate = new Promise((resolve, reject) => {
  pool.query(`SELECT module_id FROM modules WHERE type = 'TEMPLATES' ORDER BY template_index DESC LIMIT 1`, (err, res)=>{
    if(err || res.rows.length === 0){
      reject(err)
    }else{
      resolve(res.rows[0].module_id)
    }
  })
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
    .send({
      email: 'tests@getvoiceflow.com',
      password: 'password'
    })
    .expect(200)
    .then(res => {
      token = res.body.token
    })
  })

  describe('Creation', async () => {
    let module_id = await getTemplate
    it('creates skill', done => {
      request(app)
        .post(`/marketplace/template/${module_id}/copy`)
        .send({
          name: 'Test',
          locales: ['en-US']
        })
        .set('cookie', 'auth='+token)
        .expect(500)
        .expect(res => {
          if (!('id' in res.body)) throw new Error('missing id')
        })
        .end((err, res) => {
          if (err) throw err
          skill_id = res.body.id
          done()
        })
    })

    it('creates diagram', done => {
      request(app)
        .post('/diagram')
        .send({
          data: JSON.stringify(new_diagram),
          id: diagram_id,
          skill: skill_id,
          variables: []
        })
        .set('cookie', 'auth='+token)
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
        .set('cookie', 'auth='+token)
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
        .get('/skill/'+skill_id)
        .set('cookie', 'auth='+token)
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
        .get('/skill/'+skill_id+'?preview=1')
        .set('cookie', 'auth='+token)
        .expect(200)
        .expect(res => {
          if (res.body.skill_id !== skill_id) throw new Error('incorrect result')
          if (!('name' in res.body)) throw new Error('missing name')
          if (!('preview' in res.body)) throw new Error('missing preview')
          if ('diagram' in res.body) throw new Error('additional data')
        })
        .end((err, res) => {
          if (err) throw err
          done()
        })
    })

    it('gets created skill simple', done => {
      request(app)
        .get('/skill/'+skill_id+'?simple=1')
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
        .get('/skill/'+skill_id)
        .expect(401)
        .end((err, res) => {
          if (err) throw err
          done()
        })
    })

    it('gets diagrams', done => {
      request(app)
        .get('/diagrams')
        .set('cookie', 'auth='+token)
        .expect(200)
        .expect(res => {
          if (res.body.length === 0) throw new error('incorrect result')
        })
        .end((err, res) => {
          if (err) throw err
          done()
        })
    })

    it('doesn\'t get diagrams if not authenticated', done => {
      request(app)
        .get('/diagrams')
        .expect(401)
        .end((err, res) => {
          if (err) throw err
          done()
        })
    })

    it('gets created diagram', done => {
      request(app)
        .get('/diagram/'+diagram_id)
        .set('cookie', 'auth='+token)
        .expect(200)
        .expect(res => {
          if (res.body.id !== diagram_id) throw new Error('incorrect result')
        })
        .end((err, res) => {
          if (err) throw err
          done()
        })
    })

    it('doesn\'t get diagram if not authenticated', done => {
      request(app)
        .get('/diagram/'+diagram_id)
        .expect(401)
        .end((err, res) => {
          if (err) throw err
          done()
        })
    })
  })

  describe('Deletion', () => {
    it('deletes skill', done => {
      request(app)
        .delete('/skill/'+skill_id)
        .set('cookie', 'auth='+token)
        .expect(200)
        .end((err, res) => {
          if (err) throw err
          done()
        })
    })

    it('doesn\'t get deleted skill', done => {
      request(app)
        .get('/skills')
        .set('cookie', 'auth='+token)
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
