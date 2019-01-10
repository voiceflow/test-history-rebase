const AWS = require('aws-sdk');
const { getEnvVariable } = require('../util')

AWS.config = new AWS.Config({
    accessKeyId: getEnvVariable('AWS_ACCESS_KEY_ID'),
    secretAccessKey: getEnvVariable('AWS_SECRET_ACCESS_KEY'),
    region: getEnvVariable('AWS_REGION'),
    endpoint: getEnvVariable('AWS_ENDPOINT')
});

let cloudWatchLogs = new AWS.CloudWatchLogs();

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
