'use strict';

const randomstring = require('randomstring');
const _ = require('lodash');
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

  if (!_.isObject(services.jwt)) {
    throw new Error('services.jwt must be an object');
  }
};

/**
 * @class
 */
class LinkManager {
  /**
   * @param {object} services
   * @param {object} services.pool
   * @param {object} services.hashids
   * @param {object} services.jwt
   */
  constructor(services) {
    validateServices(services);

    this.services = services;
  }

  /**
   * Get link template
   * @param {number} skillId
   * @returns {Promise<*>}
   */
  async getTemplate(skillId) {
    if (!_.isInteger(skillId)) {
      throw new VError('skillId must be an integer', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const result = await this.services.pool.query(
      'SELECT account_linking, skill_id FROM skills WHERE skill_id = $1 LIMIT 1',
      [skillId],
    );

    const [skill] = result.rows;

    if (!skill) throw new VError('Skill not found', VError.HTTP_STATUS.NOT_FOUND);

    if (skill.account_linking) {
      try {
        // todo: Figure out what is going on here
        if (!skill.account_linking.clientSecret) throw new VError('no clientSecret on skill');

        const clientSecret = this.services.jwt.verify(skill.account_linking.clientSecret);

        // give back a dummy string of the same length (dangerous to pass back raw strings)
        skill.account_linking.clientSecret = randomstring.generate(clientSecret.length);
      } catch (err) {
        skill.account_linking.clientSecret = '';
      }
    }

    skill.skill_id = this.services.hashids.encode(skill.skill_id);

    return skill;
  }

  /**
   * Set link template
   * @param {number} skillId
   * @param {object} payload
   * @returns {Promise<*>}
   */
  async setTemplate(skillId, payload) {
    if (!_.isInteger(skillId)) {
      throw new VError('skillId must be an integer', VError.HTTP_STATUS.BAD_REQUEST);
    }

    if (!_.isObject(payload) || _.isEmpty(payload)) {
      throw new VError('no template provided', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const accountLinking = {
      skipOnEnablement: payload.skipOnEnablement || false,
      type: payload.type || 'AUTH_CODE',
      authorizationUrl: payload.authorizationUrl || '',
      domains: payload.domains || [],
      clientId: payload.clientId || '',
      scopes: payload.scopes || [],
      accessTokenUrl: payload.accessTokenUrl || '',
      clientSecret: payload.clientSecret || '',
      accessTokenScheme: payload.accessTokenScheme || 'HTTP_BASIC',
      defaultTokenExpirationInSeconds: payload.defaultTokenExpirationInSeconds || 3600,
    };

    if (accountLinking.clientSecret) {
      accountLinking.clientSecret = this.services.jwt.sign(
        accountLinking.clientSecret,
      );
    }

    const result = await this.services.pool.query(
      'UPDATE skills SET account_linking = $1 WHERE skill_id = $2 RETURNING *',
      [accountLinking, skillId],
    );

    const [skill] = result.rows;

    if (!skill) throw new VError('Skill not found', VError.HTTP_STATUS.NOT_FOUND);

    skill.skill_id = this.services.hashids.encode(skill.skill_id);
    return skill;
  }
}

module.exports = LinkManager;
