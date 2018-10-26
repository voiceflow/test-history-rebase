const {hashids} = require('../services.js');

const decodeId = (req, res) => {
    let skillId = req.params.id
    
    res.send(hashids.decode(skillId)[0]);
}

module.exports = {
    decodeId: decodeId
}