'use strict';

const _ = require('lodash');
const isVarName = require('is-var-name');

const VError = require('@voiceflow/verror');

const validateServices = (services) => {
  if (!_.isObject(services)) {
    throw new Error('services must be an object');
  }

  if (!_.isObject(services.pool)) {
    throw new Error('services.pool must be an object');
  }

  if (!_.isObject(services.hashids)) {
    throw new Error('services.hashids must be an object');
  }
};

/**
 * @class
 */
class EmailManager {
  /**
   * @param {object} services
   * @param {object} services.pool
   * @param {object} services.hashids
   */
  constructor(services) {
    validateServices(services);

    this.services = services;
  }

  async getTemplate(userId, id) {
    if (isNaN(id)) throw new VError('No Template', VError.HTTP_STATUS.BAD_REQUEST);
    const result = await this.services.pool.query('SELECT * FROM email_templates WHERE template_id = $1 AND creator_id = $2 LIMIT 1',
      [id, userId]);
    const [template] = result.rows;
    if (!template) {
      throw new VError('Can\'t find template', VError.HTTP_STATUS.NOT_FOUND);
    }
    template.template_id = this.services.hashids.encode(template.template_id);
    return template;
  }

  async getTemplates(userId, skillId) {
    if (isNaN(skillId)) throw new VError('No Skill', VError.HTTP_STATUS.BAD_REQUEST);
    const result = await this.services.pool.query('SELECT * FROM email_templates WHERE creator_id = $1 AND (skill_id = $2 OR skill_id IS NULL)', [userId, skillId]);
    if (result.rows && result.rows.length !== 0) {
      return result.rows.map((row) => {
        row.template_id = this.services.hashids.encode(row.template_id);
        return row;
      });
    }
    return [];
  }

  async setTemplate(userId, skillId, id, body) {
    if (isNaN(skillId)) throw new VError('No Skill', VError.HTTP_STATUS.BAD_REQUEST);
    // match all variables inside the email and put them to a list
    let variables = new Set();

    const regex = /\{([^{}]*)\}/g;

    // Check the body and title for variables
    if (body.content) {
      let match = regex.exec(body.content);
      while (match != null) {
        if (isVarName(match[1])) {
  		    	variables.add(match[1]);
  		    }
  		    match = regex.exec(body.content);
      }
    }
    if (body.subject) {
      let match = regex.exec(body.subject);
      while (match != null) {
        if (isVarName(match[1])) {
  		    	variables.add(match[1]);
  		    }
  		    match = regex.exec(body.subject);
      }
    }

    variables = JSON.stringify(Array.from(variables));
    if (isNaN(id)) {
      const result = await this.services.pool.query(
        'INSERT INTO email_templates (creator_id, title, content, sender, variables, subject, skill_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING template_id',
        [userId, body.title, body.content, body.sender, variables, body.subject, skillId],
      );
      return this.services.hashids.encode(result.rows[0].template_id);
    }
    await this.services.pool.query(
      'UPDATE email_templates SET title = $2, content = $3, sender = $4, modified = NOW(), variables=$5, subject=$6, skill_id=$7 WHERE creator_id = $1 AND template_id = $8',
      [userId, body.title, body.content, body.sender, variables, body.subject, skillId, id],
    );
  }

  async deleteTemplate(userId, id) {
    if (isNaN(id)) throw new VError('No Template', VError.HTTP_STATUS.BAD_REQUEST);
    await this.services.pool.query('DELETE FROM email_templates WHERE template_id=$1 AND creator_id=$2', [id, userId]);
  }
}

module.exports = EmailManager;
