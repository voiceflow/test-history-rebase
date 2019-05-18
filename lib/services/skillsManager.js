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
}

module.exports = SkillsManager;
