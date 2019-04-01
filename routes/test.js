const axios = require('axios')
const safeJsonStringify = require('safe-json-stringify')

module.exports.api = (req, res) => {
  if(typeof req.body.api === 'object' && req.body.api.method && req.body.api.url){
      if(req.body.api.method !== 'GET'){
          req.body.api.data = req.body.api.body
          delete req.body.api.body
      }
      axios(req.body.api)
      .then(result => {
          res.status(result.status).send(result.data)
      })
      .catch(err => {
          if(err.response && !isNaN(err.response.status)){
              res.status(err.response.status).send(err.response.data)
          }else if(err.status > 300){
              res.status(err.status).send(safeJsonStringify(err))
          }else{
              res.status(404).send(safeJsonStringify(err))
          }
      })
  }else{
      res.sendStatus(500)
  }
}