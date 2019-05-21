'use strict';

const _ = require('lodash');
const VError = require('@voiceflow/verror');
const Promise = require('bluebird');

const validateServices = (services) => {
  if (!_.isObject(services)) {
    throw new Error('services must be an object');
  }

  if (!_.isObject(services.logging_pool)) {
    throw new Error('services.logging_pool must be an object');
  }

  if (!_.isObject(services.skillsManager)) {
    throw new Error('services.skillsManager must be an object');
  }
};

/**
 * @class
 */
class AnalyticsManager {
  /**
   * @param {object} services
   * @param {object} services.pool
   * @param {object} services.logging_pool
   * @param {ProjectManager} services.projectManager
   * @param {SkillsManager} services.skillsManager
   */
  constructor(services) {
    validateServices(services);

    this.services = services;
  }

  /**
   * Get stats around use of a skill
   * @param {number} projectId
   * @returns {Promise<[*]>}
   */
  async getUsersData(projectId) {
    if (!_.isInteger(projectId)) {
      throw new Error('projectId must be an integer');
    }

    const [liveSkill] = await this.services.skillsManager.getLiveSkills(projectId);

    if (liveSkill) {
      const liveSkillId = liveSkill.skill_id;

      const data = await this.services.logging_pool.query(
        `SELECT user_id, count(DISTINCT utterances.session_id) AS sessions, count(*) AS utterances, max(session_end) AS last_interaction, min(session_begin) AS first_interaction 
         FROM sessions INNER JOIN utterances ON sessions.session_id = utterances.session_id 
         WHERE skill_id = $1 
         GROUP BY user_id`,
        [liveSkillId]
      );

      return data.rows || [];
    }

    return [];
  }

  /**
   * Get active users
   * @param {number} projectId
   * @param {number} from
   * @param {number} to
   * @param {number} tz
   * @returns {Promise<[]>}
   */
  async getDAU(projectId, from, to, tz) {
    if (!_.isInteger(projectId)) {
      throw new Error('projectId must be an integer');
    }

    if (!_.isInteger(from)) {
      throw new VError('from must be an integer', VError.HTTP_STATUS.BAD_REQUEST);
    }

    if (!_.isInteger(to)) {
      throw new VError('to must be an integer', VError.HTTP_STATUS.BAD_REQUEST);
    }

    if (from >= to) {
      throw new VError('from must be less than to', VError.HTTP_STATUS.BAD_REQUEST);
    }

    if (!_.isNumber(tz)) {
      throw new VError('tz must be a number', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const [liveSkill] = await this.services.skillsManager.getLiveSkills(projectId);

    if (liveSkill) {
      const liveSkillId = liveSkill.skill_id;

      let query;

      // If period less than 3days, group by hr
      if (to - from <= 259200) {
        query = `
                    SELECT count(DISTINCT user_id) AS user_count, date_trunc('hour', to_timestamp(session_begin / 1000)) AT TIME ZONE $4 AS dau_date
                    FROM sessions 
                    WHERE 
                    skill_id = $1 
                    AND to_timestamp(session_begin / 1000) >= to_timestamp($2)
                    AND to_timestamp(session_end / 1000) <= to_timestamp($3)
                    GROUP BY date_trunc('hour', to_timestamp(session_begin / 1000))
                    ORDER BY dau_date ASC`;
      } else {
        query = `
                    SELECT count(DISTINCT user_id) AS user_count, to_timestamp(session_begin / 1000)::date AT TIME ZONE $4 AS dau_date
                    FROM sessions 
                    WHERE 
                        skill_id = $1 
                        AND to_timestamp(session_begin / 1000) >= to_timestamp($2)
                        AND to_timestamp(session_end / 1000) <= to_timestamp($3)
                    GROUP BY to_timestamp(session_begin / 1000)::date
                    ORDER BY dau_date ASC`;
      }

      const data = await this.services.logging_pool.query(query, [liveSkillId, from, to, -tz]);

      return (data && data.rows) || [];
    }

    return [];
  }

  /**
   * Get overall stats for a project
   * @param {number} projectId
   * @returns {Promise<{sessions, users, interactions}>}
   */
  async getStats(projectId) {
    if (!_.isInteger(projectId)) {
      throw new Error('projectId must be an integer');
    }

    const [liveSkill] = await this.services.skillsManager.getLiveSkills(projectId);

    if (liveSkill) {
      const liveSkillId = liveSkill.skill_id;

      const [users, sessions, interactions] = await Promise.all([
        this.services.logging_pool.query('SELECT count(DISTINCT user_id) AS count FROM sessions WHERE skill_id = $1', [liveSkillId]),
        this.services.logging_pool.query('SELECT COUNT(DISTINCT session_id) AS count FROM sessions WHERE skill_id = $1', [liveSkillId]),
        this.services.logging_pool.query(
          `
                SELECT COUNT(*) AS count FROM utterances INNER JOIN 
                    (SELECT DISTINCT session_id AS sid FROM sessions WHERE sessions.skill_id = $1) 
                AS sq ON utterances.session_id = sq.sid`,
          [liveSkillId]
        ),
      ])
        .map((result) => (result.rows[0] && result.rows[0].count) || 0)
        .map((count) => parseInt(count, 10));

      return {
        users,
        sessions,
        interactions,
      };
    }

    // todo: previous version threw a 500 if the skill didn't exist, that seems extreme
    return {
      users: 0,
      sessions: 0,
      interactions: 0,
    };
  }
}

module.exports = AnalyticsManager;
