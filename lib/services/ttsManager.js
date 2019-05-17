'use strict';

const _ = require('lodash');
const {promisify} = require('util');

const validateServices = (services) => {
  if (!_.isObject(services)) {
    throw new Error('services must be an object');
  }

  if (!_.isObject(services.AWS)) {
    throw new Error('services.AWS must be an object');
  }
};

/**
 * @class
 */
class TTSManager {
  constructor(services) {
    validateServices(services);

    this.services = services;
    let polly = new this.services.AWS.Polly();
    this.polly = promisify(polly.synthesizeSpeech.bind(polly));
  }

  /**
   * Generate speach
   * @param {string} text
   * @returns {Promise<[*]>}
   */
  async getSpeech(text) {

    const params = {
      OutputFormat: "mp3",
      Text: "<speak>"+text+"</speak>",
      VoiceId: "Joanna",
      TextType: "ssml"
    };

    return await this.polly(params);
  }
}

module.exports = TTSManager;
