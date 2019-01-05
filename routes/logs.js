const { pool, logging_pool, hashids } = require('./../services')

exports.getLogs = (req, res) => {
    let skill_id = hashids.decode(req.params.skill_id)[0]

    const getSkillName = (log_data) => {
        pool.query(
            `SELECT name FROM skills WHERE skill_id = $1`,
            [skill_id],
            (err, data) => {
                if (err) {
                    console.log(err)
                    res.sendStatus(500)
                } else {
                    if (data.rows.length > 0){
                        log_data.name = data.rows[0].name
                    } else {
                        log_data.name = ''
                    }
                    res.send(log_data)
                }
            }
        )
    }

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
                getSkillName(data)
            }
        }
    )
}