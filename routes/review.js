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
            res.send(data.Item);
        } else {
            res.sendStatus(404);
        }
    });
}

const setReview = (req, res) => {
    if (!req.params.id) {
        res.sendStatus(400);
        return;
    }
    let params = {
        TableName: 'com.getstoryflow.diagrams.production',
        Key: {'id': req.params.id }
    };

    docClient.get(params, (err, data) => {
        if (err) {
            console.log(err);
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
        TableName: 'com.getstoryflow.reviews.staging'
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
            data.Items.sort((a, b) => {
                let keyA = a.title,
                    keyB = b.title;
                // Compare the 2 dates
                if(keyA < keyB) return -1;
                if(keyA > keyB) return 1;
                return 0;
            });
            if(req.user.admin){
                let length = data.Items.length;
                let items = []
                data.Items.forEach((review, index) => {
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
                            items.push(review);
                        }else{
                            console.log(err);
                        }
                        if(index == length-1){
                            res.send(items);
                        }
                    });
                });
            }else{
                res.send(data.Items);
            }
        }
    });
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
            console.log(err);
            res.sendStatus(err.statusCode);
        } else if (data.Item) {
            if(data.Item.status !== "reviewing" || req.user.admin){
                docClient.delete(params, err => {
                    if (err) {
                        console.log(err);
                        res.sendStatus(err.statusCode);
                    } else {
                        res.sendStatus(200);
                    }
                });
            } else {
                res.status(409);
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
            console.log(err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
}

return {
    setReview: setReview,
    getReview: getReview,
    deleteReview: deleteReview,
    updateReview: updateReview,
    getReviews: getReviews
}}