const AWS = require('aws-sdk');
const { getEnvVariable } = require('../util')
const moment = require('moment')
const _ = require('lodash');

AWS.config = new AWS.Config({
    accessKeyId: getEnvVariable('AWS_ACCESS_KEY_ID'),
    secretAccessKey: getEnvVariable('AWS_SECRET_ACCESS_KEY'),
    region: getEnvVariable('AWS_REGION'),
    endpoint: getEnvVariable('AWS_ENDPOINT')
});

let cloudWatchLogs = new AWS.CloudWatchLogs();

const sendError = async (req, res) => {
    let time = moment().format('MMM Do YY')
    let group = process.env.NODE_ENV === 'production' ? 'PROD_creator_errors' : 'DEV_creator_errors';
    let streamExist = false
    let error = {
        timestamp: Date.now(),
        name: req.body.name,
        message: req.body.message,
        error: req.body.error,
        componentTree: req.body.componentTree,
        user_detail: req.body.user_detail,
        browser: req.body.browser,
    }
    let stream = {
        logGroupName: group,
        logStreamName: `${time}`
    }
    let getStream= {
        logGroupName: group,
        logStreamNamePrefix: `${time}`
    }
    let params = {
        logGroupName: group,
        logStreamName: `${time}`,
        logEvents: [
            {
                message: JSON.stringify(error),
                timestamp: Date.now()
            }
        ]
    }
    try {
        let data =  await cloudWatchLogs.describeLogStreams(getStream).promise()
        if (!_.isEmpty(data.logStreams)) {
            streamExist = true;
            params.sequenceToken = _.head(data.logStreams).uploadSequenceToken;
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
        return;
    }
    if (!streamExist){
        try {
            await cloudWatchLogs.createLogStream(stream).promise()
        } catch (err) {
            console.log(err);
            res.sendStatus(400);
            return;
        }
    }
    cloudWatchLogs.putLogEvents(params, (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    })
}

const getErrors = (req, res) => {
    let params = {
        logGroupName: '/aws/lambda/storyflow-'+req.params.env,
        interleaved: true,
        startTime: new Date().getTime() - 24*60*60*1000
    };
    cloudWatchLogs.filterLogEvents(params, function(err, data) {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        } else {
            res.send(data.events
                .filter(e => !(e.message.startsWith('START') || e.message.startsWith('END') || e.message.startsWith('REPORT')))
                .sort((a, b) => a.timestamp - b.timestamp)
                .map(e => e.message));
        }
    });
};

exports.getErrors = getErrors;
exports.sendError = sendError;
