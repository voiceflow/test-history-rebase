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

    const data = await this.services.pool.query(`
            SELECT skill_id 
            FROM skills
            WHERE project_id = $1 AND live = TRUE`, [projectId]);

    return (data && data.rows) || [];
  }

  async checkSkillAccess(skillId, userId) {
    if (!_.isInteger(skillId)) {
      throw new Error('skillId must be an integer');
    }
    if (!_.isInteger(userId)) {
      throw new Error('userId must be an integer');
    }
    try {
      const result = await this.services.pool.query(`
        SELECT 1 FROM skills s
        INNER JOIN projects p ON p.project_id = s.project_id
        INNER JOIN team_members tm ON tm.team_id = p.team_id
        WHERE s.skill_id = $1 AND tm.creator_id = $2 LIMIT 1
      `, [skillId, userId]);
      if (result.rowCount !== 0) return true;
    } catch (err) {
    }
    return false;
  }
}

module.exports = SkillsManager;
