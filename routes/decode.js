const {hashids} = require('./../services');

const decodeId = (req, res) => {
    res.send(hashids.encode(req.params.id));
}

module.exports = {
    decodeId: decodeId
}