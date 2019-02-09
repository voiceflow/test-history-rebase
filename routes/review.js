const { getEnvVariable } = require('../util')
const { writeToLogs } = require('./../services')

module.exports = (docClient) => {

const getReview = (req, res) => {
    if (!req.params.id) {
        res.sendStatus(400);
        return;
    }
    let params = {
        TableName: 'com.getstoryflow.reviews.staging',
        Key: {'id': req.params.id}
    };
    docClient.get(params, (err, data) => {
        if (err) {
            res.sendStatus(err.statusCode);
        } else if (data.Item) {
            let author_params = {
                TableName: 'com.getstoryflow.users.production',
                IndexName: "idIndex",
                KeyConditionExpression: "id = :k",
                ExpressionAttributeValues: {
                    ":k": data.Item.creator
                },
                ScanIndexForward: false
            }
            docClient.query(author_params, (err, authors) => {
                if(!err && authors.Items){

                    let author = authors.Items[0];
                    data.Item.email = author.email;
                    data.Item.name = author.name;
                    res.send(data.Item);

                    if(data.Item.status != 'under_review'){
                        var params = {
                            TableName: 'com.getstoryflow.reviews.staging',
                            Key: { id: req.params.id },
                            UpdateExpression: "set #status = :s",
                            ExpressionAttributeValues:{
                                ":s" : "under_review"
                            },
                            ExpressionAttributeNames:{
                                "#status": "status"
                            }
                        };

                        docClient.update(params, function(err, data) {
                            if (err) {
                                writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
                            }
                        });
                    }
                }else{
                    writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
                }
            });
        } else {
            res.sendStatus(404);
        }
    });
}

const setReview = (req, res) => {
    if (!req.params.id || !req.body.envs) {
        res.sendStatus(400);
        return;
    }
    let params = {
        TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
        Key: {'id': req.params.id }
    };

    docClient.get(params, (err, data) => {
        if (err) {
            writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
            res.sendStatus(err.statusCode);
        } else if (data.Item) {
            delete data.Item.last_save;
            data.Item.submitted = Date.now();
            data.Item.status = "submitted";
            let exists = {
                TableName: 'com.getstoryflow.reviews.staging',
                Key: {'id': req.params.id }
            };
            docClient.get(exists, (err, check) => {
                if(err){
                    res.status(500).send(err);
                }else if(check.Item){
                    // already submitted for review
                    res.sendStatus(409);
                }else{
                    data.Item.envs = req.body.envs;
                    let review = {
                        TableName: 'com.getstoryflow.reviews.staging',
                        Item: data.Item
                    }
                    docClient.put(review, (err, data) => {
                        if(err){
                            res.sendStatus(500).send(err);
                        }else{
                            res.sendStatus(200);
                        }
                    });
                }
            });
            
        }else{
            res.sendStatus(404);
        }
    });
}

const getReviews = (req, res) => {
    if (!req.user) {
        res.sendStatus(401);
        return;
    }
    let params = {
        TableName: 'com.getstoryflow.reviews.staging',
    };

    if(req.user.admin < 100){
        params.FilterExpression = 'creator = :creator';
        params.ExpressionAttributeValues = {':creator': req.user.id};
    }

    let reviews = [];

    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            res.sendStatus(500);
        } else {
            data.Items.forEach(function(item) {
               reviews.push(item);
            });

            // continue scanning if we have more items
            if (typeof data.LastEvaluatedKey != "undefined") {
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }else{
                if(req.query.author && req.user.admin >= 100 && reviews.length !== 0){
                    let length = reviews.length;
                    let items = [];
                    reviews.forEach((review, index) => {
                        let author_params = {
                            TableName: 'com.getstoryflow.users.production',
                            IndexName: "idIndex",
                            KeyConditionExpression: "id = :k",
                            ExpressionAttributeValues: {
                                ":k": review.creator
                            },
                            ScanIndexForward: false
                        }
                        docClient.query(author_params, (err, authors) => {
                            if(!err && authors.Items){
                                let author = authors.Items[0];
                                review.email = author.email;
                                review.name = author.name;
                            }else{
                                writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
                            }
                            items.push(review);
                            if(items.length == length){
                                res.send(items);
                            }
                        });
                    });
                }else{
                    res.send(reviews);
                }
            }
        }
    }
}

const deleteReview = (req, res) => {
    if (!req.params.id) {
        res.sendStatus(400);
        return;
    }
    let params = {
        TableName: 'com.getstoryflow.reviews.staging',
        Key: {'id': req.params.id }
    };

    docClient.get(params, (err, data) => {
        if (err) {
            writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
            res.sendStatus(err.statusCode);
        } else if (data.Item) {
            if(data.Item.status != "under_review" || req.user.admin >= 100){
                docClient.delete(params, err => {
                    if (err) {
                        writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
                        res.sendStatus(err.statusCode);
                    } else {
                        res.sendStatus(200);
                    }
                });
            } else {
                res.sendStatus(409);
            }
        }else{
            res.sendStatus(404);
        }
    });
}

const updateReview = (req, res) => {
    let statuses = ['submitted', 'under_review', 'declined'];
    if(!req.body || !req.params.id || !req.body.status || !statuses.includes(req.body.status)){
        res.sendStatus(400);
        return;
    }
    var params = {
        TableName: 'com.getstoryflow.reviews.staging',
        Key: { id: req.params.id },
        UpdateExpression: "set #status = :s",
        ExpressionAttributeValues:{
            ":s" : req.body.status
        },
        ExpressionAttributeNames:{
            "#status": "status"
        }
    };

    docClient.update(params, function(err, data) {
        if (err) {
            writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
}

const saveReview = (req, res) => {
    if(!req.body.data || !req.body.id || !req.body.title){
        res.sendStatus(400);
        return;
    }
    var params = {
        TableName: 'com.getstoryflow.reviews.staging',
        Key: { id: req.body.id },
        UpdateExpression: "set #data = :d, title = :t",
        ExpressionAttributeValues:{
            ":d" : req.body.data,
            ":t" : req.body.title
        },
        ExpressionAttributeNames:{
            "#data": "data"
        }
    };

    docClient.update(params, function(err, data) {
        if (err) {
            writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
}

return {
    setReview: setReview,
    getReview: getReview,
    saveReview: saveReview,
    deleteReview: deleteReview,
    updateReview: updateReview,
    getReviews: getReviews
}}
