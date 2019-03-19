// PRIMARY KEY TEAM_ID IS ALWAYS HASHED
const {
  pool,
  writeToLogs,
  validateEmail
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
  if (!(Array.isArray(req.body.invites) && typeof req.body.name === 'string' && req.body.name.length <= 32 && req.body.token)) {
    return res.sendStatus(400)
  }

  let team_id
  try {
    let seats = (req.body.invites.length + 1)
    team_id = await createTeam(req.body.name, req.body.image_url, req.user)
    let members = await populateTeam(team_id, req.user, req.body.invites)

    const customer = await stripe.customers.create({
      email: req.user.email,
      metadata: {
        id: team_id,
        name: req.body.name
      },
      source: req.body.token.id
    })

    await pool.query('UPDATE teams SET stripe_id = $1 WHERE team_id = $2', [customer.id, team_id])

    const subscription = stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        plan: 'TEAM_PLAN_MO',
        quantity: seats
      }],
    })

    await pool.query('UPDATE teams SET stripe_sub_id = $1 WHERE team_id = $2', [subscription.id, team_id])
    res.sendStatus(200)

    team_id = team_hash.encode(team_id)
    // send out emails to all valid members
    members.forEach(email => sendTeamInvite(req.user.name, req.body.name, team_id, email))
  } catch (err) {
    writeToLogs('PAYMENT ERROR', err)
    return res.sendStatus(400)
  }
}