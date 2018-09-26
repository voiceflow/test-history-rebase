const config = require('../config/config');

module.exports = (docClient, pool) => {

const getWorlds = (req, res) => {
    if (!req.user) {
        res.sendStatus(401);
        return;
    }
    pool.query(`
        SELECT
            w.*,
            COUNT(nullif(s.story_id, NULL)) AS stories
        FROM
            worlds w
            LEFT JOIN stories s ON w.world_id = s.world AND w.env = s.env
        WHERE
            w.creator = $1
        GROUP BY
            w.world_id`, [req.user.id], (err, data) => {
        if(err){
            console.log(err);
            res.sendStatus(500);
        }else{
            res.send(data.rows);
        }
    });
};

const deleteWorld = (req, res) => {
    if (!req.user || !req.params.id) {
        res.sendStatus(401);
        return;
    }
    pool.query('DELETE FROM worlds WHERE creator = $1 AND world_id = $2', [req.user.id, req.params.id], (err) => {
        if(err){
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
};

const setWorld = (req, res) => {
    if (!req.user || !req.body.name || !req.body.env || !config.env.includes(req.body.env)) {
        res.sendStatus(401);
        return;
    }
    let name = req.body.name;
    pool.query('SELECT 1 FROM worlds WHERE creator = $1 AND env = $2 AND LOWER(name) = $3 LIMIT 1', [req.user.id, req.body.env, req.body.name.toLowerCase()], (err, data) => {
        if(err){
            res.sendStatus(500);
        }else if(data.rows.length > 0){
            res.sendStatus(200);
        }else{
            pool.query('INSERT INTO worlds (name, creator, env) VALUES ($1, $2, $3)', [req.body.name, req.user.id, req.body.env], (err, data) => {
                if(err){ res.sendStatus(500); }
                else { res.sendStatus(200) }
            });
        }
    });
};

const updateAudio = (req, res) => {
    if (!req.user || !req.params.id) {
        res.sendStatus(401);
        return;
    }
    pool.query('UPDATE worlds SET preview = $1 WHERE creator = $2 AND world_id=$3', [req.body.preview, req.user.id, req.params.id], (err, data) => {
        if(err){
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
}

const getStories = (req, res) => {
    if (!req.user || !req.params.id) {
        res.sendStatus(401);
        return;
    }
    pool.query('SELECT s.* FROM worlds w INNER JOIN stories s ON s.world=w.world_id WHERE w.creator = $1 AND w.world_id = $2', [req.user.id, req.params.id], (err, data) => {
        if(err){
            res.sendStatus(500);
        }else{
            res.send(data.rows);
        }
    });
}

return {
    getWorlds: getWorlds,
    deleteWorld: deleteWorld,
    setWorld: setWorld,
    updateAudio: updateAudio,
    getStories: getStories
}}
