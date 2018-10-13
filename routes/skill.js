const config = require('../config/config');

module.exports = (docClient, pool) => {

const getSkills = (req, res) => {
    if (!req.user) {
        res.sendStatus(401);
        return;
    }
    pool.query(`
        SELECT
            *
        FROM
            skills
        WHERE
            creator_id = $1`, 
        [req.user.id], (err, data) => {
        if(err){
            console.log(err);
            res.sendStatus(500);
        }else{
            res.send(data.rows);
        }
    });
};

const deleteSkill = (req, res) => {
    if (!req.user || !req.params.id) {
        res.sendStatus(401);
        return;
    }
    pool.query('DELETE FROM skills WHERE creator_id = $1 AND skill_id = $2', [req.user.id, req.params.id], (err) => {
        if(err){
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
};

const setSkill = (req, res) => {
    if (!req.user || !req.body.name || !req.body.diagram) {
        res.sendStatus(401);
        return;
    }
    let name = req.body.name;
    pool.query('SELECT 1 FROM skills WHERE creator_id = $1 AND LOWER(name) = $2 LIMIT 1', [req.user.id, req.body.name.toLowerCase()], (err, data) => {
        if(err){
            res.sendStatus(500);
        }else if(data.rows.length > 0){
            res.sendStatus(200);
        }else{
            pool.query('INSERT INTO skills (name, diagram, creator_id) VALUES ($1, $2)', [req.body.name, req.body.diagram, req.user.id], (err, data) => {
                if(err){ res.sendStatus(500); }
                else { res.sendStatus(200) }
            });
        }
    });
};

return {
    getSkills: getSkills,
    deleteSkill: deleteSkill,
    setSkill: setSkill
}}
