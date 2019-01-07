const { pool, logging_pool, hashids } = require('./../services')

exports.getLogs = (req, res) => {
    let skill_id = hashids.decode(req.params.skill_id)[0]

    logging_pool.query(
        `SELECT timestamp, user_id, request FROM logs WHERE creator_id = $1 AND skill_id = $2 ORDER BY timestamp DESC`,
        [req.user.id, skill_id],
        (err, data) => {
            if (err) {
                console.log(err)
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
}