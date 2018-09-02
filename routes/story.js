const AWS = require('aws-sdk');
const https = require('https');
const uuidv1 = require('uuid/v1');

AWS.config.loadFromPath('./aws-config.json');

const docClient = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
});

const Audio = require('./audio.js');

const getStories = (req, res) => {
    let params = {
        TableName: 'com.getstoryflow.stories.'+req.params.env,
        ProjectionExpression: 'id, title, preview, featured, listed'
    };
    if (!req.user.admin) {
        params.FilterExpression = 'creator = :creator';
        params.ExpressionAttributeValues = {':creator': req.user.id};
    }

    let items = [];

    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            res.sendStatus(500);
        } else {
            data.Items.forEach(function(item) {
               items.push(item);
            });

            // continue scanning if we have more items
            if (typeof data.LastEvaluatedKey != "undefined") {
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }else{
                res.send(items);
            }
        }
    }
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
        }else{
            res.sendStatus(404);
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
            let not_featured = true;
            data.Items.forEach(story => {
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
                if (story.id === req.params.id) {
                    not_featured = false;
                }
            });
            if(not_featured){
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
            }else{
                res.sendStatus(200);
            }
        }
    });
};

const listStories = (req, res) => {
    let sParams = {
        TableName: 'com.getstoryflow.stories.'+req.params.env,
        ProjectionExpression: 'id, preview',
        FilterExpression: 'listed = :true',
        ExpressionAttributeValues: {':true': true}
    };

    let items = [];

    docClient.scan(sParams, onScan);

    function onScan(err, data) {
        if (err) {
            res.sendStatus(500);
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            data.Items.forEach(function(item) {
               items.push(item);
            });

            // continue scanning if we have more items
            if (typeof data.LastEvaluatedKey != "undefined") {
                sParams.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(sParams, onScan);
            }else{
                res.sendStatus(200);
                Audio.updateTitles(items, req.params.env);
            }
        }
    }
}

const listStory = (req, res) => {
    if (!req.user || !req.params.id || !req.params.env) {
        res.sendStatus(401);
        return;
    } else if (!req.user.admin) {
        res.sendStatus(403);
        return;
    }

    let id = req.params.id;

    let uParams = {
        TableName: 'com.getstoryflow.stories.'+req.params.env,
        Key: {'id': id},
        UpdateExpression: 'set listed = :true',
        ExpressionAttributeValues: {':true': true}
    };
    docClient.update(uParams, err => {
        if (err) {
            console.log(err);
            res.sendStatus(err.statusCode);
            return;
        }

        listStories(req, res);
    });
}

const unlistStory = (req, res) => {
    if (!req.user || !req.params.id || !req.params.env) {
        res.sendStatus(401);
        return;
    } else if (!req.user.admin) {
        res.sendStatus(403);
        return;
    }

    let id = req.params.id;

    let uParams = {
        TableName: 'com.getstoryflow.stories.'+req.params.env,
        Key: {'id': id},
        UpdateExpression: 'set listed = :false',
        ExpressionAttributeValues: {':false': false}
    };
    docClient.update(uParams, err => {
        if (err) {
            console.log(err);
            res.sendStatus(err.statusCode);
            return;
        }
        
        listStories(req, res);
    });
}

exports.getStories = getStories;
exports.deleteStory = deleteStory;
exports.featureStory = featureStory;
exports.listStory = listStory;
exports.unlistStory = unlistStory;
