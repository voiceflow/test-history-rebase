'use strict';

const axios = require('axios');
const { Router } = require('express');

function buildRoute(router, path, base) {
  router.post(path, async (req, res) => {
    try {
      const resp = await axios.post(`${base}${path}`, req.body);
      res.send(resp.data);
    } catch (e) {
      res.status(400).send(e.message || e.data.error || e);
    }
  });
}

function buildRouter(paths, base) {
  const router = Router();
  paths.forEach((p) => buildRoute(router, p, base));
  return router;
}

const paths = ['/feeds', '/subscribe', '/unsubscribe', '/trigger'];
const base = `${process.env.INTEGRATIONS_LAMBDA_ENDPOINT}/zapier`;

module.exports = buildRouter(paths, base);
