'use strict';

const axios = require('axios');
const { Router } = require('express');
const HTTP_STATUS = require('http-status');

function buildRoute(router, path, base) {
  router.post(path, async (req, res) => {
    try {
      delete req.body.creatorId;
      if (req.user) {
        req.body.creatorId = req.user.id;
      }
      const resp = await axios.post(`${base}${path}`, req.body);
      res.send(resp.data);
    } catch (e) {
      res.status(HTTP_STATUS.BAD_REQUEST).send(e.message || e.data.error || e);
    }
  });
}

function buildRouter(paths, base) {
  const router = Router();
  const integrations = Object.keys(paths);
  for (let i = 0; i < integrations.length; i++) {
    const integration = integrations[i];
    paths[integration].forEach((p) => buildRoute(router, `/${integration}${p}`, base));
  }
  return router;
}

const paths = {
  zapier: ['/feeds', '/subscribe', '/unsubscribe', '/trigger'],
  google_sheets: ['/spreadsheets', '/sheets', '/sheet_headers', '/retrieve_data', '/create_data', '/update_data', '/delete_data'],
  custom: ['/make_test_api_call'],
};
const base = `${process.env.INTEGRATIONS_LAMBDA_ENDPOINT}`;

module.exports = function() {
  const self = {};
  self.proxy = buildRouter(paths, base);
  return self;
};
