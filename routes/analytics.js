Date.prototype.isValid = function() {
  return isFinite(this);
}

module.exports = (docClient, pool) => {

const getStories = (req, res) => {
    if(!req.params.env){
        req.sendStatus(400);
        return;
    }

    if(req.params.start && req.params.end){
        let start = new Date(parseInt(req.params.start, 10));
        let end = new Date(parseInt(req.params.end, 10));

        if(start == 'Invalid Date' || end == 'Invalid Date' || start > end){
            res.sendStatus(400);
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
            WHERE sr.env = $1 AND sr.start_time < $2 AND sr.start_time > $3
            GROUP BY
                s.title, s.story_id, s.env;`

        pool.query(sql, [req.params.env, end, start], (err, result) => {
            if(err){ res.status(500).send(err); console.log(err);return;} 
            res.send(result.rows);
        });
    }else{
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
            if(err){ res.status(500).send(err); return; }
            res.send(result.rows);
        });
    }
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

const getReads = (req, res) => {
    if(!req.params.env){
        req.sendStatus(400);
        return;
    }

    if(req.params.start && req.params.end){
        let start = new Date(parseInt(req.params.start, 10));
        let end = new Date(parseInt(req.params.end, 10));

        if(start == 'Invalid Date' || end == 'Invalid Date' || start > end){
            res.sendStatus(400);
            return;
        }

        let sql = `SELECT COUNT(*), DATE_TRUNC('hour', start_time) AS s FROM story_read WHERE start_time < $1 AND start_time > $2 AND env = $3 GROUP BY DATE_TRUNC('hour', start_time)`

        pool.query(sql, [end, start, req.params.env], (err, result) => {
            if(err){ res.status(500).send(err); return;} 
            res.send(result.rows);
        });
    }else{

        let sql = `SELECT COUNT(*), DATE_TRUNC('hour', start_time) AS s FROM story_read WHERE env = $1 GROUP BY DATE_TRUNC('hour', start_time)`

        pool.query(sql, [req.params.env], (err, result) => {
            if(err){ res.status(500).send(err); console.log(err); return;} 
            res.send(result.rows);
        });
    }
}

const getUsers = (req, res) => {
    let sql = `SELECT * FROM users`

    pool.query(sql, (err, result) => {
        if(err){ res.status(500).send(err); return;}
        res.send(result.rows);
    });
}

const getUserStories = (req, res) => {
    if(!req.params.env || !req.params.id){
        req.sendStatus(400);
        return;
    }

    let sql = `
    SELECT
        st.title,
        COUNT(*)
    FROM
        story_read s
        INNER JOIN stories st ON st.story_id = s.story_id
        WHERE
            s.user_id = $1
            AND s.env = $2
        GROUP BY
            st.story_id,
            st.title`

    pool.query(sql, [req.params.id, req.params.env], (err, result) => {
        if(err){ res.status(500).send(err); return;}
        res.send(result.rows);
    });
}

const getUserStoriesData = (req, res) => {
    if(!req.params.env || !req.params.id){
        req.sendStatus(400);
        return;
    }

    let sql = `
        SELECT
            COUNT(*),
            DATE_TRUNC('hour', start_time) AS s
        FROM
            story_read
        WHERE
            user_id = $1
            AND env = $2
        GROUP BY
            DATE_TRUNC('hour', start_time)`

    pool.query(sql, [req.params.id, req.params.env], (err, result) => {
        if(err){ res.status(500).send(err); return; }
        let points = {}
        result.rows.forEach((read) => {
            points[read.s] = read.count
        });
        res.send(points);
    });
}

return {
    getStories: getStories,
    getAggregate: getAggregate,
    getReads: getReads,
    getUsers: getUsers,
    getUserStories: getUserStories,
    getUserStoriesData: getUserStoriesData
}
}