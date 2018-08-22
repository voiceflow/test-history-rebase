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
            delete data.Item.submitted;
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

}

return {
    setReview: setReview,
    getReviews: getReviews
}}