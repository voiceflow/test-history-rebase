module.exports = (docClient, pool) => {

const getStories = (req, res) => {
    if(!req.params.env){
        req.sendStatus(400);
        return;
    }

    let sql = `
        SELECT
            s.title,
            s.story_id,
            s.env,
            COUNT(s.story_id), 
            CONCAT((COUNT(nullif(sr.finished, false))*100 / COUNT(*)), '%') AS completion
        FROM
            story_read sr
            INNER JOIN stories s ON sr.story_id = s.story_id
            WHERE sr.env = $1
            GROUP BY
                s.title, s.story_id, s.env;`

    pool.query(sql, [req.params.env], (err, result) => {
        if(err) res.status(500).send(err);
        res.send(result.rows);
    });
}

const getAggregate = async (req, res) => {
    const { env } = req.params;

    let users, utterances, sessions, started, finished;
    let query = await pool.query('SELECT COUNT(*) AS users, SUM(utterances) AS utterances, SUM(sessions) AS sessions FROM users').catch((err) => { console.log(err); });
    
    if(query){
        users = query.rows[0].users;
        utterances = query.rows[0].utterances;
        sessions = query.rows[0].sessions;
    }

    query = await pool.query('SELECT COUNT(*) AS started, COUNT(nullif(finished, false)) AS finished FROM story_read WHERE env = $1', [env]).catch((err) => { console.log(err); });
    
    if(query){
        started = query.rows[0].started;
        finished = query.rows[0].finished;
    }

    res.send({
        users: users,
        utterances: utterances,
        sessions: sessions,
        started: started,
        finished: finished
    });
}

return {
    getStories: getStories,
    getAggregate: getAggregate
}
}