const { pool, logging_pool, hashids, writeToLogs } = require('../services')

const checkUserOwnsProject = (req, res, cb) => {
    let project_id = hashids.decode(req.params.project_id)[0]

    if(req.user.admin >= 100){
        cb()
    } else {
        pool.query(
            `
            SELECT * FROM projects WHERE project_id = $1 AND creator_id = $2
            `,
            [project_id, req.user.id],
            (err, data) => {
                if(err){
                    writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
                    res.sendStatus(500)
                } 
                if(data.rows.length > 0){
                    cb()
                } else {
                    res.sendStatus(403)
                }
            }
        )
    }
}

exports.getUsersData = (req, res) => {
    checkUserOwnsProject(req, res, async () => {
        let project_id = hashids.decode(req.params.project_id)[0]
        let live_skill_id = (await pool.query(`
            SELECT skill_id 
            FROM skills
            WHERE project_id = $1 AND live = TRUE`, [project_id])).rows[0]
        
        if(live_skill_id){
            live_skill_id = live_skill_id.skill_id
            logging_pool.query(
                `
                SELECT user_id, count(DISTINCT utterances.session_id) AS sessions, count(*) AS utterances, max(session_end) AS last_interaction, min(session_begin) AS first_interaction 
                FROM sessions INNER JOIN utterances ON sessions.session_id = utterances.session_id 
                WHERE skill_id = $1 
                GROUP BY user_id
                `,
                [live_skill_id],
                (err, data) => {
                    if(err){
                        writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
                        res.sendStatus(500)
                    } else {
                        res.send(data.rows)
                    }
                }
            )
        } else {
            res.sendStatus(500)
        }
    })
}

exports.getDAU = (req, res) => {
    checkUserOwnsProject(req, res, async () => {
        let project_id = hashids.decode(req.params.project_id)[0]
        let live_skill_id = (await pool.query(`
            SELECT skill_id 
            FROM skills
            WHERE project_id = $1 AND live = TRUE`, [project_id])).rows[0]

        if(live_skill_id){
            live_skill_id = live_skill_id.skill_id
            let from = req.params.from
            let to = req.params.to
            let dau_query

            // If period less than 3days, group by hr
            if(to - from <= 259200){
                dau_query = `
                    SELECT count(DISTINCT user_id) AS user_count, date_trunc('hour', to_timestamp(session_begin / 1000)) AT TIME ZONE $4 AS dau_date
                    FROM sessions 
                    WHERE 
                    skill_id = $1 
                    AND to_timestamp(session_begin / 1000) >= to_timestamp($2)
                    AND to_timestamp(session_end / 1000) <= to_timestamp($3)
                    GROUP BY date_trunc('hour', to_timestamp(session_begin / 1000))
                    ORDER BY dau_date ASC`
            } else {
                dau_query = `
                    SELECT count(DISTINCT user_id) AS user_count, to_timestamp(session_begin / 1000)::date AT TIME ZONE $4 AS dau_date
                    FROM sessions 
                    WHERE 
                        skill_id = $1 
                        AND to_timestamp(session_begin / 1000) >= to_timestamp($2)
                        AND to_timestamp(session_end / 1000) <= to_timestamp($3)
                    GROUP BY to_timestamp(session_begin / 1000)::date
                    ORDER BY dau_date ASC`
            }
            logging_pool.query(
                dau_query,
                [live_skill_id, from, to, -req.params.user_tz],
                (err, data) => {
                    if(err){
                        writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
                        res.sendStatus(500)
                    } else {
                        res.send(data.rows)
                    }
                }
            )
        } else {
            res.sendStatus(500)
        }
    })
}

exports.getStats = async (req, res) => {
    try{
        let project_id = hashids.decode(req.params.project_id)[0]
        let live_skill_id = (await pool.query(`
            SELECT skill_id 
            FROM skills
            WHERE project_id = $1 AND live = TRUE`, [project_id])).rows[0]

        if(live_skill_id) {
            live_skill_id = live_skill_id.skill_id
            let users = (await logging_pool.query('SELECT count(DISTINCT user_id) AS count FROM sessions WHERE skill_id = $1', [live_skill_id])).rows[0]
            let sessions = (await logging_pool.query('SELECT COUNT(DISTINCT session_id) AS count FROM sessions WHERE skill_id = $1', [live_skill_id])).rows[0]
            let interactions = (await logging_pool.query(`
                SELECT COUNT(*) AS count FROM utterances INNER JOIN 
                    (SELECT DISTINCT session_id AS sid FROM sessions WHERE sessions.skill_id = $1) 
                AS sq ON utterances.session_id = sq.sid`, [live_skill_id])).rows[0]
            
            res.send({
                users: users.count,
                sessions: sessions.count,
                interactions: interactions.count
            })
        } else {
            res.sendStatus(500)
        }
    } catch (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
        res.sendStatus(500)
    }
}