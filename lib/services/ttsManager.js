'use strict';

const _ = require('lodash');

const validateServices = (services) => {
  if (!_.isObject(services)) {
    throw new Error('services must be an object');
  }

  if (!_.isObject(services.polly)) {
    throw new Error('services.polly must be an object');
  }
};

/**
 * @class
 */
class TTSManager {
  /**
   * @param {object} services
   * @param {object} services.aws
   */
  constructor(services) {
    validateServices(services);

    this.services = services;
  }

  /**
   * Generate speach
   * @param {string} text
   * @returns {Promise<[*]>}
   */
  async getSpeech(text) {
    const params = {
      OutputFormat: 'mp3',
      Text: `<speak>${text}</speak>`,
      VoiceId: 'Joanna',
      TextType: 'ssml',
    };

    return this.services.polly(params);
  }
}

module.exports = TTSManager;
