'use strict';

const bunyan = require('bunyan');
const PrettyStream = require('bunyan-prettystream');
const LogDNAStream = require('logdna-bunyan').BunyanStream;

const prettyStdOut = new PrettyStream({ mode: 'dev' });
prettyStdOut.pipe(process.stdout);
const pjson = require('./package.json');

const streams = [{
  type: 'raw',
  level: 'info',
  stream: prettyStdOut,
}];

if (process.env.LOGDNA_API_KEY) {
  const logDNA = new LogDNAStream({
    key: process.env.LOGDNA_API_KEY,
  });

  streams.push({
    type: 'raw',
    stream: logDNA,
  });
}

module.exports = bunyan.createLogger({
  name: pjson.name.replace(/^@[a-zA-Z0-9-]+\//g, ''),
  streams,
});
