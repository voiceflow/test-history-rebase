#!/usr/bin/env node
/* eslint-disable strict */
require('./envSetup')

const socketIO = require('socket.io');
const redisAdapter = require('socket.io-redis');
const sockets = require('./sockets');

const app = require('./app');
const npmPackage = require('./package.json');

const name = `${npmPackage.name} v${npmPackage.version}`;
const port = process.env.PORT || 8080;

// eslint-disable-next-line no-console
if (process.env.NODE_ENV === 'test') {
  console.log('INTEGRATION TESTS');
  app.listen(port, () => console.log(`TESTING ${name} | PORT ${port}`));
} else {
  const io = socketIO(app.listen(port, () => console.log(`${name} | PORT ${port}`)), {
    pingInterval: 5000,
    pingTimeout: 10000,
  });
  io.adapter(redisAdapter({ host: process.env.REDIS_CLUSTER_HOST, port: process.env.REDIS_CLUSTER_PORT }));
  sockets(io);
}
