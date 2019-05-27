'use strict';

const _ = require('lodash');

const validateServices = (services) => {
  if (!_.isObject(services)) {
    throw new Error('services must be an object');
  }

  if (!_.isObject(services.logging_pool)) {
    throw new Error('services.logging_pool must be an object');
  }
};

/**
 * @class
 */
class AdminManager {
  /**
   * @param {object} services
   * @param {object} services.pool
   * @param {object} services.logging_pool
   */
  constructor(services) {
    validateServices(services);

    this.services = services;
  }

  /**
   * Get all the details of a user
   * @param {any} creatorInfo
   * @param {boolean} email
   * @returns {Promise<[*]>}
   */
  async getCreatorData(creatorInfo, email = false) {
    let creator;
    let creatorId;
    if (email) {
      // Need to find the creator id from the email
      [creator] = (await this.services.pool.query("SELECT * FROM creators WHERE email LIKE '%' || $1 || '%' LIMIT 1", [creatorInfo])).rows;
      creatorId = parseInt(creator.creator_id, 10);
    } else {
      creatorId = parseInt(creatorInfo, 10);
      [creator] = (await this.services.pool.query(
        `
			SELECT * FROM creators WHERE creator_id = $1
			`,
        [creatorId]
      )).rows;
    }

    if (!_.isInteger(creatorId)) {
      throw new Error('creator could not be found with that info');
    }

    const projects = (await this.services.pool.query(
      `
				SELECT p.*, s.*, t.*, t.name AS board_name, t.created AS board_created, s.created AS skill_created, s.name AS skill_name FROM teams t
				INNER JOIN projects p ON p.team_id = t.team_id
				INNER JOIN skills s ON s.skill_id = p.dev_version
				WHERE t.creator_id = $1
			`,
      [creatorId]
    )).rows;

    // This will be a representation of the teams object in the teams
    const boards = {};
    projects.forEach((p) => {
      if (!boards[p.team_id]) {
        boards[p.team_id] = {
          team_id: p.team_id,
          name: p.board_name,
          created: p.board_created,
          seats: p.seats,
          projects: [],
        };
      }

      boards[p.team_id].projects.push(p);
    });

    return {
      boards,
      creator,
    };
  }
}

module.exports = AdminManager;
