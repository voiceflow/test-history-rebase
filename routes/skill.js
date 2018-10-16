const config = require('../config/config');
const Hashids = require('hashids');

var hashids = new Hashids('XW1B36YGG8', 10);

const {docClient, pool} = require('./../services');

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

const buildSkill = (req,res) => {
     // let name = req.body.name;

     if (!req.params.id) {
         res.sendStatus(401);
     }

     let id = hashids.decode(req.params.id)[0];
    
     pool.query('SELECT * FROM skills WHERE skills.skill_id = $1;', [id], (err, data) => {
        if(err){
            console.error(err); 
            res.sendStatus(500); 
        } else { 
            let r = data.rows[0];
            let summary = r.summary;
            let testingInstructions = r.instructions;
            let allowsPurchases = r.purchase;
            let isExportCompliant = r.export;
            let isChildDirected = r.copa;
            let category = r.purchase;
            let skillCategory = r.skill;
            let doesUsePersonalInfo = r.personal;
            let invocations = r.invocations;

             let amznJSON = {
                 "vendorId": 'MVMX1EPB9U1M6',
                 "manifest": {
                     "publishingInformation": {
                         "locales": {
                             "en-US": {
                                 "summary": summary,
                                 "examplePhrases": invocations,
                                 "keywords": keywordsArr,
                                 "name": "Sample custom skill name.",
                                 "description": "This skill has basic and advanced smart devices control features."
                             }
                         },
                         "isAvailableWorldwide": false,
                         "testingInstructions": testingInstructions,
                         "category": skillCategory,
                         "distributionCountries": [
                             "US",
                             "GB"
                         ]
                     },
                     "apis": {
                         "custom": {
                             "endpoint": {
                                 "uri": `https://app.getstoryflow.com/skill/${id}`
                             }
                         }
                     },
                     "manifestVersion": "1.0",
                     "privacyAndCompliance": {
                         "allowsPurchases": allowsPurchases,
                         "locales": {
                             "en-US": {
                                 "termsOfUseUrl": "https://getstoryflow.com",
                                 "privacyPolicyUrl": "https://getstoryflow.com"
                             }
                         },
                         "isExportCompliant": isExportCompliant,
                         "isChildDirected": isChildDirected,
                         "usesPersonalInfo": doesUsePersonalInfo
                     }
                 }
            }
            
        }
    });     
}

module.exports = {
    patchSkill: patchSkill,
    getSkills: getSkills,
    getSkill: getSkill,
    deleteSkill: deleteSkill,
    setSkill: setSkill,
    buildSkill: buildSkill
}
