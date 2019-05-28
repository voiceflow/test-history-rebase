'use strict';

const safeJsonStringify = require('safe-json-stringify');
const HTTP_STATUS = require('http-status');

const { check } = require('@voiceflow/common').utils;

module.exports = function Test(services) {
  const self = {};

  check(services, '', 'object');
  check(services, 'axios', 'object');
  check(services, 'hashids', 'object');
  check(services, 'ttsManager', 'object');

  const { axios, ttsManager } = services;

  /**
   * generate Text
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  self.speak = async (req, res) => {
    const mp3 = await ttsManager.getSpeech(req.body.text);
    res.set('Content-Type', mp3.ContentType);
    res.send(mp3.AudioStream);
  };

  /**
   * Proxy API call
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  self.api = async (req, res) => {
    if (typeof req.body.api === 'object' && req.body.api.method && req.body.api.url) {
      if (req.body.api.method !== 'GET') {
        req.body.api.data = req.body.api.body;
        delete req.body.api.body;
      }

      return axios(req.body.api)
        .then((result) => {
          res.status(result.status).send(result.data);
        })
        .catch((err) => {
          if (err.response && err.response.status) {
            res.status(err.response.status).send(err.response.data);
          } else if (err.status > 300) {
            res.status(err.status).send(safeJsonStringify(err));
          } else {
            res.status(HTTP_STATUS.NOT_FOUND).send(safeJsonStringify(err));
          }
        });
    }

    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  };

  return self;
};
