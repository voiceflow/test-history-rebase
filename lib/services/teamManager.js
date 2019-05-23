'use strict';

// const _ = require('lodash');
// const VError = require('@voiceflow/verror');
const { check, validateEmail } = require('@voiceflow/common').utils;
const moment = require('moment');

module.exports = function TeamManager(services) {
  check(services, '', 'object');
  check(services, 'pool', 'object');

  const { pool } = services;

  const createTeam = async (name, image, creator, seats = false) => {
    let result;
    if (seats) {
      result = await pool.query('INSERT INTO teams (name, image, creator_id, seats) VALUES ($1, $2, $3, $4) RETURNING *', [
        name,
        image,
        creator.id,
        seats,
      ]);
    } else {
      result = await pool.query('INSERT INTO teams (name, image, creator_id) VALUES ($1, $2, $3) RETURNING *', [name, image, creator.id]);
    }
    return result.rows[0];
  };

  const populateTeam = async (teamId, creator, members) => {
    // insert owner first with owner status
    const now = moment().unix();
    let query = 'INSERT INTO team_members (team_id, creator_id, status, email, created) VALUES ($1, $2, $3, $4, $5)';
    const insert = [teamId, creator.id, 100, creator.email, now];
    const invites = [];
    const existingEmails = new Set([creator.email]);
    let i = 1;
    members.forEach((email) => {
      if (validateEmail(email) && !existingEmails.has(email)) {
        const mod = i * 5;
        query += `, ($${1 + mod}, $${2 + mod}, $${3 + mod}, $${4 + mod}, $${5 + mod})`;
        insert.push(teamId, null, 0, email, now);
        invites.push(email);
        existingEmails.add(email);
        i++;
      }
    });

    await pool.query(query, insert);
    return { invites, now };
  };

  const createPersonalTeam = async (user) => {
    const team = await createTeam('Personal', null, user, 1);
    await populateTeam(team.team_id, user, []);
  };

  return {
    createTeam,
    populateTeam,
    createPersonalTeam,
  };
};
