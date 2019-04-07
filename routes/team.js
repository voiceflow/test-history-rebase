// PRIMARY KEY TEAM_ID IS ALWAYS HASHED
const { pool, writeToLogs, validateEmail, hashids, decryptJSON } = require("./../services");

const { deleteProjectPromise } = require("./skill_util");

const { sendTeamInvite } = require("./mail");

const Hashids = require("hashids");
const team_hash = new Hashids("QsWyflBIuXsD2cBYBg35qq0JcdfQbYHg", 10);

const SECRET_KEY = process.env.STRIPE_SK;
const stripe = require("stripe")(SECRET_KEY);

const FREE_SEATS = 2
const MAX_TEAM_NAME_LENGTH = 32

function removeDuplicates(arr) {
  let s = new Set(arr);
  let it = s.values();
  return Array.from(it);
}

// create a new team
const createTeam = async (name, image, creator) => {
  let result = await pool.query(
    "INSERT INTO teams (name, image, creator_id) VALUES ($1, $2, $3) RETURNING *",
    [name, image, creator.id]
  );
  return result.rows[0];
};

exports.verifyTeam = async (req, res, next) => {
  try {
    let team_id = team_hash.decode(req.params.team_id)[0];
    if (!team_id) throw new Error("No Team");

    if (req.user.admin < 100) {
      let result = await pool.query(
        "SELECT 1 FROM team_members WHERE team_id = $1 AND creator_id = $2 LIMIT 1",
        [team_id, req.user.id]
      );
      if (result.rows.length === 0) throw new Error("No Access");
    }

    // _team_id means decoded team_id
    req.params._team_id = team_id;
  } catch (err) {
    return res.sendStatus(401);
  }
  next();
};

exports.verifyProjectAccess = async (req, res, next) => {
  try {
    let project_id = hashids.decode(req.params.project_id)[0];
    if (!project_id) throw new Error("Invalid Project");

    let result;
    if (req.user.admin < 100) {
      result = await pool.query(
        `
        SELECT t.team_id FROM projects p
        INNER JOIN teams t ON t.team_id = p.team_id
        INNER JOIN team_members tm ON tm.team_id = t.team_id
        WHERE tm.creator_id = $1 AND p.project_id = $2 LIMIT 1  
      `,
        [req.user.id, project_id]
      );
    } else {
      result = await pool.query(
        `
        SELECT team_id FROM projects
        WHERE project_id = $1
      `,
        [project_id]
      );
    }
    if (result.rows.length === 0) throw new Error("No Access");

    req.params._project_id = project_id;
  } catch (err) {
    return res.sendStatus(401);
  }
  next();
};

// Add Team Members/Seats to the team
const populateTeam = async (team_id, creator, invites) => {
  // insert owner first with owner status
  let query = `INSERT INTO team_members (team_id, creator_id, status, email) VALUES ($1, $2, $3, $4)`;
  const insert = [team_id, creator.id, 100, creator.email];
  const members = [];
  const emails = new Set([creator.email])
  let i = 1;
  invites.forEach(invite => {
    if (validateEmail(invite) && !emails.has(invite)) {
      let mod = i * 4;
      query = query + `, ($${1 + mod}, $${2 + mod}, $${3 + mod}, $${4 + mod})`;
      insert.push(...[team_id, null, 0, invite]);
      members.push(invite);
      emails.add(invite)
      i++;
    }else{
      m.email = undefined
    }
  });

  await pool.query(query, insert);
  return members;
};

// Add Team Members/Seats to the team, return new members to be invited
const repopulateTeam = async (team_id, members) => {
  // insert owner first with owner status
  let query = `INSERT INTO team_members (team_id, creator_id, status, email, created) VALUES `;
  const invites = []
  const insert = []
  const emails = new Set()

  let i = 0;
  members.forEach(m => {
    if(!m.creator_id) {
      if(!validateEmail(m.email) || emails.has(m.email)) {
        m.email = undefined
        return
      }
      invites.push(m.email)
      m.status = 0
    }else if(!m.status){
      m.status = 1
    }

    let mod = i * 5;
    query = query + `($${1 + mod}, $${2 + mod}, $${3 + mod}, $${4 + mod}, $${5 + mod}), `;
    insert.push(...[team_id, m.creator_id, m.status, m.email, m.created]);
    emails.add(m.email)
    i++;
  });

  await pool.query(query.slice(0,-2), insert);
  return invites;
};


// Creating a free team (under 2 people)
exports.addTeam = async (req, res) => {
  // INVITES DO NOT INCLUDE CREATOR
  if (
    !(
      Array.isArray(req.body.invites) &&
      req.body.invites.length < FREE_SEATS &&
      typeof req.body.name === "string" &&
      req.body.name.length <= MAX_TEAM_NAME_LENGTH
    )
  ) {
    return res.sendStatus(400);
  }

  try {
    let team = await createTeam(req.body.name, req.body.image, req.user);
    let invites = await populateTeam(team.team_id, req.user, req.body.invites);

    // send out emails to all valid members
    invites.forEach(email =>
      sendTeamInvite(req.user.name, req.body.name, team.team_id, email)
    );

    // Hash Team ID here on out
    team.team_id = team_hash.encode(team.team_id)
    res.send(team);
  } catch (err) {
    writeToLogs("CREATE TEAM ERROR", err);
    return res.sendStatus(400);
  }
};

const initalizeStripe = async (team, user, seats, source_id) => {
  var customer;
  var subscription;
  try {
    // check that source is chargable
    const source = await stripe.sources.retrieve(source_id);
    if (!source || source.status !== "chargeable")
      throw new Error("Source not chargeable");

    customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        team_id: team.team_id,
        name: team.name
      },
      source: source.id
    });

    subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          plan: "TEAM_PLAN_MO",
          quantity: seats
        }
      ]
    })

    const item_id = subscription.items.data[0].id

    return (await pool.query(`
      UPDATE teams 
      SET stripe_id = $1, stripe_sub_id = $2, seats = $3, status = 1, projects = 1000 
      WHERE team_id = $4
      RETURNING *`,
      [customer.id, item_id, seats, team.team_id]
    )).rows[0];
  } catch (err) {
    // clean up and delete the customer since the subscription failed
    if (customer && customer.id) {
      stripe.customers.del(customer.id);
    }

    throw ((err && err.message) || err)
  }
}

const updateSubscription = async (team, seats) => {
  if(!team.stripe_sub_id) throw "No Existing Subscription"

  try {
    await stripe.subscriptionItems.update(team.stripe_sub_id, {
      quantity: seats
    })
  } catch (err) {
    throw ((err && err.message) || err)
  }

  return (await pool.query(
    "UPDATE teams SET seats = $1, status = 1, projects = 1000 WHERE team_id = $2 RETURNING *",
    [seats, team.team_id]
  )).rows[0];
}

// Creating a paid team on the first go
exports.checkout = async (req, res) => {
  // invites need to be array, there has to be a team name, and credit card source
  if (!(
      Array.isArray(req.body.invites) &&
      typeof req.body.name === "string" &&
      req.body.name.length <= MAX_TEAM_NAME_LENGTH &&
      req.body.source
  )) {
    return res.sendStatus(400);
  }

  var team_id;

  try {
    const seats = req.body.invites.length + 1;
    var team = await createTeam(req.body.name, req.body.image, req.user);
    team = await initalizeStripe(team, req.user, seats, req.body.source.id)

    let members = await populateTeam(team.team_id, req.user, req.body.invites);

    // send out emails to all valid members (set notation to remove duplicates)
    removeDuplicates(members).forEach(email =>
      sendTeamInvite(req.user.name, req.body.name, team.team_id, email)
    );

    // send back the newly generated team
    team.team_id = team_hash.encode(team.team_id)
    res.send(team);
  } catch (err) {
    writeToLogs("TEAM CHECKOUT ERROR", err);
    res.status(402).send(err);

    // delete the created team
    if (team_id) {
      await pool.query("DELETE FROM teams WHERE team_id = $1", [team_id]);
    }
  }
};

exports.getTeams = async (req, res) => {
  try {
    let teams = (await pool.query(
      "SELECT t.*, MAX(tm.status) FROM teams t INNER JOIN team_members tm ON t.team_id = tm.team_id WHERE tm.creator_id = $1 GROUP BY t.team_id",
      [req.user.id]
    )).rows;
    res.send(
      teams.map(t => {
        t.team_id = team_hash.encode(t.team_id);
        return t;
      })
    );
  } catch (e) {
    res.sendStatus(500);
  }
};

exports.getMembers = async (req, res) => {
  try {
    let team_id = team_hash.decode(req.params.team_id)[0];
    if (!team_id) return res.sendStatus(404);

    let members = (await pool.query(
      `
      SELECT c.name, tm.email, c.image, c.creator_id, t.seats, tm.created, tm.status FROM teams t
      INNER JOIN team_members tm ON t.team_id = tm.team_id
      LEFT JOIN creators c ON c.creator_id = tm.creator_id
      WHERE t.team_id IN (SELECT team_id FROM team_members WHERE team_id = $1 AND creator_id = $2)
    `,
      [team_id, req.user.id]
    )).rows;

    if (members.length === 0) {
      res.sendStatus(401);
    } else {
      let seats = members[0].seats;
      while (members.length < seats) members.push({});
      res.send(members.map(m => ({...m, seats: undefined})));
    }
  } catch (err) {
    writeToLogs("TEAM MEMBERS", err);
    res.sendStatus(500);
  }
};

exports.updateMembers = async (req, res) => {
  try {
    let team_id = team_hash.decode(req.params.team_id)[0];
    // ensure that team_id and request members is valid
    if(!Array.isArray(req.body.members) || !team_id) throw {status: 400}
    const new_members = req.body.members

    if(!new_members.find(m => m.creator_id === req.user.id)){
      throw { status: 400, message: 'Removed Self'}
    }

    // get team info and existing team members (We're trying to get this done all in one query)
    let members = (await pool.query(`
      SELECT *, t.creator_id AS admin, tm.creator_id AS creator_id, t.status AS team_status, tm.status AS status FROM teams t 
      INNER JOIN team_members tm ON tm.team_id = t.team_id 
      WHERE t.team_id = $1
    `, [team_id])).rows
    if(members.length === 0) throw {status: 404}

    // Check to ensure that user has admin access to this team
    const self = members.find(m => m.creator_id === req.user.id)
    if(!self || self.status !== 100) throw {status: 401}

    // Generate a team object from a member row
    var team = {
      name: members[0].name,
      team_id: team_id,
      creator_id: members[0].admin,
      status: members[0].team_status,
      stripe_id: members[0].stripe_id,
      stripe_sub_id: members[0].stripe_sub_id,
      seats: members[0].seats
    }

    if(!new_members.find(m => (m.creator_id === team.creator_id && m.status === 100))) {
      throw { status: 400, message: 'Deleted/Modified Super Admin' }
    }

    let existing_members = {}
    members.forEach(m => {
      if(m.creator_id) existing_members[m.creator_id] = m
    })

    let existing_emails = new Set(members.map(m => m.email))

    // if this new member is going to be already accepted, ensure they were accepted previously and create time is the same
    if(new_members.find(m => { 
      if(m.creator_id){
        const existing = existing_members[m.creator_id]
        return !existing || !m.created || m.created !== existing.created.toISOString()
      }
      return false
    })){
      throw {status: 400, message: 'Modified Existing Member'}
    }

    // no seats time to charge on stripe
    if(new_members.length !== team.seats && (new_members.length > team.seats || team.status !== 0)) {
      if(team.stripe_id && team.stripe_sub_id) {
        team = await updateSubscription(team, new_members.length)
      } else if (req.body.source) {
        team = await initalizeStripe(team, req.user, new_members.length, req.body.source.id)
      } else {
        throw "No Payment Added"
      }
    }

    // delete all the existing members and repopulate (dangerous?)
    await pool.query('DELETE FROM team_members WHERE team_id = $1', [team.team_id])
    const invites = await repopulateTeam(team.team_id, new_members)

    // send out new invites to anyone who hasn't been invited before
    removeDuplicates(invites.filter(i => !existing_emails.has(i))).forEach(email =>
      sendTeamInvite(req.user.name, team.name, team.team_id, email)
    )

    team.team_id = team_hash.encode(team.team_id)
    team.members = new_members
    res.send(team)

  } catch (err) {
    writeToLogs('UPDATE MEMBERS', err)

    if(err.status) return res.status(err.status).send(err.message)

    if(typeof err === 'string'){
      return res.status(402).send(err)
    }

    return res.sendStatus(500)
  }
};

exports.updatePicture = async (req, res) => {
  try {
    let url = `https://s3.amazonaws.com/com.getstoryflow.api.images/${
      req.file.transforms[0].key
    }`;
    await pool.query("UPDATE teams SET image = $1 WHERE team_id = $2", [
      url,
      req.params._team_id
    ]);
    res.send(url);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    let team_id = team_hash.decode(req.params.team_id)[0];
    if (!team_id) return res.sendStatus(404);

    // verify this user has the permissions to delete the team and ALL of its projects
    let projects = await pool.query(
      `
      SELECT p.project_id, t.stripe_id, t.stripe_sub_id FROM teams t
      LEFT JOIN projects p ON p.team_id = t.team_id
      WHERE t.creator_id = $1 AND t.team_id = $2
    `,
      [req.user.id, team_id]
    );

    // user either doesn't have permission or team doesn't exist
    if (projects.rows.length === 0) return res.sendStatus(404);

    // Delete all the projects
    for (project of projects.rows) {
      if (project.project_id) await deleteProjectPromise(project.project_id);
    }

    // Delete the stripe customer so they won't be charged anymore
    if(projects.rows[0].stripe_id) await stripe.customers.del(projects.rows[0].stripe_id);

    // Delete team
    await pool.query(
      "DELETE FROM teams WHERE team_id = $1 AND creator_id = $2",
      [team_id, req.user.id]
    );
    res.sendStatus(200);
  } catch (err) {
    writeToLogs("DELETE TEAMS", err);
    res.sendStatus(500);
  }
};

exports.getProjects = async (req, res) => {
  try {
    let team_id = team_hash.decode(req.params.team_id)[0];

    if (!team_id) return res.sendStatus(404);

    let projects = (await pool.query(
      `
      SELECT s.*, p.project_id
      FROM projects p
      INNER JOIN skills s ON p.dev_version = s.skill_id
      INNER JOIN team_members tm ON tm.team_id = p.team_id
      WHERE tm.team_id = $1 AND tm.creator_id = $2
    `,
      [team_id, req.user.id]
    )).rows;

    res.send(
      projects.map(project => {
        project.skill_id = hashids.encode(project.skill_id);
        project.project_id = hashids.encode(project.project_id);
        return project;
      })
    );
  } catch (err) {
    writeToLogs("GET TEAM SKILLS", err);
    res.sendStatus(500);
  }
};

exports.checkInvite = async (req, res) => {
  try {
    const invite = decryptJSON(req.params.invite_code)
    // invalid invite parameters
    if(!invite || !invite.team_id || !invite.email) throw {status: 400, message: 'Invalid/Corrupt Invite Token'}
    console.log(invite)

    // account email doesn't match invite email
    if(invite.email.toLowerCase() !== req.user.email.toLowerCase()) throw {
      status: 400, 
      message: `Account email doesn't match invite email: ${invite.email}`
    }

    // check that this user isn't already in the workspace
    let test = (await pool.query(`
      SELECT 1 FROM team_members WHERE creator_id = $1 AND team_id = $2
    `, [req.user.id, invite.team_id])).rows

    if(test.length !== 0) throw {status: 409, message: 'Already part of workspace'}

    const update = await pool.query('UPDATE team_members SET creator_id = $1 WHERE team_id = $2 AND email = $3', [req.user.id, invite.team_id, invite.email])

    if(update.rowCount === 0) throw {
      status: 404,
      message: 'Invalid Invalid or Expired'
    }

    res.send(team_hash.encode(invite.team_id))

  } catch (err) {
    writeToLogs('CHECK INVITE', err)

    if(err.status) return res.status(err.status).send(err.message)
    return res.sendStatus(500)
  }
}

exports.deleteMember = async (req, res) => {
  try {
    let team_id = team_hash.decode(req.params.team_id)[0];

    if(!team_id) throw {
      status: 400,
      message: 'Team ID not valid'
    }
    if(req.params.creator_id.toString() !== req.user.id.toString()){
      const admin = await pool.query(
        'SELECT 1 FROM team_members WHERE team_id=$1 AND creator_id=$2 AND status=100',
        [team_id, req.user.id]
      )
      if(admin.rowCount === 0) throw {
        status: 401,
        message: 'Invalid Credentials to Delete'
      }
    }

    const deleted = await pool.query(
      'DELETE FROM team_members WHERE team_id = $1 AND creator_id = $2',
      [team_id, req.params.creator_id])

    if(deleted.rowCount === 0) throw {
      status: 404,
      message: 'Member not found'
    }

    res.sendStatus(200)
    
  } catch (err) {
    writeToLogs('CHECK INVITE', err)

    if(err.status) return res.status(err.status).send(err.message)
    return res.sendStatus(500)
  }
}
