// PRIMARY KEY TEAM_ID IS ALWAYS HASHED
const {
  pool,
  writeToLogs,
  validateEmail,
  hashids
} = require('./../services')

const {
  sendTeamInvite
} = require('./mail')

const Hashids = require('hashids')
const team_hash = new Hashids("QsWyflBIuXsD2cBYBg35qq0JcdfQbYHg", 10)

const SECRET_KEY = process.env.STRIPE_SK
const stripe = require('stripe')(SECRET_KEY)

// create a new team
const createTeam = async (name, image, creator) => {
  let result = await pool.query(
    "INSERT INTO teams (name, image_url, creator_id) VALUES ($1, $2, $3) RETURNING team_id",
    [name, image, creator.id])
  return result.rows[0].team_id
}

exports.verifyTeam = async (req, res, next) => {
  try {
    let team_id = team_hash.decode(req.params.team_id)[0]
    if(!team_id) throw new Error("No Team")
    let result = await pool.query(
      "SELECT 1 FROM team_members WHERE team_id = $1 AND creator_id = $2 LIMIT 1", [team_id, req.user.id]
    )
    if(result.rows.length === 0) throw new Error("No Access")

    // _team_id means decoded team_id
    req.params._team_id = team_id
  } catch(err) {
    return res.sendStatus(401)
  }
  next()
}

// Add Team Members/Seats to the team
const populateTeam = async (team_id, creator, invites) => {
  // insert owner first with owner status
  let query = `INSERT INTO team_members (team_id, creator_id, status, email) VALUES ($1, $2, $3, $4)`
  let insert = [team_id, creator.id, 100, creator.email]
  let members = []

  let i = 1
  invites.forEach(invite => {
    if (validateEmail(invite)) {
      let mod = i * 4
      query = query + `, ($${1 + mod}, $${2 + mod}, $${3 + mod}, $${4 + mod})`
      insert.push(...[team_id, null, 0, invite])
      members.push(invite)
      i++
    }
  })
  await pool.query(query, insert)

  return members
}

// Creating a free team (under 2 people)
exports.addTeam = async (req, res) => {
  if (!(Array.isArray(req.body.invites) && req.body.invites.length <= 1 && typeof req.body.name === 'string' && req.body.name.length <= 32)) {
    return res.sendStatus(400)
  }

  try {
    let team_id = await createTeam(req.body.name, req.body.image_url, req.user)
    let members = await populateTeam(team_id, req.user, req.body.invites)
    // Hash Team ID here on out
    team_id = team_hash.encode(team_id)
    res.status(200).send(team_id)

    // send out emails to all valid members
    members.forEach(email => sendTeamInvite(req.user.name, req.body.name, team_id, email))
  } catch (err) {
    writeToLogs('CREATE TEAM ERROR', err)
    return res.sendStatus(400)
  }
}

// Creating a paid team on the first go
exports.checkout = async (req, res) => {
  if (!(Array.isArray(req.body.invites) && typeof req.body.name === 'string' && req.body.name.length <= 32 && req.body.source)) {
    return res.sendStatus(400)
  }

  var team_id
  var customer
  var subscription
  try {
    let seats = (req.body.invites.length + 1)
    team_id = await createTeam(req.body.name, req.body.image_url, req.user)

    customer = await stripe.customers.create({
      email: req.user.email,
      metadata: {
        id: team_id,
        name: req.body.name
      },
      source: req.body.source.id
    })

    subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        plan: 'TEAM_PLAN_MO',
        quantity: seats
      }]
    })

    await pool.query('UPDATE teams SET stripe_id = $1, stripe_sub_id = $2 WHERE team_id = $3', [customer.id, subscription.id, team_id])

    let members = await populateTeam(team_id, req.user, req.body.invites)
    team_id = team_hash.encode(team_id)
    res.status(200).send(team_id)
    // send out emails to all valid members
    members.forEach(email => sendTeamInvite(req.user.name, req.body.name, team_id, email))
  } catch (err) {
    writeToLogs('PAYMENT ERROR', err)

    res.status(400).send(err)

    // clean up
    if (customer && customer.id) {
      await stripe.customers.del(customer.id)
    }
    if (team_id) {
      await pool.query('DELETE FROM teams WHERE team_id = $1', [team_id])
    }
  }
}

exports.getTeams = async (req, res) => {
  try {
    let teams = (await pool.query('SELECT t.*, MAX(tm.status) FROM teams t INNER JOIN team_members tm ON t.team_id = tm.team_id WHERE tm.creator_id = $1 GROUP BY t.team_id', [req.user.id])).rows
    res.send(teams.map(t => {
      t.team_id = team_hash.encode(t.team_id)
      return t
    }))
  } catch (e) {
    res.sendStatus(500)
  }
}

exports.deleteTeam = async (req, res) => {
  try {
    let team_id = team_hash.decode(req.params.team_id)[0]
    if(!team_id) return res.sendStatus(404)

    // verify this user has the permissions to delete the team and ALL of its projects
    let projects = await pool.query(`
      SELECT p.project_id FROM teams t
      LEFT JOIN projects p ON p.team_id = t.team_id
      WHERE t.creator_id = $1 AND t.team_id = $2
    `, [req.user.id, team_id])

    // user either doesn't have permission or team doesn't exist
    if(projects.rows.length === 0) return res.sendStatus(404)

    res.sendStatus(200)
  } catch (err) {
    writeToLogs('DELETE TEAMS', err)
    res.sendStatus(500)
  }
}

exports.getProjects = async (req, res) => {
  try {
    let team_id = team_hash.decode(req.params.team_id)[0]

    if(!team_id) return res.sendStatus(404)

    let projects = (await pool.query(`
      SELECT s.*, p.project_id
      FROM projects p
      INNER JOIN skills s ON p.dev_version = s.skill_id
      INNER JOIN team_members tm ON tm.team_id = p.team_id
      WHERE tm.team_id = $1 AND tm.creator_id = $2
    `, [team_id, req.user.id])).rows

    res.send(projects.map(project => {
      project.skill_id = hashids.encode(project.skill_id)
      project.project_id = hashids.encode(project.project_id)
      return project
    }))
  } catch (err) {
    writeToLogs('GET TEAM SKILLS', err)
    res.sendStatus(500)
  }
}
