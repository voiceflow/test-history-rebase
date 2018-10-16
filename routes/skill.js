const config = require('../config/config');
const Hashids = require('hashids');

var hashids = new Hashids('XW1B36YGG8', 10);

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
            console.error(err);
            res.sendStatus(500);
        }else{
            res.send(data.rows.map(skill => {
                skill.skill_id = hashids.encode(skill.skill_id);
                return skill;
            }));
        }
    });
};

const getSkill = (req, res) => {
    if (!req.user || !req.params.id) {
        res.sendStatus(401);
        return;
    }

    let id = hashids.decode(req.params.id)[0];

    pool.query(`
        SELECT
            *
        FROM
            skills
        WHERE
            skill_id = $1 AND
            creator_id = $2 LIMIT 1`, 
        [id, req.user.id], (err, data) => {
        if(err){
            console.error(err);
            res.sendStatus(500);
        }else if(data.rows.length === 0){
            res.sendStatus(404);
        }else{
            data.rows[0].skill_id = req.params.id;
            res.send(data.rows[0]);
        }
    });
};

const deleteSkill = (req, res) => {
    if (!req.user || !req.params.id) {
        res.sendStatus(401);
        return;
    }

    let id = hashids.decode(req.params.id)[0];

    pool.query('DELETE FROM skills WHERE creator_id = $1 AND skill_id = $2', [req.user.id, id], (err) => {
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

    pool.query('INSERT INTO skills (name, diagram, creator_id) VALUES ($1, $2, $3) RETURNING skill_id ', [name, req.body.diagram, req.user.id], (err, data) => {
        if(err){
            console.error(err); 
            res.sendStatus(500); 
        } else { 
            res.send({id: hashids.encode(data.rows[0].skill_id)}) 
        }
    });
};

const patchSkill = (req, res) => {
    if (!req.user || !req.params.id || !req.body) {
        res.sendStatus(401);
        return;
    }

    let id = hashids.decode(req.params.id)[0];
    let b = req.body;

    if(req.query.publish){
        pool.query(`
            UPDATE skills 
            SET
            name = $2,
            amzn_id = $3,
            summary = $4, 
            description = $5, 
            keywords = $6, 
            invocations = $7, 
            small_icon = $8, 
            large_icon = $9, 
            category = $10,
            purchase = $11, 
            personal = $12, 
            copa = $13, 
            ads = $14, 
            export = $15, 
            instructions = $16
            WHERE skill_id = $1`, 
            [id, b.name, b.amzn_id, b.summary, b.description, b.keywords, 
            {value: b.invocations}, b.small_icon, b.large_icon, b.category, 
            b.purchase, b.personal, b.copa, b.ads, b.export, b.instructions], (err) => {
            if(err){
                console.log(err);
                res.sendStatus(500);
            }else{
                res.sendStatus(200);
            }
        })
    }else{
        pool.query(`
            UPDATE skills 
            SET
            name = $2,
            amzn_id = $3,
            summary = $4, 
            description = $5, 
            keywords = $6, 
            invocations = $7, 
            small_icon = $8, 
            large_icon = $9, 
            category = $10
            WHERE skill_id = $1`, 
            [id, b.name, b.amzn_id, b.summary, b.description, b.keywords, 
            {value: b.invocations}, b.small_icon, b.large_icon, b.category], (err) => {
            if(err){
                console.log(err);
                res.sendStatus(500);
            }else{
                res.sendStatus(200);
            }
        })
    }
}

return {
    patchSkill: patchSkill,
    getSkills: getSkills,
    getSkill: getSkill,
    deleteSkill: deleteSkill,
    setSkill: setSkill
}}
