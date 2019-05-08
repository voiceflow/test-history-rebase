const AWS = require('aws-sdk');
const { writeToLogs } = require('./../services');

AWS.config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
});

const sendError = async (req, res) => {
  const error = {
    name: req.body.name,
    message: req.body.message,
    error: req.body.error,
    componentTree: req.body.componentTree,
    user_detail: req.body.user_detail,
    browser: req.body.browser,
  };
  // Fire and forget ;)
  writeToLogs('CREATOR_FRONTEND_ERRORS', { err: error });
  res.sendStatus(200);
};

const getErrors = (req, res) => {
  const params = {
    logGroupName: `/aws/lambda/storyflow-${req.params.env}`,
    interleaved: true,
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
  };
  cloudWatchLogs.filterLogEvents(params, (err, data) => {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', { err });
      res.sendStatus(400);
    } else {
      res.send(data.events
        .filter((e) => !(e.message.startsWith('START') || e.message.startsWith('END') || e.message.startsWith('REPORT')))
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((e) => e.message));
    }
  });
};

exports.getErrors = getErrors;
exports.sendError = sendError;
