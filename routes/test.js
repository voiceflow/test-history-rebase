const axios = require('axios')

module.exports.api = (req, res) => {
    if(typeof req.body.api === 'object' && req.body.api.method && req.body.api.url){
        axios(req.body.api)
        .then(result => {
            res.status(result.status).send(result.data)
        })
        .catch(err => {
            if(err.response && !isNaN(err.response.status)){
                res.status(err.response.status).send(err)
            }else if(err.status > 300){
                res.status(err.status).send(err)
            }else{
                res.status(404).send(err)
            }
        })
    }else{
        res.sendStatus(500)
    }
}