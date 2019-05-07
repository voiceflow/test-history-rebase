'use strict';

const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const fs = require('fs');
const { s3Stream } = require('./services');

const S3_DEST = 'com.getvoiceflow.logs/creators';

const pad = (num) => (num > 9 ? '' : '0') + num;

const log_name_generator = () => {
  const time = new Date();
  return `${[time.getFullYear(), pad(time.getMonth() + 1), pad(time.getHours())].join('_')}.log`;
};

let access_log_stream;

if (process.env.NODE_ENV !== 'test') {
  access_log_stream = rfs(log_name_generator, {
    interval: '1h',
    path: path.join(__dirname, 'log'),
    immutable: true,
  });
  access_log_stream.on('error', console.trace);
  access_log_stream.on('warning', console.trace);
  access_log_stream.on('rotated', (file_name) => {
    try {
      const transfer_status = try_transfer(file_name, 0);
      if (transfer_status === 0) {
        fs.unlink(file_name, (err) => {
          if (err) {
            console.trace(err);
          }
        });
      }
    } catch (err) {
      console.trace(err);
    }
  });
}

const try_transfer = (old_file_path, tries) => {
  if (tries > 5) {
    return -1;
  }

  const split_path = old_file_path.split(path.sep);
  const upload = s3Stream.upload({
    Bucket: S3_DEST,
    Key: split_path[split_path.length - 1],
  });

  upload.on('error', (error) => {
    console.trace(error);
    try_transfer(old_file_path, tries + 1);
  });

  const file_read = fs.createReadStream(old_file_path);
  file_read.pipe(upload);

  return 0;
};

const log_format = (tokens, req, res) => {
  const request = {
    user: req.user,
    cookies: req.cookies,
    params: req.params,
    body: req.body,
  };
  let log = '';

  try {
    log = ['Timestamp', new Date().getTime() / 1000,
      'Method:', tokens.method(req, res),
      'URL:', tokens.url(req, res),
      'Status:', tokens.status(req, res),
      'Response Time:', tokens['response-time'](req, res),
      'Request:', JSON.stringify(request)].join(' ');
  } catch (err) {
    console.trace(err);
  }

  return log;
};

exports.request_logger = morgan(log_format, { stream: access_log_stream });
