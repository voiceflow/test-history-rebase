const { hashids } = require('./../services');

exports.decodeId = (req, res) => {
  res.send(hashids.encode(req.params.id));
};

exports.encodeId = (req, res) => {
  res.send(hashids.decode(req.params.id)[0].toString());
};
