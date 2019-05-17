'use strict';

const _ = require('lodash');
const axios = require('axios');
const safeJsonStringify = require('safe-json-stringify');
const VError = require('@voiceflow/verror');
const autoBind = require('auto-bind');

const validateServices = (services) => {
  if (!_.isObject(services)) {
    throw new Error('services must be an object');
  }

  if (!_.isObject(services.responseBuilder)) {
    throw new Error('services.responseBuilder must be an object');
  }

  if (!_.isObject(services.ttsManager)) {
    throw new Error('services.ttsManager must be an object');
  }
};

/**
 * @class
 */
class Test {
  /**
   * @param {object} services
   * @param {object} services.ttsManager
   * @param {object} services.responseBuilder
   */
  constructor(services) {
    validateServices(services);
    autoBind(this);

    this.services = services;
  }

  /**
   * generate Text
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  async speak(req, res) {
    const mp3 = await this.services.ttsManager.getSpeech(req.body.text);
    res.set('Content-Type', mp3.ContentType);
    res.send(mp3.AudioStream);
  }

  async api(req, res) {
    if (typeof req.body.api === 'object' && req.body.api.method && req.body.api.url) {
      if (req.body.api.method !== 'GET') {
        req.body.api.data = req.body.api.body;
        delete req.body.api.body;
      }
      axios(req.body.api)
        .then((result) => {
          res.status(result.status).send(result.data);
        })
        .catch((err) => {
          if (err.response && !isNaN(err.response.status)) {
            res.status(err.response.status).send(err.response.data);
          } else if (err.status > 300) {
            res.status(err.status).send(safeJsonStringify(err));
          } else {
            res.status(404).send(safeJsonStringify(err));
          }
        });
    } else {
      res.sendStatus(500);
    }
  }
}

module.exports = Test;
