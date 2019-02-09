const { pool, logging_pool, hashids, writeToLogs } = require('./../services')

exports.getLogs = (req, res) => {
    let skill_id = hashids.decode(req.params.skill_id)[0]
    
    pool.query(`SELECT amzn_id FROM skills WHERE skill_id = $1`, [skill_id], (err, data) => {
        if(err){
            writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
            res.sendStatus(500)
        } else {
            if (data.rows.length > 0){
                logging_pool.query(
                    `SELECT timestamp, user_id, request FROM logs WHERE creator_id = $1 AND amzn_id = $2 ORDER BY timestamp DESC`,
                    [req.user.id, data.rows[0].amzn_id],
                    (err, data) => {
                        if (err) {
                            writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
                            res.sendStatus(500)
                        } else {
                            // React doesn't let you use js objects 
                            for (let i = 0; i < data.rows.length; i++){
                                data.rows[i].request = JSON.stringify(data.rows[i].request)
                            }
                            res.send(data)
                        }
                    }
                )
            } else {
                data.rows = []
                res.send(data)
            }
        }
    })
    
}