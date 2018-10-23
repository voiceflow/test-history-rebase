Date.prototype.isValid = function() {
  return isFinite(this);
}

const {docClient, pool} = require('./../services');

const getTotalUsers = (req,res) => {
    console.log(req.params);
    if (!req.params.skill_id) {
        res.sendStatus(400);
        return
    }

    let skillId = req.params.skill_id;
    
    if (skillId) {
        console.log(skillId);

        let sql = `
            SELECT 
            COUNT(DISTINCT user_id) 
            FROM sessions
            WHERE sessions.skill_id = $1
        `

        pool.query(sql, [skillId], (err, result) => {
            if(err) {
                res.status(500).send(err);
                console.log(err);
                return
            }
            console.log(result);
            console.log('here');
            res.send(result.rows);
            }
        );
    } else {
        console.log('error no skill id');
    }
}

const getWeeklyUsers = (req,res) => {

    let weeklyActive = req.params.weekly;
    let skillId = req.params.skill_id

        let sql = `
            SELECT 
            COUNT(*) 
            FROM sessions
            WHERE sessions.skill_id = $1
            AND sessions.time > (NOW() - INTERVAL '7 DAYS');
        `
        
        pool.query(sql, [skillId], (err, result) => {
            if (err) {
                res.status(500).send(err);
                console.log(err);
                return
            }
            console.log(result);
            res.send(result.rows);
        });
}

const getMonthlyUsers = (req,res) => {

    let monthlyActive = req.params.monthly;
    let skillId = req.params.skill_id;

        if (monthlyActive) {
            let sql = `
                SELECT 
                COUNT(*) FROM sessions
                WHERE sessions.skill_id = $1
                AND sessions.time > (NOW() - INTERVAL ’30 DAYS');
            `

        pool.query(sql, [skillId], (err, result) => {
            if (err) {
                res.status(500).send(err);
                console.log(err);
                return
            }
            console.log(result);
            res.send(result.rows);
        });
    }
}

const getSessions = (req,res) => {
    let skillId = req.params.skill_id;

    if (!skillId) {
        res.sendStatus(400);
        return
    }

    let sql = `
        SELECT 
        COUNT(*) FROM sessions
        WHERE sessions.skill_id = $1
    `
    pool.query(sql, [skillId], (err, result) => {
        if (err) {
            res.status(500).send(err);
            console.log(err);
            res.send(result.rows);
        }
    })
    
}

// const getStories = (req, res) => {
//     if(!req.params.env){
//         req.sendStatus(400);
//         return;
//     }
 
//     if(req.params.start && req.params.end){
//         let start = new Date(parseInt(req.params.start, 10));
//         let end = new Date(parseInt(req.params.end, 10));
//         console.log(req);
//         if(start == 'Invalid Date' || end == 'Invalid Date' || start > end){
//             res.sendStatus(400);
//             return;
//         }

//         let sql = `
//         SELECT
//             s.title,
//             s.story_id,
//             s.env,
//             s.upvotes,
//             s.downvotes,
//             COUNT(s.story_id), 
//             CONCAT((COUNT(nullif(sr.finished, false))*100 / COUNT(*)), '%') AS completion
//         FROM
//             story_read sr
//             INNER JOIN stories s ON sr.story_id = s.story_id AND s.env = sr.env
//             WHERE sr.env = $1 AND s.env = $1 AND sr.start_time < $2 AND sr.start_time > $3
//             GROUP BY
//                 s.story_id, s.env;`

//         pool.query(sql, [req.params.env, end, start], (err, result) => {
//             if(err){ res.status(500).send(err); console.log(err);return;} 
//             res.send(result.rows);
//         });
//     }else{
//         let sql = `
//         SELECT
//             s.title,
//             s.story_id,
//             s.env,
//             s.upvotes,
//             s.downvotes,
//             COUNT(s.story_id), 
//             CONCAT((COUNT(nullif(sr.finished, false))*100 / COUNT(*)), '%') AS completion
//         FROM
//             story_read sr
//             INNER JOIN stories s ON sr.story_id = s.story_id
//             WHERE sr.env = $1 AND s.env = $1
//             GROUP BY
//                 s.story_id, s.env;`

//         pool.query(sql, [req.params.env], (err, result) => {
//             if(err){ res.status(500).send(err); return; }
//             res.send(result.rows);
//         });
//     }
// }

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

// const getReads = (req, res) => {
//     if(!req.params.env){
//         req.sendStatus(400);
//         return;
//     }

//     let period = "day";
//     if(req.params.start && req.params.end){
//         let start = new Date(parseInt(req.params.start, 10));
//         let end = new Date(parseInt(req.params.end, 10));

//         if(start == 'Invalid Date' || end == 'Invalid Date' || start > end){
//             res.sendStatus(400);
//             return;
//         }

//         var timeDiff = end.getTime() - start.getTime();
//         var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
//         if(diffDays <= 2){
//             period = "hour";
//         }

//         let sql = `SELECT COUNT(*), DATE_TRUNC('${period}', start_time) AS s FROM story_read WHERE start_time < $1 AND start_time > $2 AND env = $3 GROUP BY s`

//         pool.query(sql, [end, start, req.params.env], (err, result) => {
//             if(err){ res.status(500).send(err); return;} 
//             res.send(result.rows);
//         });
//     }else{

//         let sql = `SELECT COUNT(*), DATE_TRUNC('${period}', start_time) AS s FROM story_read WHERE env = $1 GROUP BY s`

//         pool.query(sql, [req.params.env], (err, result) => {
//             if(err){ res.status(500).send(err); console.log(err); return;} 
//             res.send(result.rows);
//         });
//     }
// }

const getUsers = (req, res) => {
    if(!req.params.env){
        req.sendStatus(400);
        return;
    }

    let sql = `
    SELECT
        u.*,
        COUNT(nullif(s.finished, NULL)),
        COUNT(nullif(s.finished, false)) AS finished,
        MAX(s.start_time) AS last_seen
    FROM
        users u
        LEFT JOIN story_read s ON s.user_id = u.user_id AND s.env = u.env
        WHERE u.env = $1
        GROUP BY
            u.user_id,
            u.env
        ORDER BY
            u.join_date DESC`

    pool.query(sql, [req.params.env], (err, result) => {
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
        INNER JOIN stories st ON st.story_id = s.story_id AND st.env = s.env
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
            s.title,
            sr.start_time
        FROM
            story_read sr
        INNER JOIN 
            stories s ON s.story_id = sr.story_id AND s.env = sr.env
        WHERE
            user_id = $1
            AND sr.env = $2
        ORDER BY sr.start_time DESC`

    pool.query(sql, [req.params.id, req.params.env], (err, result) => {
        if(err){ res.status(500).send(err); return; }
        let data = [];
        result.rows.forEach((read) => {
            data.push({
                title: read.title,
                time: read.start_time
            });
        });
        res.send(data);
    });
}

const getStoryLines = (req, res) => {
    if(!req.params.id){
        req.sendStatus(400);
        return;
    }

    let sql = `
        SELECT
            line_id,
            SUM(hits)
        FROM
            lines
        WHERE
            story_id = $1
        GROUP BY
            line_id, story_id`

    pool.query(sql, [req.params.id], (err, result) => {
        if(err || result.rows.length < 1) { 
            res.status(500).send(err); console.log(err); return; 
        }
        let lines = {}
        result.rows.forEach((line) => {
            lines[line.line_id] = line.sum
        })
        res.send(lines);
    });
}

// const getBucketUsers = (req, res) => {
//     if(!req.params.env){
//         req.sendStatus(400);
//         return;
//     }

//     let sql = `    
//         SELECT
//             u.*,
//             COUNT(nullif(s.finished, NULL)),
//             COUNT(nullif(s.finished, FALSE)) AS finished,
//             seven.last_seven,
//             MAX(s.start_time) AS last_seen
//         FROM
//             users u
//             LEFT JOIN story_read s ON s.user_id = u.user_id
//             AND s.env = u.env
//             INNER JOIN (
//                     SELECT
//                         u.user_id,
//                         u.env,
//                         COUNT(nullif(s.finished, NULL)) AS last_seven
//                     FROM
//                         users u
//                     LEFT JOIN (
//                         SELECT
//                             *
//                         FROM
//                             story_read
//                         WHERE
//                             start_time > (NOW() - INTERVAL '7 DAYS')) s ON s.user_id = u.user_id
//                         AND s.env = u.env
//                     WHERE
//                         u.env = $1
//                     GROUP BY
//                         u.user_id, u.env) seven ON seven.user_id = u.user_id
//                     AND seven.env = u.env
//                 WHERE
//                     u.env = $1
//                 GROUP BY
//                     u.user_id, u.env, seven.last_seven
//                 ORDER BY
//                     u.join_date DESC`

//     pool.query(sql, [req.params.env], (err, result) => {
//         if(err){ res.status(500).send(err); return;}
//         res.send(result.rows);
//     });
// }

module.exports = {
    // getStoryLines: getStoryLines,
    // getStories: getStories,
    getAggregate: getAggregate,
    // getReads: getReads,
    // getUsers: getUsers,
    getTotalUsers: getTotalUsers,
    getWeeklyUsers: getWeeklyUsers,
    getMonthlyUsers: getMonthlyUsers
    // getBucketUsers: getBucketUsers,
    // getUserStories: getUserStories,
    // getUserStoriesData: getUserStoriesData
}