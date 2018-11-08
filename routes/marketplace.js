const { pool, hashids, docClient } = require('./../services');
const { renderDiagram } = require('./diagram');

const getModules = (req, res) => {
	pool.query('SELECT * FROM modules ORDER BY created LIMIT 10', 
        [], (err, data) => {
        if(err){
            res.sendStatus(500);
        }else{
            res.send(data.rows);
        }
    });
}

const getFeaturedModules = (req, res) => {
	pool.query('SELECT * FROM featured', 
        [], (err, data) => {
        if(err){
            res.sendStatus(500);
        }else{
            res.send(data.rows);
        }
    });
}

const requestCertification = (req, res) => {
	// PRepAre 2 acQUIre cANcEr ;)
	let decoded_skill_id = hashids.decode(req.params.skill_id)[0];

	const createNewVersion = (skill_id, diagram_id, module_id) => {
		// Retrieve most recent version
		pool.query(
			`SELECT * FROM versions WHERE skill_id = $1 ORDER BY version_id DESC LIMIT 1`,
			[skill_id],
			(err, data) => {
				if(err){
					console.log(err);
					res.sendStatus(500);
				}else{
					let version_id;
					if(data.rows.length > 0){
						version_id = data.rows[0].version_id + 1;
					}else{
						version_id = 1;
					}

					pool.query(
						`INSERT INTO versions (module_id, diagram_id, version_id, skill_id) VALUES ($1, $2, $3, $4)`, 
						[module_id, diagram_id, version_id, skill_id],
						(err, data) => {
							if(err){
								console.log(err);
								res.sendStatus(500);
							}
						}
					);
				}
			}
		);	
	}

	const createNewModule = (skill_id, diagram_id) => {
		// TODO: remove these hardcodes
		let hard_data = {
			title: 'bic',
			descr: 'u a bic',
			img: 'not an img',
			creator_id: 72,
			skill_id: skill_id
		}
		pool.query(
			`INSERT INTO modules (title, descr, img, creator_id, skill_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`, 
			[hard_data.title, hard_data.descr, hard_data.img, hard_data.creator_id, hard_data.skill_id],
			(err, data) => {
				if(err){
					console.log(err);
					res.sendStatus(500);
				}else{
					createNewVersion(skill_id, diagram_id, data.rows[0].module_id);
				}
			}
		);
	}

	const getOrCreateModule = (skill_id, diagram_id) => {
		pool.query(`SELECT * FROM modules WHERE skill_id = $1`, [skill_id],
			(err, data) => {
				if(err){
					console.log(err);
					res.sendStatus(500);
				}else{
					if(data.rows.length > 0){
						// There's a module for this skill
						createNewVersion(skill_id, diagram_id, data.rows[0].module_id);
					}else{
						createNewModule(skill_id, diagram_id);
					}
				}
			}
		);
	}

	const checkVersions = (skill_id, diagram_id) => {
		pool.query(`SELECT * FROM versions WHERE skill_id = $1 AND cert_approved IS NULL`, [skill_id],
			(err, data) => {
				if(err){
					console.log(err);
					res.sendStatus(500);
				}else{
					if(data.rows.length > 0){
						// Already in publishing process, return 
						res.status(400).send({
	                        message: "Flow is in the certification process"
	                    });
					}else{
						getOrCreateModule(skill_id, diagram_id);					
					}
				}
			}
		);	
	};

	const retrieveDiagrams = (skill_id) => {
		pool.query(`SELECT diagram FROM skills WHERE skill_id = $1`, [skill_id],
			(err, data) => {
				if(err){
					console.log(err);
					res.sendStatus(500);
				}else{
					checkVersions(skill_id, data.rows[0].diagram);
				}
			}
		);
	}

	retrieveDiagrams(decoded_skill_id);
}

const cancelCertification = (req, res) => {
	let decoded_skill_id = hashids.decode(req.params.skill_id)[0];
	pool.query(
		`DELETE FROM versions WHERE skill_id = $1 AND cert_approved IS NULL`,
		[decoded_skill_id],
		(err, data) => {
			if(err){
				console.log(err);
				res.sendStatus(500);
			}else{
				res.sendStatus(200);
			}
		}
	);
}

const giveAccess = (req, res) => {
	// TODO: the module id should be hashed on front end let module_id = 
	let module_id = req.params.module_id;
	let creator_id = req.user.id;
	
	pool.query(
		`SELECT * FROM user_modules WHERE module_id = $1 AND creator_id = $2`,
		[module_id, creator_id],
		(err, data) => {
			if(err){
				console.log(err);
				res.sendStatus(500);
			}else{
				if(data.rows.length > 0){
					res.sendStatus(400);
				}else{
					pool.query(
						`INSERT INTO user_modules (creator_id, module_id) VALUES ($1, $2)`,
						[creator_id, module_id],
						(err, data) => {
							if(err){
								console.log(err);
								res.sendStatus(500);
							}else{
								res.sendStatus(200);
							}
						}
					)
				}
			}
		}
	);
}

const giveCertification = (req, res) => {
	let skill_id = hashids.decode(req.params.skill_id)[0];

	pool.query(`SELECT * FROM versions WHERE skill_id = $1 AND cert_approved IS NULL`, [skill_id],
		async (err, data) => {
			if(err){
				console.log(err);
				res.sendStatus(500);
			}else{
				if(data.rows.length > 0){
					let market_id = data.rows[0].version_id + '-' + hashids.encode(skill_id);
					let status = await renderDiagram(req.user, data.rows[0].diagram_id, skill_id, undefined, undefined, 'market', market_id);
					if(status === 200){
						pool.query(
							`UPDATE versions SET diagram_id = $1, cert_approved = now() WHERE skill_id = $2 AND cert_approved IS NULL`,
							[market_id, skill_id],
							(err, data) => {
								if(err){
									console.log(err);
									res.sendStatus(500);
								}else{
									res.sendStatus(200);
								}
							}
						)	
					}else{
						res.sendStatus(500);
					}
				}else{
					res.sendStatus(400);				
				}
			}
		}
	);	
}

module.exports = {
	getModules: getModules,
	getFeaturedModules: getFeaturedModules,
	requestCertification: requestCertification,
	cancelCertification: cancelCertification,
	giveAccess: giveAccess,
	giveCertification: giveCertification
}