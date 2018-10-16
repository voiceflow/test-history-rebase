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

const builtSkill = (req,res) => {
    
    if(!req.params.id){
        res.sendStatus(401);
        return;
    }

    // let name = req.body.name;

    pool.query('SELECT summary FROM skills WHERE skills.skill_id = $2;', [req.user.id])

    let amznJSON = 
    {
        "vendorId": vendorID,
        "manifest": {
            "publishingInformation": {
                "locales": {
                    "en-US": {
                        "summary": summary,
                        "examplePhrases": [
                            "Alexa, open sample skill.",
                            "Alexa, turn on kitchen lights.",
                            "Alexa, blink kitchen lights."
                        ],
                        // "keywords": [
                        //     "Smart Home",
                        //     "Lights",
                        //     "Smart Devices"
                        // ],

                        "keywords": keywordsArr
                        "name": "Sample custom skill name.",
                        "description": "This skill has basic and advanced smart devices control features."
                    }
                },
                "isAvailableWorldwide": false,
                "testingInstructions": testingInstructions,
                "category": "SMART_HOME",
                "distributionCountries": [
                    "US",
                    "GB"
                ]
            },
            "apis": {
                "custom": {
                    "endpoint": {
                        "uri": "arn:aws:lambda:us-east-1:032174894474:function:ask-custom-custome_cert"
                    }
                }
            },
            "manifestVersion": "1.0",
            "privacyAndCompliance": {
                "allowsPurchases": allowsPurchases,
                "locales": {
                    "en-US": {
                        "termsOfUseUrl": "http://www.termsofuse.sampleskill.com",
                        "privacyPolicyUrl": "http://www.myprivacypolicy.sampleskill.com"
                    }
                },
                "isExportCompliant": isExportCompliant,
                "isChildDirected": isChildDirected,
                "usesPersonalInfo": doesUsePersonalInfo
            }
        }
    }
}

return {
    getSkills: getSkills,
    deleteSkill: deleteSkill,
    setSkill: setSkill
}}
