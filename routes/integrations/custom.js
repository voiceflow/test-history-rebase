const axios = require('axios');

const makeTestAPICall = async (req, res) => {
  try {
    const resp = await axios.post(`${process.env.INTEGRATIONS_LAMBDA_ENDPOINT}/custom/make_test_api_call`, req.body);
    res.send(resp.data);
  } catch (e) {
    res.status(400).send(e.message || e.data.error || e);
  }
};

module.exports = {
  makeTestAPICall,
};
