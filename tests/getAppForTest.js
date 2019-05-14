'use strict';

const _ = require('lodash');
const Server = require('../server');
const { ServiceManager } = require('../backend');

let lastPort = _.random(10000, 60000);

module.exports = async (serviceManager = new ServiceManager()) => {
  const server = new Server(serviceManager);
  server.port = lastPort;
  lastPort++;

  await server.start();
  const { app } = server;

  return {
    app,
    server,
  };
};
