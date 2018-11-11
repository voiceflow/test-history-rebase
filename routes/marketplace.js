const { pool, hashids, docClient } = require('./../services');
const { renderDiagram } = require('./diagram');

const hashIds = (rows) => {
	for(var i=0;i<rows.length;i++){
		rows[i].skill_id = hashids.encode(rows[i].skill_id);
		rows[i].module_id = hashids.encode(rows[i].module_id);
		rows[i].creator_id = hashids.encode(rows[i].creator_id);
	}
}

const getModules = (req, res) => {
	pool.query('SELECT * FROM modules ORDER BY created LIMIT 10', 
        [], (err, data) => {
        if(err){
            res.sendStatus(500);
        }else{
        	hashIds(data.rows);
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
        	hashIds(data.rows);
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
			`SELECT * FROM versions, modules WHERE versions.module_id = modules.module_id AND skill_id = $1 ORDER BY version_id DESC LIMIT 1`,
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
						`INSERT INTO versions (module_id, diagram_id, version_id) VALUES ($1, $2, $3)`, 
						[module_id, diagram_id, version_id],
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
			}
		);	
	}

	const getModule = (skill_id, diagram_id) => {
		pool.query(`SELECT * FROM modules WHERE skill_id = $1`, [skill_id],
			(err, data) => {
				if(err){
					console.log(err);
					res.sendStatus(500);
				}else{
					if(data.rows.length > 0){
						createNewVersion(skill_id, diagram_id, data.rows[0].module_id);
					}
				}
			}
		);
	}

	const checkVersions = (skill_id, diagram_id) => {
		pool.query(`SELECT * FROM versions, modules WHERE versions.module_id = modules.module_id AND skill_id = $1 AND cert_approved IS NULL`, [skill_id],
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
						getModule(skill_id, diagram_id);					
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
		`DELETE FROM versions WHERE versions.module_id = (SELECT module_id FROM modules WHERE skill_id = $1) AND cert_approved IS NULL`,
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

const saveCertification = (req, res) => {
	let decoded_skill_id = hashids.decode(req.params.skill_id)[0];

	const createNewModule = (skill_id) => {
		pool.query(
			`INSERT INTO modules (title, descr, card_img, creator_id, skill_id, category, type, overview) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`, 
			[req.body.title, req.body.descr, req.body.card_img, req.body.creator_id, skill_id, req.body.category, req.body.type, req.body.overview],
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

	const updateModule = (skill_id, module_id) => {
		pool.query(
			`UPDATE modules SET title = $1, descr = $2, card_img = $3, category = $4, type = $5, overview = $6 WHERE module_id = $7`, 
			[req.body.title, req.body.descr, req.body.card_img, req.body.category, req.body.type, req.body.overview, module_id],
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

	const getOrCreateModule = (skill_id) => {
		pool.query(`SELECT * FROM modules WHERE skill_id = $1`, [skill_id],
			(err, data) => {
				if(err){
					console.log(err);
					res.sendStatus(500);
				}else{
					if(data.rows.length > 0){
						// There's a module for this skill
						updateModule(skill_id, data.rows[0].module_id);
					}else{
						createNewModule(skill_id);
					}
				}
			}
		);
	}

	getOrCreateModule(decoded_skill_id);
}



const giveCertification = (req, res) => {
	let skill_id = hashids.decode(req.params.skill_id)[0];

	pool.query(`SELECT * FROM , modules WHERE versions.module_id = modules.module_id AND skill_id = $1 AND cert_approved IS NULL`, [skill_id],
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
							`UPDATE versions, modules SET diagram_id = $1, cert_approved = now() WHERE versions.module_id = modules.module_id AND skill_id = $2 AND cert_approved IS NULL`,
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

const certStatus = (req, res) => {
	let skill_id = hashids.decode(req.params.skill_id)[0];

	pool.query(`SELECT * FROM versions, modules WHERE versions.module_id = modules.module_id AND skill_id = $1 AND cert_approved IS NULL`, [skill_id],
		(err, data) => {
			if(err){
				console.log(err);
				res.sendStatus(500);
			}else{
				if(data.rows.length > 0){
					res.send(true)
				}else{
					res.send(false)
				}
			}
		}
	);
}

const removeAccess = (req, res) => {
	let module_id = hashids.decode(req.params.module_id)[0];
	let user_id = req.user.id;
	pool.query(
		`DELETE FROM user_modules WHERE creator_id = $1 AND module_id = $2`,
		[user_id, module_id],
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

const hasAccess = (req, res) => {
	let module_id = hashids.decode(req.params.module_id)[0];
	let user_id = req.user.id;
	
	pool.query(
		`SELECT * FROM user_modules WHERE creator_id = $1 AND module_id = $2`,
		[user_id, module_id],
		(err, data) => {
			if(err){
				console.log(err);
				res.sendStatus(500);
			}else{
				if(data.rows.length > 0){
					res.send(true);
				}else{
					res.send(false);
				}
			}
		}
	)
}

const giveAccess = (req, res) => {
	let module_id = hashids.decode(req.params.module_id)[0];
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

const getModule = (req, res) => {
	let module_id = hashids.decode(req.params.module_id)[0];

	pool.query(`SELECT title, descr, card_img, name, email, category, type, overview FROM modules, creators WHERE module_id = $1 AND modules.creator_id = creators.creator_id`, [module_id], (err, data) => {
		if(err){
			console.log(err);
			res.sendStatus(500);
		}else{
			if(data.rows.length > 0){
				res.send(data.rows[0]);
			}else{
				res.sendStatus(404);
			}
		}
	});
}

const getCertModule = (req, res) => {
	let skill_id = hashids.decode(req.params.skill_id)[0];

	pool.query(`SELECT title, descr, card_img, name, email, category, type, overview FROM modules, creators WHERE skill_id = $1 AND modules.creator_id = creators.creator_id`, [skill_id], (err, data) => {
		if(err){
			console.log(err);
			res.sendStatus(500);
		}else{
			if(data.rows.length > 0){
				res.send(data.rows[0]);
			}else{
				res.send(false);
			}
		}
	});
}

module.exports = {
	getModules: getModules,
	getModule: getModule,
	getFeaturedModules: getFeaturedModules,
	requestCertification: requestCertification,
	cancelCertification: cancelCertification,
	saveCertification: saveCertification,
	certStatus: certStatus,
	giveAccess: giveAccess,
	hasAccess: hasAccess,
	removeAccess: removeAccess,
	giveCertification: giveCertification,
	getCertModule: getCertModule
}