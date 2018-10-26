const {hashids} = require('./../services');

const decodeId = (req, res) => {
    res.send(hashids.encode(req.params.id)[0]);
}

module.exports = {
    decodeId: decodeId
}