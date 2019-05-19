// PRIMARY KEY TEAM_ID IS ALWAYS HASHED
const _ = require('lodash');
const {
  pool, writeToLogs, hashids, decryptJSON,
} = require('./../services');

const { deleteProjectPromise } = require('./skill_util');
const {
  team_hash, createTeam, populateTeam, repopulateTeam,
} = require('./team_util');

const { sendTeamInvite } = require('./mail');

const SECRET_KEY = process.env.STRIPE_SK;
const stripe = require('stripe')(SECRET_KEY);

const FREE_SEATS = 2;
const MAX_TEAM_NAME_LENGTH = 32;
const moment = require('moment');

function removeDuplicates(arr) {
  const s = new Set(arr);
  const it = s.values();
  return Array.from(it);
}

Date.prototype.isValid = function () {
  // An invalid date object returns NaN for getTime() and NaN is the only
  // object not strictly equal to itself.
  return this.getTime() === this.getTime();
};

const STATUS_TO_PLAN = {
  0: 'FREE',
  1: 'STANDARD_SEAT_MO',
  2: 'BUSINESS_SEAT_MO',
};

const INVALID_STATES = ['incomplete_expired', 'incomplete', 'unpaid'];
const INVALID_INVOICE_STATES = ['open', 'void', 'uncollectible'];

exports.verifyTeam = async (req, res, next) => {
  try {
    const team_id = team_hash.decode(req.params.team_id)[0];
    if (!team_id) throw new Error('No Team');

    if (req.user.admin < 100) {
      const result = await pool.query(
        'SELECT 1 FROM team_members WHERE team_id = $1 AND creator_id = $2 LIMIT 1',
        [team_id, req.user.id],
      );
      if (result.rows.length === 0) throw new Error('No Access');
    }

    // _team_id means decoded team_id
    req.params._team_id = team_id;
  } catch (err) {
    console.log(err);
    return res.sendStatus(401);
  }
  next();
};

exports.verifyProjectAccess = async (req, res, next) => {
  try {
    const project_id = hashids.decode(req.params.project_id)[0];
    if (!project_id) throw new Error('Invalid Project');

    let result;
    if (req.user.admin < 100) {
      result = await pool.query(
        `
        SELECT t.team_id FROM projects p
        INNER JOIN teams t ON t.team_id = p.team_id
        INNER JOIN team_members tm ON tm.team_id = t.team_id
        WHERE tm.creator_id = $1 AND p.project_id = $2 LIMIT 1  
      `,
        [req.user.id, project_id],
      );
    } else {
      result = await pool.query(
        `
        SELECT team_id FROM projects
        WHERE project_id = $1
      `,
        [project_id],
      );
    }
    if (result.rows.length === 0) throw new Error('No Access');

    req.params._project_id = project_id;
  } catch (err) {
    return res.sendStatus(401);
  }
  next();
};

// Creating a free team (under 2 people)
exports.addTeam = async (req, res) => {
  // INVITES DO NOT INCLUDE CREATOR
  try {
    if (!(
      Array.isArray(req.body.invites)
      && req.body.invites.length < FREE_SEATS
      && typeof req.body.name === 'string'
      && req.body.name.length <= MAX_TEAM_NAME_LENGTH
    )) throw { status: 400 };

    // Ensure you'd not adding a free team if you have 3 already
    const current = await pool.query('SELECT 1 FROM team_members WHERE creator_id = $1', [req.user.id]);
    if (current.rowCount > 3) throw { status: 409, message: '3 Boards Maximum' };

    const team = await createTeam(req.body.name, req.body.image, req.user, req.body.invites.length + 1);
    const { invites, now } = await populateTeam(team.team_id, req.user, req.body.invites);

    // send out emails to all valid members
    invites.forEach((email) => sendTeamInvite(req.user.name, req.body.name, team.team_id, email, now));

    // Hash Team ID here on out
    team.team_id = team_hash.encode(team.team_id);
    res.send(team);
  } catch (err) {
    writeToLogs('CREATE TEAM ERROR', err);
    if (err.status) return res.status(err.status).send(err.message);

    return res.sendStatus(500);
  }
};

const initalizeStripe = async (team, user, seats, source_id, options = {}) => {
  let customer;
  let subscription;
  if (!options.plan || !(options.plan in STATUS_TO_PLAN)) options.plan = 1;

  try {
    // check that source is chargable
    const source = await stripe.sources.retrieve(source_id);
    if (!source || source.status !== 'chargeable') throw new Error('Source not chargeable');

    customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        team_id: team.team_id,
        name: team.name,
      },
      source: source.id,
    });

    const subscription_data = {
      customer: customer.id,
      items: [{
        plan: STATUS_TO_PLAN[options.plan],
        quantity: seats,
      }],
      metadata: {
        team_id: team.team_id,
      },
    };

    if (options.coupon) subscription_data.coupon = options.coupon;

    // if(options.trial_days) subscription_data.trial_period_days = options.trial_days
    // subscription_data.trial_end = (Math.floor((Date.now()/1000)) + 10)
    subscription = await stripe.subscriptions.create(subscription_data);

    return (await pool.query(`
      UPDATE teams 
      SET stripe_id = $1, stripe_sub_id = $2, seats = $3, status = $4, projects = 1000, expiry = NULL 
      WHERE team_id = $5
      RETURNING *`,
    [customer.id, subscription.id, seats, options.plan, team.team_id])).rows[0];
  } catch (err) {
    // clean up and delete the customer since the subscription failed
    if (customer && customer.id) {
      stripe.customers.del(customer.id);
    }

    throw ((err && err.message) || err);
  }
};

const updateSubscription = async (team, seats, status) => {
  if (!team.stripe_sub_id) throw 'No Existing Subscription';

  try {
    const subscription = await stripe.subscriptions.retrieve(team.stripe_sub_id);
    const subscriptionItem = subscription.items.data[0];

    if (!status) {
      status = team.status;
    }

    // upgrade the plan
    if (status !== team.status && status in STATUS_TO_PLAN) {
      await stripe.subscriptionItems.update(subscriptionItem.id, {
        plan: STATUS_TO_PLAN[status],
        quantity: seats,
      });
    } else {
      await stripe.subscriptionItems.update(subscriptionItem.id, {
        quantity: seats,
      });
    }
  } catch (err) {
    throw ((err && err.message) || err);
  }

  return (await pool.query(
    'UPDATE teams SET seats = $1, status = $2, projects = 1000 WHERE team_id = $3 RETURNING *',
    [seats, status, team.team_id],
  )).rows[0];
};

// Creating a paid team on the first go
exports.checkout = async (req, res) => {
  // invites need to be array, there has to be a team name, and credit card source
  if (!(
    Array.isArray(req.body.invites)
      && typeof req.body.name === 'string'
      && req.body.name.length <= MAX_TEAM_NAME_LENGTH
      && req.body.source
  )) {
    return res.sendStatus(400);
  }

  let team_id;

  try {
    const seats = req.body.invites.length + 1;
    let team = await createTeam(req.body.name, req.body.image, req.user);
    team = await initalizeStripe(team, req.user, seats, req.body.source.id, { plan: req.body.plan, coupon: req.body.coupon });

    const { invites, now } = await populateTeam(team.team_id, req.user, req.body.invites);

    // send out emails to all valid members (set notation to remove duplicates)
    removeDuplicates(invites).forEach((email) => sendTeamInvite(req.user.name, req.body.name, team.team_id, email, now));

    // send back the newly generated team
    team.team_id = team_hash.encode(team.team_id);
    res.send(team);
  } catch (err) {
    writeToLogs('TEAM CHECKOUT ERROR', err);
    res.status(402).send(err);

    // delete the created team
    if (team_id) {
      await pool.query('DELETE FROM teams WHERE team_id = $1', [team_id]);
    }
  }
};

exports.getTeams = async (req, res) => {
  const user = req.params.creator_id || req.user.id;

  try {
    const teams = (await pool.query(
      'SELECT t.*, MAX(tm.status) FROM teams t INNER JOIN team_members tm ON t.team_id = tm.team_id WHERE tm.creator_id = $1 GROUP BY t.team_id',
      [user],
    )).rows;
    res.send(
      teams.map((t) => {
        t.team_id = team_hash.encode(t.team_id);
        return t;
      }),
    );
  } catch (e) {
    res.sendStatus(500);
  }
};

exports.getMembers = async (req, res) => {
  try {
    const team_id = team_hash.decode(req.params.team_id)[0];
    if (!team_id) return res.sendStatus(404);

    const members = (await pool.query(
      `
      SELECT c.name, tm.email, c.image, c.creator_id, t.seats, tm.created, tm.status FROM teams t
      INNER JOIN team_members tm ON t.team_id = tm.team_id
      LEFT JOIN creators c ON c.creator_id = tm.creator_id
      WHERE t.team_id IN (SELECT team_id FROM team_members WHERE team_id = $1 AND creator_id = $2)
    `,
      [team_id, req.user.id],
    )).rows;

    if (members.length === 0) {
      res.sendStatus(401);
    } else {
      const { seats } = members[0];
      while (members.length < seats) members.push({});
      res.send(members.map((m) => ({ ...m, seats: undefined })));
    }
  } catch (err) {
    writeToLogs('TEAM MEMBERS', err);
    res.sendStatus(500);
  }
};

exports.updateMembers = async (req, res) => {
  try {
    const team_id = team_hash.decode(req.params.team_id)[0];
    // ensure that team_id and request members is valid
    if (!Array.isArray(req.body.members) || !team_id) throw { status: 400 };
    const new_members = req.body.members;

    if (!new_members.find((m) => m.creator_id === req.user.id)) {
      throw { status: 400, message: 'Removed Self' };
    }

    // get team info and existing team members (We're trying to get this done all in one query)
    const members = (await pool.query(`
      SELECT 
        tm.*, 
        t.creator_id AS admin, t.status AS team_status, t.name AS team_name,
        t.seats, t.stripe_id, t.stripe_sub_id,
        c.image, c.name
      FROM team_members tm
      INNER JOIN teams t ON t.team_id = tm.team_id 
      LEFT JOIN creators c ON c.creator_id = tm.creator_id
      WHERE t.team_id = $1
    `, [team_id])).rows;
    if (members.length === 0) throw { status: 404 };

    // Check to ensure that user has admin access to this team
    const self = members.find((m) => m.creator_id === req.user.id);
    if (!self || self.status !== 100) throw { status: 401 };

    // Generate a team object from a member row
    let team = {
      name: members[0].team_name,
      team_id,
      creator_id: members[0].admin,
      status: members[0].team_status,
      stripe_id: members[0].stripe_id,
      stripe_sub_id: members[0].stripe_sub_id,
      seats: members[0].seats,
    };

    if (!new_members.find((m) => (m.creator_id === team.creator_id && m.status === 100))) {
      throw { status: 400, message: 'Deleted/Modified Super Admin' };
    }

    const existing_members = {};
    const existing_emails = {};
    members.forEach((m) => {
      if (m.creator_id) existing_members[m.creator_id] = m;
      if (m.email) existing_emails[m.email] = m;
    });

    // if this new member is going to be already accepted, ensure they were accepted previously and create time is the same
    if (new_members.find((m, i) => {
      if (m.creator_id) {
        const existing = existing_members[m.creator_id];
        return !existing || !m.created || m.created !== existing.created;
      } if ((m.email in existing_emails)
        && existing_emails[m.email].creator_id && existing_emails[m.email].created) {
        new_members[i] = existing_emails[m.email];
        new_members[i].created = new_members[i].created;
      }
      return false;
    })) {
      throw { status: 400, message: 'Modified Existing Member (Refresh Page)' };
    }

    // no seats time to charge on stripe
    if (new_members.length !== team.seats || req.body.source || req.body.plan) {
      if (team.status !== 0 && team.stripe_id && team.stripe_sub_id) {
        team = await updateSubscription(team, new_members.length, req.body.plan);
      } else if (req.body.source) {
        team = await initalizeStripe(team, req.user, new_members.length, req.body.source.id, { plan: req.body.plan, coupon: req.body.coupon });
      } else if (team.status === 0 && team.seats <= FREE_SEATS) {
        await pool.query(
          'UPDATE teams SET seats = $1 WHERE team_id = $2',
          [new_members.length, team.team_id],
        );
        team.seats = new_members.length;
      } else {
        throw { status: 'Invalid Payment' };
      }
    }

    // delete all the existing members and repopulate (dangerous?)
    await pool.query('DELETE FROM team_members WHERE team_id = $1', [team.team_id]);
    const { invites, now } = await repopulateTeam(team.team_id, new_members);

    // send out new invites to anyone who hasn't been invited before
    removeDuplicates(invites.filter((i) => !(i in existing_emails))).forEach((email) => sendTeamInvite(req.user.name, team.name, team.team_id, email, now));

    team.team_id = team_hash.encode(team.team_id);
    team.members = new_members;
    res.send(team);
  } catch (err) {
    writeToLogs('UPDATE MEMBERS', err);

    if (err.status) return res.status(err.status).send(err.message);

    if (typeof err === 'string') {
      return res.status(402).send(err);
    }

    return res.sendStatus(500);
  }
};

exports.updatePicture = async (req, res) => {
  try {
    const url = `https://s3.amazonaws.com/com.getstoryflow.api.images/${
      req.file.transforms[0].key
    }`;
    await pool.query('UPDATE teams SET image = $1 WHERE team_id = $2', [
      url,
      req.params._team_id,
    ]);
    res.send(url);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const team_id = team_hash.decode(req.params.team_id)[0];
    if (!team_id) return res.sendStatus(404);

    // verify this user has the permissions to delete the team and ALL of its projects
    const projects = await pool.query(
      `
      SELECT p.project_id, t.stripe_id, t.stripe_sub_id FROM teams t
      LEFT JOIN projects p ON p.team_id = t.team_id
      WHERE t.creator_id = $1 AND t.team_id = $2
    `,
      [req.user.id, team_id],
    );

    // user either doesn't have permission or team doesn't exist
    if (projects.rows.length === 0) return res.sendStatus(404);

    // Delete all the projects
    for (const project of projects.rows) {
      if (project.project_id) await deleteProjectPromise(project.project_id);
    }

    // Delete the stripe customer so they won't be charged anymore
    if (projects.rows[0].stripe_id) await stripe.customers.del(projects.rows[0].stripe_id);

    // Delete team
    await pool.query(
      'DELETE FROM teams WHERE team_id = $1 AND creator_id = $2',
      [team_id, req.user.id],
    );
    res.sendStatus(200);
  } catch (err) {
    writeToLogs('DELETE TEAMS', err);
    res.sendStatus(500);
  }
};

exports.getBoards = async (req, res) => {
  try {
    const team_id = team_hash.decode(req.params.team_id)[0];

    if (!team_id) return res.sendStatus(404);

    const boards = (await pool.query(
      `
      SELECT t.boards FROM teams t
      INNER JOIN team_members tm ON tm.team_id = t.team_id
      WHERE tm.team_id = $1 AND tm.creator_id = $2
      `,
      [team_id, req.user.id],
    )).rows[0];

    res.send(boards);
  } catch (err) {
    writeToLogs('GET TEAM BOARDS', err);
    res.sendStatus(500);
  }
};

exports.updateBoard = async (req, res) => {
  try {
    const team_id = team_hash.decode(req.params.team_id)[0];

    if (!team_id) return res.sendStatus(404);

    const boards = JSON.stringify(req.body.boards);
    await pool.query('UPDATE teams SET boards = $1 WHERE team_id = $2', [
      boards,
      team_id,
    ]);
    res.sendStatus(200);
  } catch (err) {
    writeToLogs('UPDATE BOARDS', err);
    res.sendStatus(500);
  }
};


exports.getProjects = async (req, res) => {
  try {
    const team_id = team_hash.decode(req.params.team_id)[0];

    if (!team_id) return res.sendStatus(404);

    const projects = (await pool.query(
      `
      SELECT s.*, p.project_id
      FROM projects p
      INNER JOIN skills s ON p.dev_version = s.skill_id
      INNER JOIN team_members tm ON tm.team_id = p.team_id
      WHERE tm.team_id = $1 AND tm.creator_id = $2
    `,
      [team_id, req.user.id],
    )).rows;

    const formatted_projects = [];
    for (const project of projects) {
      const formatted_project = project;
      formatted_project.isLive = (await pool.query(`
        SELECT *
        FROM skills
        WHERE project_id = $1 AND creator_id = $2 AND live = TRUE
        LIMIT 1
      `, [project.project_id, req.user.id])).rows.length > 0;
      formatted_project.skill_id = hashids.encode(project.skill_id);
      formatted_project.project_id = hashids.encode(project.project_id);
      formatted_projects.push(formatted_project);
    }

    res.send(formatted_projects);
  } catch (err) {
    writeToLogs('GET TEAM SKILLS', err);
    res.sendStatus(500);
  }
};

exports.checkInvite = async (req, res) => {
  try {
    const invite = decryptJSON(req.params.invite_code);
    // invalid invite parameters
    if (!invite || !invite.team_id || !invite.email || !invite.time) throw { status: 400, message: 'Invalid/Corrupt Invite Token' };

    // account email doesn't match invite email
    if (invite.email.toLowerCase() !== req.user.email.toLowerCase()) {
      throw {
        status: 400,
        message: `Account email doesn't match invite email: ${invite.email}`,
      };
    }

    // check that this user isn't already in the board
    const test = (await pool.query(`
      SELECT 1 FROM team_members WHERE creator_id = $1 AND team_id = $2
    `, [req.user.id, invite.team_id])).rows;

    if (test.length !== 0) throw { status: 409, message: 'Already part of board' };

    const update = await pool.query(`
      UPDATE team_members 
      SET creator_id = $1, created = $2 
      WHERE team_id = $3 AND email = $4 AND created = $5
    `, [req.user.id, moment().unix(), invite.team_id, invite.email, invite.time]);

    if (update.rowCount === 0) {
      throw {
        status: 404,
        message: 'Invite Invalid or Expired',
      };
    }

    res.send(team_hash.encode(invite.team_id));
  } catch (err) {
    writeToLogs('CHECK INVITE', err);

    if (err.status) return res.status(err.status).send(err.message);
    return res.sendStatus(500);
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const team_id = team_hash.decode(req.params.team_id)[0];

    if (!team_id) {
      throw {
        status: 400,
        message: 'Team ID not valid',
      };
    }
    if (req.params.creator_id.toString() !== req.user.id.toString()) {
      const admin = await pool.query(
        'SELECT 1 FROM team_members WHERE team_id=$1 AND creator_id=$2 AND status=100',
        [team_id, req.user.id],
      );
      if (admin.rowCount === 0) {
        throw {
          status: 401,
          message: 'Invalid Credentials to Delete',
        };
      }
    }

    const deleted = await pool.query(
      'DELETE FROM team_members WHERE team_id = $1 AND creator_id = $2',
      [team_id, req.params.creator_id],
    );

    if (deleted.rowCount === 0) {
      throw {
        status: 404,
        message: 'Member not found',
      };
    }

    res.sendStatus(200);
  } catch (err) {
    writeToLogs('CHECK INVITE', err);

    if (err.status) return res.status(err.status).send(err.message);
    return res.sendStatus(500);
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const team_id = team_hash.decode(req.params.team_id)[0];

    if (!team_id) {
      throw {
        status: 400,
        message: 'Team ID not valid',
      };
    }

    const team = (await pool.query(`
      SELECT stripe_id FROM teams t
      INNER JOIN team_members tm ON tm.team_id = t.team_id
      WHERE t.team_id = $1 AND tm.creator_id = $2 AND tm.status = 100
    `, [team_id, req.user.id])).rows[0];

    // If unable to find a team either it doesn't exist or authorized
    if (!team) {
      throw {
        status: 401,
      };
    }

    if (!team.stripe_id) return res.sendStatus(204);

    const invoices = await stripe.invoices.list({
      customer: team.stripe_id,
      limit: 10,
    });

    const upcoming = await stripe.invoices.retrieveUpcoming(team.stripe_id);

    res.send({
      invoices: invoices.data.map((i) => ({
        status: INVALID_INVOICE_STATES.includes(i.status) && i.status,
        amount: i.amount_paid,
        timestamp: i.finalized_at,
        items: i.lines.data.map((l) => l.description),
      })),
      upcoming: {
        amount: upcoming.amount_due,
        timestamp: upcoming.next_payment_attempt,
        items: upcoming.lines.data.map((l) => l.description),
      },
    });
  } catch (err) {
    writeToLogs('INVOICE ERROR', err);

    if (err.message || err.status) {
      return res.status(err.status || 400).send(err.message);
    }
    return res.sendStatus(500);
  }
};

exports.getSource = async (req, res) => {
  try {
    const team_id = team_hash.decode(req.params.team_id)[0];

    if (!team_id) {
      throw {
        status: 400,
        message: 'Team ID not valid',
      };
    }

    const team = (await pool.query(`
      SELECT stripe_id FROM teams t
      INNER JOIN team_members tm ON tm.team_id = t.team_id
      WHERE t.team_id = $1 AND tm.creator_id = $2 AND tm.status = 100
    `, [team_id, req.user.id])).rows[0];

    // If unable to find a team either it doesn't exist or authorized
    if (!team) {
      throw {
        status: 401,
      };
    }

    if (!team.stripe_id) return res.sendStatus(204);

    const customer = await stripe.customers.retrieve(team.stripe_id);
    const s = customer.sources.data[0];

    const source = {};
    if (s.card) {
      source.brand = s.card.brand;
      source.last4 = s.card.last4;
    }
    source.type = s.type;
    // this should be a given already
    // if(s.id === customer.default_source) {
    //   source.default = true
    // }

    res.send(source);
  } catch (err) {
    writeToLogs('GET SOURCE ERROR', err);

    if (err.message || err.status) {
      return res.status(err.status || 400).send(err.message);
    }
    return res.sendStatus(500);
  }
};

exports.updateSource = async (req, res) => {
  try {
    if (!req.body.source || !req.body.source.id) {
      throw {
        status: 402,
        message: 'No Stripe Source Attached',
      };
    }

    const team_id = team_hash.decode(req.params.team_id)[0];

    if (!team_id) {
      throw {
        status: 400,
        message: 'Team ID not valid',
      };
    }

    const team = (await pool.query(`
      SELECT t.team_id, stripe_id, stripe_sub_id, seats, t.status FROM teams t
      INNER JOIN team_members tm ON tm.team_id = t.team_id
      WHERE t.team_id = $1 AND tm.creator_id = $2 AND tm.status = 100
    `, [team_id, req.user.id])).rows[0];

    if (!team || !team.stripe_id) {
      throw {
        status: 401,
        message: 'No Previous Payment Credentials',
      };
    }

    const customer = await stripe.customers.update(
      team.stripe_id,
      { source: req.body.source.id },
    );
    const s = customer.sources.data[0];

    const source = {};
    if (s.card) {
      source.brand = s.card.brand;
      source.last4 = s.card.last4;
    }
    source.type = s.type;

    if (team.status > 0) {
      let subscription = customer.subscriptions.data.find((s) => s.id === team.stripe_sub_id);

      if (!subscription || team.stripe_status === 'incomplete_expired') {
        // this subscription is completely fucked - get the info from it and GTFO and make a new one
        if (subscription) await stripe.subscriptions.del(subscription.id);

        subscription = await stripe.subscriptions.create({
          customer: team.stripe_id,
          items: [{
            plan: STATUS_TO_PLAN[team.status],
            quantity: subscription.quantity,
          }],
          metadata: {
            team_id: team.team_id,
          },
        });
        await pool.query('UPDATE teams SET stripe_sub_id = $1 WHERE team_id = $2', [subscription.id, team.team_id]);
        source.status = 'PENDING';
      } else if (subscription.status === 'incomplete' || subscription.status === 'unpaid') {
        // Check if there are any outstanding payments on this account and pay the outstanding invoice
        const { latest_invoice } = subscription;
        await stripe.invoices.pay(latest_invoice);
        source.status = 'PENDING';
      }
    }

    res.send(source);
  } catch (err) {
    writeToLogs('INVOICE ERROR', err);

    if (err.message || err.status) {
      return res.status(err.status || 400).send(err.message);
    }
    return res.sendStatus(500);
  }
};

exports.webhook = async (req, res) => {
  // Check Valid Stripe Signature
  try {
    stripe.webhooks.constructEvent(req.rawBody, req.headers['stripe-signature'], process.env.STRIPE_ENDPOINT_SECRET);
  } catch (err) {
    writeToLogs('STRIPE WEBHOOK ATTEMPT', { err });
    return res.status(400).end();
  }

  // check correct object type
  if (req.body && req.body.data && req.body.data.object) {
    try {
      if (req.body.type === 'customer.subscription.updated' && req.body.data.previous_attributes) {
        const subscription = req.body.data.object;

        // check for a status update
        const previous_status = req.body.data.previous_attributes.status;
        const { status } = subscription;
        const { team_id } = subscription.metadata;
        if (previous_status && previous_status !== status && team_id) {
          const update = await pool.query('UPDATE teams SET stripe_status = $1 WHERE team_id = $2 AND stripe_sub_id = $3', [status, team_id, subscription.id]);
          if (update.rowCount === 0) return res.sendStatus(404);
        }
      } else if (req.body.type === 'customer.subscription.created') {
        const subscription = req.body.data.object;
        const { team_id } = subscription.metadata;
        const update = await pool.query('UPDATE teams SET stripe_status = $1 WHERE team_id = $2', [subscription.status, team_id]);
        if (update.rowCount === 0) return res.sendStatus(404);
      }
      return res.sendStatus(200);
    } catch (err) {
      writeToLogs('STRIPE WEBHOOK ERROR', { err });
      return res.status(500).send(err);
    }
  }

  return res.sendStatus(400);
};

exports.team_hash = team_hash;
