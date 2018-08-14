const AWS = require('aws-sdk');
const https = require('https');
const uuidv1 = require('uuid/v1');

AWS.config.loadFromPath('./aws-config.json');

const docClient = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
});

const Audio = require('./audio.js');

const getScore = (a, b, callback) => {
    if (a && b) {
        let data = JSON.stringify({
            text1: a,
            text2: b,
            clean: false
        });

        let options = {
            hostname: 'rxnlp-core.p.mashape.com',
            port: 443,
            path: '/computeSimilarity',
            method: 'POST',
            headers: {
                'X-Mashape-Key': 'n56hWN1K21mshaH099rKC3XDoUuTp1AI2xcjsn2vmqI9Yr1Pza',
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Accept': 'application/json'
            }
        };

        let req = https.request(options, res => {
            let body = '';

            res.on('data', d => {
                body += d;
            });

            res.on('end', () => {
                callback(JSON.parse(body).jaccard);
            });
        });
        req.write(data);
        req.end();
    } else {
        callback(0);
    }
};

const getScoreSync = (a, b) => new Promise(resolve => {
    getScore(a, b, resolve);
});

const getStories = (req, res) => {
    let params = {
        TableName: 'com.getstoryflow.stories.'+req.params.env,
        ProjectionExpression: 'id, title, preview, featured'
    };
    if (!req.user.admin) {
        params.FilterExpression = 'creator = :creator';
        params.ExpressionAttributeValues = {':creator': req.user.id};
    }
    docClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
            res.sendStatus(err.statusCode);
        } else {
            res.send(data.Items);
        }
    });
};

const getStoriesInternal = (env, cb) => {
    let params = {
        TableName: 'com.getstoryflow.stories.'+env,
        ProjectionExpression: 'id, title, preview, featured'
    };
    docClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
            cb(null);
        } else {
            cb(data.Items);
        }
    });
};

const getStory = (id, env, callback) => {
    let params = {
        TableName: 'com.getstoryflow.stories.'+env,
        Key: {'id': id}
    };
    docClient.get(params, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (data.Item) {
            callback(data.Item);
        } else {
            callback(null);
        }
    });
};

const getSelection = (input, env, callback) => {
    if (input) {
        getStoriesInternal(env, async stories => {
            let best = 0;
            let bestI = 0;
            let score = 0;
            for (let i = 0; i < stories.length; i++) {
                score = await getScoreSync(input, stories[i].title);
                if (score > best) {
                    best = score;
                    bestI = i;
                }
            }
            score = await getScoreSync(input, 'start featured story');
            if (score > best) {
                best = score;
                bestI = -1;
            }
            score = await getScoreSync(input, 'list all stories');
            if (score > best) {
                best = score;
                bestI = -2;
            }
            if (best > 0) {
                if (bestI === -1) {
                    callback('featured');
                } else if (bestI === -2) {
                    callback('list');
                } else {
                    callback(stories[bestI].id);
                }
            } else {
                callback('list');
            }
        });
    } else {
        callback(null);
    }
};

const log = (state, env) => {
    state.id = uuidv1();
    state.timestamp = new Date().toISOString();
    let params = {
        TableName: 'com.getstoryflow.logs.'+env,
        Item: state
    };
    docClient.put(params, err => {
        if (err) {
            console.log(err);
        }
    });
};

const deleteStory = (req, res) => {
    if (!req.user) {
        res.sendStatus(401);

        return;
    }

    let params = {
        TableName: 'com.getstoryflow.stories.'+req.params.env,
        Key: {'id': req.params.id}
    };
    docClient.get(params, (err, data) => {
        if (err) {
            console.log(err);
            res.sendStatus(err.statusCode);
        } else if (data.Item) {
            if (data.Item.creator !== req.user.id && !req.user.admin) {
                res.sendStatus(403);

                return;
            }
            docClient.delete(params, err => {
                if (err) {
                    console.log(err);
                    res.sendStatus(err.statusCode);
                } else {
                    getStoriesInternal(req.params.env, stories => {
                        Audio.updateTitles(stories, req.params.env);
                    });
                    res.sendStatus(200);
                }
            });
        }
    });
};

const featureStory = (req, res) => {
    if (!req.user) {
        res.sendStatus(401);

        return;
    } else if (!req.user.admin) {
        res.sendStatus(403);

        return;
    }

    let sParams = {
        TableName: 'com.getstoryflow.stories.'+req.params.env,
        ProjectionExpression: 'id',
        FilterExpression: 'featured = :true',
        ExpressionAttributeValues: {':true': true}
    };
    docClient.scan(sParams, (err, data) => {
        if (err) {
            console.log(err);
            res.sendStatus(err.statusCode);
        } else {
            data.Items.forEach(story => {
                if (story.id !== req.params.id) {
                    let uParams = {
                        TableName: 'com.getstoryflow.stories.'+req.params.env,
                        Key: {'id': story.id},
                        UpdateExpression: 'set featured = :false',
                        ExpressionAttributeValues: {':false': false}
                    };
                    docClient.update(uParams, err => {
                        if (err) {
                            console.log(err);
                            res.sendStatus(err.statusCode);
                        }
                    });
                }
            });
            let fParams = {
                TableName: 'com.getstoryflow.stories.'+req.params.env,
                Key: {'id': req.params.id},
                UpdateExpression: 'set featured = :true',
                ExpressionAttributeValues: {':true': true}
            };
            docClient.update(fParams, err => {
                if (err) {
                    console.log(err);
                    res.sendStatus(err.statusCode);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
};

exports.getStories = getStories;
exports.getStoriesInternal = getStoriesInternal;
exports.deleteStory = deleteStory;
exports.featureStory = featureStory;
