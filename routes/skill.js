const axios = require('axios');
const {docClient, pool, config, hashids} = require('./../services');
const {AccessToken} = require('./authentication');
const JSONs = require('./../config/amazon_json');

const locales = ["en-CA", "en-AU", "en-GB", "en-US", "en-IN"];

exports.getSkills = (req, res) => {
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

exports.getSkill = (req, res) => {
    if (!req.params.id) {
        res.sendStatus(401);
        return;
    }

    let id = hashids.decode(req.params.id)[0];
    let sql;
    let params;
    if(req.query.preview){
        // expose as little information as possible if previewing
        sql = `
            SELECT
                name
            FROM
                skills
            WHERE
                skill_id = $1 LIMIT 1`;
        params = [id];
    }else if(req.query.simple){
        sql = `
            SELECT
                name, amzn_id, review, live, diagram, locales, restart, global, intents, intents_open, slots, slots_open, inv_name
            FROM
                skills
            WHERE
                skill_id = $1 AND
                creator_id = $2 LIMIT 1`;
        params = [id, req.user.id];
    }else{
        sql = `
            SELECT
                *
            FROM
                skills
            WHERE
                skill_id = $1 AND
                creator_id = $2 LIMIT 1`;
        params = [id, req.user.id];
    }

    pool.query( sql, params, (err, data) => {
        if(err){
            console.error(err);
            res.sendStatus(500);
        }else if(data.rows.length === 0){
            res.sendStatus(404);
        }else{
            let skill = data.rows[0];
            // Rehash the skill id
            skill.skill_id = req.params.id;

            if(req.query.preview || !skill.amzn_id){
                res.send(skill);
            }else{
                // Sync up with AMAZON
                // Check Current Amazon Status
                AccessToken(req.user.id, async (token) => {
                    if(token === null){
                        // throw('INVALID TOKEN');
                        return res.send(skill);
                    }

                    try {
                        // get the vendorID
                        let vendor_response = await axios.request({
                            url: 'https://api.amazonalexa.com/v1/vendors',
                            method: 'get',
                            headers: {
                                authorization: token
                            }
                        });

                        let vendors = vendor_response.data.vendors;
                        let vendorId;
                        if(Array.isArray(vendors) && vendors.length !== 0){
                            vendorId = vendors[0].id;
                            // literal storyflow id amzn1.ask.skill.b8413998-5296-4cca-8a0f-6c04103cc3eb
                            let skill_status = await axios.request({
                                url: `https://api.amazonalexa.com/v1/skills?vendorId=${vendorId}&skillId=${skill.amzn_id}`,
                                method: 'GET',
                                headers: {
                                    Authorization: token
                                }
                            });

                            if(Array.isArray(skill_status.data.skills)){
                                if(skill_status.data.skills.length === 0){
                                    // If 0 reset
                                    skill.review = false;
                                    skill.live = false;
                                    skill.amzn_id = null;
                                    res.send(skill);
                                    pool.query('UPDATE skills SET review=FALSE, live=FALSE, amzn_id=NULL WHERE skill_id = $1', [id]);
                                    return;
                                }

                                let still_review = false;
                                let has_live = false;

                                for(instance of skill_status.data.skills){
                                    if(instance.publicationStatus === 'PUBLISHED'){
                                        has_live = true;
                                    }
                                    if(instance.publicationStatus === 'CERTIFICATION'){
                                        still_review = true;
                                    }
                                }

                                let update = false;
                                if(skill.live !== has_live){
                                    skill.live = has_live;
                                    update = true;
                                }
                                if(skill.review !== still_review) {
                                    skill.review = still_review;
                                    update = true;
                                }

                                if(update){
                                    pool.query('UPDATE skills SET review=$1, live=$2 WHERE skill_id=$3 AND creator_id=$4', [skill.review, skill.live, id, req.user.id]);
                                }

                                res.send(skill);

                            }else{
                                throw('NO SKILLS FOUND skill.js > 120');
                            }
                        }

                    }catch(err){
                        console.log(err);
                        res.send(skill);
                    }
                });
            }
        }
    });
};

exports.getDiagrams = (req, res) => {
    if (!req.params.id) {
        res.sendStatus(401);
        return;
    }

    let sql = `SELECT d.id, d.name, d.sub_diagrams FROM diagrams d
        INNER JOIN skills s ON s.skill_id = d.skill_id WHERE d.skill_id = $1`

    let id = hashids.decode(req.params.id)[0];

    pool.query(sql, [id], (err, data) => {
        if(err){
            console.error(err);
            console.trace();
            res.sendStatus(500);
        }else{
            res.send(data.rows);
        }
    });
}

exports.deleteSkill = (req, res) => {
    if (!req.user || !req.params.id) {
        res.sendStatus(401);
        return;
    }

    let id = hashids.decode(req.params.id)[0];
    pool.query('SELECT * FROM skills WHERE creator_id = $1 AND skill_id = $2', [req.user.id, id], (err, results) => {
        // Delete off Amazon
        if(results.rows[0].amzn_id){
            AccessToken(req.user.id, token => {
                if(token === null){
                    return;
                }
    
                axios.request({
                    url: `https://api.amazonalexa.com/v1/skills/${results.rows[0].amzn_id}`,
                    method: 'DELETE',
                    headers: {
                        Authorization: token
                    }
                })
                .then(response => {
                    // Successfully deleted
                })
                .catch(err => {
                    console.log(err);
                });
            });
        }
        
        // Delete off our servers
        pool.query('DELETE FROM skills WHERE creator_id = $1 AND skill_id = $2', [req.user.id, id], (err) => {
            if(err){
                res.sendStatus(500);
            }else{
                res.sendStatus(200);
            }
        });
    });
};

exports.setSkill = (req, res) => {
    if (!req.user || !req.body.name || !req.body.diagram) {
        res.sendStatus(401);
        return;
    }

    let name = req.body.name;
    let value = {value: [`open ${name}`,`start ${name}`, `launch ${name}`]}
    let sum = `This is a new summary for the skill ${name}`;
    let desc = `This is a new description for the skill ${name}\n\n Be sure to leave a 5-star review!`

    pool.query(`
            INSERT INTO skills (
                name, diagram, creator_id, summary, description, invocations, inv_name
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7
            ) RETURNING skill_id`, 
            [name, req.body.diagram, req.user.id, sum, desc, value, name], (err, data) => {
        if(err){
            console.error(err); 
            res.sendStatus(500); 
        } else { 
            res.send({id: hashids.encode(data.rows[0].skill_id)}) 
        }
    });
};

exports.patchSkill = (req, res) => {
    if (!req.user || !req.params.id || !req.body) {
        res.sendStatus(401);
        return;
    }

    let id = hashids.decode(req.params.id)[0];

    // only need to update the name/restart
    if(req.query.settings){
        pool.query(`UPDATE skills SET name = $1, restart = $2 WHERE skill_id = $3`, [req.body.name, req.body.restart, id], (err) => {
            if(err){
                res.sendStatus(500);
            }else{
                res.sendStatus(200);
            }
        });
        return;
    }

    let b = req.body;

    if(!b.locales){
        b.locales = '["en-US"]';
    }

    if (req.query.intents) {
        pool.query(`
            UPDATE skills 
            SET
            intents = $2,
            intents_open = $3,
            slots = $4,
            slots_open = $5
            WHERE skill_id = $1`, 
            [id, b.intents, b.intents_open, b.slots, b.slots_open], (err) => {
            if(err){
                console.log(err);
                res.sendStatus(500);
            }else{
                res.sendStatus(200);
            }
        })
    } else if(req.query.publish){
        pool.query(`
            UPDATE skills 
            SET
            name = $2,
            inv_name = $3,
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
            instructions = $16,
            locales = $17,
            privacy_policy = $18,
            terms_and_cond = $19
            WHERE skill_id = $1`, 
            [id, b.name, b.inv_name, b.summary, b.description, b.keywords, 
            {value: b.invocations}, b.small_icon, b.large_icon, b.category, 
            b.purchase, b.personal, b.copa, b.ads, b.export, b.instructions, b.locales,
            b.privacy_policy, b.terms_and_cond], (err) => {
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
            inv_name = $3,
            summary = $4, 
            description = $5,
            keywords = $6, 
            invocations = $7, 
            small_icon = $8, 
            large_icon = $9, 
            category = $10,
            locales = $11,
            privacy_policy = $12,
            terms_and_cond = $13
            WHERE skill_id = $1`, 
            [id, b.name, b.inv_name, b.summary, b.description, b.keywords, 
            {value: b.invocations}, b.small_icon, b.large_icon, b.category, b.locales,
            b.privacy_policy, b.terms_and_cond], (err) => {
            if(err){
                console.log(err);
                res.sendStatus(500);
            }else{
                res.sendStatus(200);
            }
        })
    }
}

// Helper Function
const getSkillPermissions = (skill_id) => new Promise((resolve, reject) => {
    let sql = `SELECT d.permissions FROM diagrams d WHERE d.skill_id = $1`
    pool.query(sql, [skill_id], (err, data) => {
        if(err){
            console.error(err);
            console.trace();
            reject(new Error(err))
        }else{
            resolve(data.rows);
        }
    });
})

exports.buildSkill = async (req,res) => {
    if (!req.params.id) {
        res.sendStatus(401)
    }

    let id = hashids.decode(req.params.id)[0];
    let original_id = req.params.id

    // Get permissions
    const permissions_arr = await getSkillPermissions(id)
    let permissions = new Set()

    permissions_arr.forEach(r => {
        r.permissions.forEach((perm => {
            if (perm !== 'payments:autopay_consent') {
                // lmao amazon engineering
                permissions.add(perm)
            }
        }))
    })
    
    permissions = Array.from(permissions).map(perm => {return {name: perm}})

    AccessToken(req.user.id, token => {
        if(token === null){
            res.status(401).send({
                message: "Invalid Amazon Login Token"
            });
            return;
        }
    
        pool.query('SELECT * FROM skills WHERE skills.skill_id = $1 LIMIT 1', [id], async (err, data) => {
            if(err){
                console.error(err) 
                res.sendStatus(500)
            } else { 
                
                let r = data.rows[0]

                let amzn_id = r.amzn_id
                r.permissions = permissions
                let manifest = JSONs.manifest(r, original_id)
                
                try{
                    if(amzn_id){
                        try{
                            let request = await axios.request({
                                url: `https://api.amazonalexa.com/v1/skills/${encodeURI(amzn_id)}/stages/development/manifest`,
                                method: 'GET',
                                headers: {
                                    Authorization: token
                                }
                            });
                            if (request.data.manifest && 
                                request.data.manifest.lastUpdateRequest &&
                                request.data.manifest.lastUpdateRequest.status === 'FAILED'){
                                amzn_id = null;
                            }
                            // console.log(JSON.stringify(request.data.manifest));
                        }catch(err){
                            if(err.response.status === 404){
                                amzn_id = null;
                            }else if(err.response){
                                console.error(err.response.status);
                                console.error(JSON.stringify(err.response.data));
                            }
                        }
                    }

                    if(!amzn_id){

                        let vendor_request = await axios.request({
                            url: 'https://api.amazonalexa.com/v1/vendors',
                            method: 'GET',
                            headers: {
                                Authorization: token
                            }
                        });

                        let vendors = vendor_request.data.vendors;
                        if(Array.isArray(vendors) && vendors.length !== 0){
                            manifest.vendorId = vendors[0].id;
                        }else{
                            throw ({
                                type: "VendorIdError",
                                data: JSON.stringify(vendor_request.data)
                            });
                        }
                        

                        let request = await axios.request({
                            url: 'https://api.amazonalexa.com/v1/skills',
                            method: 'POST',
                            headers: {
                                Authorization: token
                            },
                            data: manifest
                        });

                        amzn_id = request.data.skillId;

                        await pool.query("UPDATE skills SET amzn_id = $1 WHERE skill_id = $2", [amzn_id, r.skill_id]);
                    }else{

                        let request = await axios.request({
                            url: `https://api.amazonalexa.com/v1/skills/${encodeURI(amzn_id)}/stages/development/manifest`,
                            method: 'PUT',
                            headers: {
                                Authorization: token
                            },
                            data: manifest
                        });
                    }

                    let model = JSONs.interactionModel(r);

                    const iterate = (depth) => {
                        if(depth === 3){
                            res.status(500).send({
                                message: "Skill is taking too long to be initialized"
                            });
                            return;
                        }else{
                            setTimeout(()=> {
                                
                                const interactionModels = []
                                r.locales.forEach(locale => {
                                    interactionModels.push(axios.request({
                                        url: `https://api.amazonalexa.com/v1/skills/${encodeURI(amzn_id)}/stages/development/interactionModel/locales/${locale}`,
                                        method: 'PUT',
                                        headers: {
                                            Authorization: token
                                        },
                                        data: model
                                    }))
                                })

                                Promise.all(interactionModels)
                                .then(() => {
                                    // Check whether building before certifying
                                    const getSkillStatus = (depth) => {
                                        setTimeout(() => {
                                            axios.request({
                                                url: `https://api.amazonalexa.com/v1/skills/${amzn_id}/stages/development/manifest`,
                                                method: 'GET',
                                                headers: {
                                                    Authorization: token
                                                }
                                            })
                                            .then(response => {
                                                if(response.hasOwnProperty('violations')){
                                                    getSkillStatus(depth + 1)
                                                }else{
                                                    res.send(amzn_id)
                                                }
                                            })
                                            .catch(err => {
                                                console.log(err.response.status)
                                                res.status(500).send(err.response.data)
                                            });
                                        }, 10000)
                                    }
                                    getSkillStatus(0)
                                })
                                .catch(err => {
                                    console.log(err.response)
                                    if(err.response){
                                        if(err.response.status === 404){
                                            iterate(depth + 1)
                                        }else{
                                            console.error(err.response.data)
                                            res.status(500).send(err.response.data)
                                        }
                                    }else{
                                        console.log(err)
                                        res.sendStatus(500)
                                    }
                                })
                            }, 5000)
                        }
                    }

                    iterate(0);

                } catch(err) {
                    if(err.type === "VendorIdError"){
                        // console.error(err);
                        res.sendStatus(403);
                    }else{
                        if(err.response){
                            // console.error(err.response.status);
                            console.error(JSON.stringify(err.response.data));
                            res.status(500).send(err.response.data);
                        }else{
                            console.error(err);
                            res.sendStatus(500);
                        }
                    }
                }
            }
        }); 
    });    
}

exports.certifySkill = (req, res) => {
    if (!req.params.amzn_id) {
        res.sendStatus(401);
    }

    AccessToken(req.user.id, token => {
        if(token === null){
            res.status(401).send({
                message: "Invalid Amazon Login Token"
            });
            return;
        }
        // Check whether building before certifying
        const getSkillStatus = (depth) => {
            setTimeout(() => {
                axios.request({
                    url: `https://api.amazonalexa.com/v1/skills/${req.params.amzn_id}/stages/development/manifest`,
                    method: 'GET',
                    headers: {
                        Authorization: token
                    }
                })
                .then(response => {
                    if(response.hasOwnProperty('violations')){
                        getSkillStatus(depth + 1);
                    }else{
                        axios.request({
                            url: `https://api.amazonalexa.com/v1/skills/${req.params.amzn_id}/submit`,
                            method: 'POST',
                            headers: {
                                Authorization: token
                            }
                        })
                        .then(response => {
                            pool.query(`
                                UPDATE skills 
                                SET
                                review = TRUE
                                WHERE amzn_id = $1`, 
                                [req.params.amzn_id], 
                                (err) => {
                                    if(err){
                                        console.log(err);
                                        res.sendStatus(500);
                                    }else{
                                        res.sendStatus(200);
                                    }
                                }
                            );
                        })
                        .catch(err => {
                            console.log(err);
                            res.sendStatus(500);
                        });
                    }
                })
                .catch(err => {
                    console.log(err.response.status);
                    res.status(500).send(err.response.data);
                });
            }, 10000);
        }
        getSkillStatus(0);
    });
}

exports.withdrawSkill = (req, res) => {
    if (!req.params.amzn_id) {
        res.sendStatus(401);
    }

    AccessToken(req.user.id, token => {
        if(token === null){
            res.status(401).send({
                message: "Invalid Amazon Login Token"
            });
            return;
        }
        
        axios.request({
            url: `https://api.amazonalexa.com/v1/skills/${req.params.amzn_id}/withdraw`,
            method: 'POST',
            headers: {
                Authorization: token,
            },
            data: {
                //TODO: make this custom, not hardcoded
                reason: 'MORE_FEATURES'
            }
        })
        .then(response => {
             pool.query(`
                UPDATE skills 
                SET
                review=FALSE
                WHERE amzn_id = $1`, 
                [req.params.amzn_id, 0], 
                (err) => {
                    if(err){
                        console.log(err);
                        res.sendStatus(500);
                    }else{
                        res.sendStatus(200);
                    }
                }
            );
        })
        .catch(err => {
            console.log(err.response.status);
            res.status(500).send(err.response.data);
        });
    });
}
