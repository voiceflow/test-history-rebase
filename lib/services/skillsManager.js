'use strict';

const _ = require('lodash');

const validateServices = (services) => {
  if (!_.isObject(services)) {
    throw new Error('services must be an object');
  }

  if (!_.isObject(services.pool)) {
    throw new Error('services.pool must be an object');
  }
};

/**
 * @class
 */
class SkillsManager {
  constructor(services) {
    validateServices(services);

    this.services = services;
  }

  /**
   * Get live skills for project
   * @param {number} projectId
   * @returns {Promise<[*]>}
   */
  async getLiveSkills(projectId) {
    if (!_.isInteger(projectId)) {
      throw new Error('projectId must be an integer');
    }

    const data = await this.services.pool.query(
      `
            SELECT skill_id 
            FROM skills
            WHERE project_id = $1 AND live = TRUE`,
      [projectId]
    );

    return (data && data.rows) || [];
  }

  /**
   * Check that creator has access to skill
   * @param {number} skillId
   * @param {number} creatorId
   * @returns {Promise<boolean>}
   */
  async checkSkillAccess(skillId, creatorId) {
    if (!_.isInteger(skillId)) {
      throw new Error('skillId must be an integer');
    }
    if (!_.isInteger(creatorId)) {
      throw new Error('creatorId must be an integer');
    }
    let result;

    try {
      result = await this.services.pool.query(
        `
        SELECT 1 FROM skills s
        INNER JOIN projects p ON p.project_id = s.project_id
        INNER JOIN team_members tm ON tm.team_id = p.team_id
        WHERE s.skill_id = $1 AND tm.creator_id = $2 LIMIT 1
      `,
        [skillId, creatorId]
      );
    } catch (err) {
      return false;
    }

    return result.rowCount !== 0;
  }
}

module.exports = SkillsManager;
