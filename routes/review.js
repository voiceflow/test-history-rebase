module.exports = (docClient) => {

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
            let review = {
                TableName: 'com.getstoryflow.reviews.staging',
                Item: data.Item
            }
            docClient.put(review, (err, data) => {
                if(err){
                    res.sendStatus(500);
                }else{
                    res.sendStatus(200);
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
            res.send(data.Items);
        }
    });
}

return {
    setReview: setReview,
    getReviews: getReviews
}}