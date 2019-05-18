/* eslint-disable */

const Hashids = require('hashids');
const moment = require('moment');

exports.team_hash = new Hashids('QsWyflBIuXsD2cBYBg35qq0JcdfQbYHg', 10);

const { pool, validateEmail } = require('./../services');

// Check that this team member can access this skill
exports.checkSkillAccess = async (skill_id, user_id) => {
  if (skill_id) {
    try {
      const result = await pool.query(`
        SELECT 1 FROM skills s
        INNER JOIN projects p ON p.project_id = s.project_id
        INNER JOIN team_members tm ON tm.team_id = p.team_id
        WHERE s.skill_id = $1 AND tm.creator_id = $2 LIMIT 1
      `, [skill_id, user_id]);
      if (result.rowCount !== 0) return true;
    } catch (err) {
    }
  }
  return false;
};

// Add Team Members/Seats to the team
const populateTeam = async (team_id, creator, members) => {
  // insert owner first with owner status
  const now = moment().unix();
  let query = 'INSERT INTO team_members (team_id, creator_id, status, email, created) VALUES ($1, $2, $3, $4, $5)';
  const insert = [team_id, creator.id, 100, creator.email, now];
  const invites = [];
  const existing_emails = new Set([creator.email]);
  let i = 1;
  members.forEach((email) => {
    if (validateEmail(email) && !existing_emails.has(email)) {
      const mod = i * 5;
      query += `, ($${1 + mod}, $${2 + mod}, $${3 + mod}, $${4 + mod}, $${5 + mod})`;
      insert.push(team_id, null, 0, email, now);
      invites.push(email);
      existing_emails.add(email);
      i++;
    }
  });

  await pool.query(query, insert);
  return { invites, now };
};

// Add Team Members/Seats to the team, return new members to be invited
const repopulateTeam = async (team_id, members) => {
  // insert owner first with owner status
  const now = moment().unix();
  let query = 'INSERT INTO team_members (team_id, creator_id, status, email, created) VALUES ';
  const invites = [];
  const insert = [];
  const emails = new Set();

  let i = 0;
  members.forEach((m) => {
    if (!m.creator_id) {
      if (!validateEmail(m.email) || emails.has(m.email)) {
        m.email = undefined;
        return;
      }
      invites.push(m.email);
      m.created = now;
      m.status = 0;
    } else if (!m.status) {
      m.status = 1;
    }

    const mod = i * 5;
    query += `($${1 + mod}, $${2 + mod}, $${3 + mod}, $${4 + mod}, $${5 + mod}), `;
    insert.push(team_id, m.creator_id, m.status, m.email, (m.created || now));
    emails.add(m.email);
    i++;
  });

  await pool.query(query.slice(0, -2), insert);
  return { invites, now };
};

// create a new team
const createTeam = async (name, image, creator, seats = false) => {
  let result;
  if (seats) {
    result = await pool.query(
      'INSERT INTO teams (name, image, creator_id, seats) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, image, creator.id, seats],
    );
  } else {
    result = await pool.query(
      'INSERT INTO teams (name, image, creator_id) VALUES ($1, $2, $3) RETURNING *',
      [name, image, creator.id],
    );
  }
  return result.rows[0];
};

exports.createTeam = createTeam;
exports.populateTeam = populateTeam;
exports.repopulateTeam = repopulateTeam;

exports.createPersonalTeam = async (user) => {
  const team = await createTeam('Personal', null, user, 1);
  await populateTeam(team.team_id, user, []);
};
