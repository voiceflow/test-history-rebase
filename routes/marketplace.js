const { pool, hashids, docClient, writeToLogs } = require('./../services');
const { renderDiagram } = require('./diagram')
const { copySkill } = require('./skill_util')
const { latestSkillToIntercom, incrementSkillsCreatedIntercom } = require('./skill')

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	ADMIN_MARKETPLACE_ACC = 19
}else{
	ADMIN_MARKETPLACE_ACC = 2125
}

const module_limit = 10;
const hashIds = (rows) => {
	for(var i=0;i<rows.length;i++){
		rows[i].skill_id = hashids.encode(rows[i].skill_id);
		rows[i].module_id = hashids.encode(rows[i].module_id);
		rows[i].creator_id = hashids.encode(rows[i].creator_id);
	}
}

const getModules = (req, res) => {
	pool.query('SELECT * FROM modules INNER JOIN (SELECT DISTINCT module_id FROM versions WHERE cert_approved IS NOT NULL) AS distinct_versions ON modules.module_id = distinct_versions.module_id INNER JOIN creators ON creators.creator_id = modules.creator_id LIMIT $1', 
        [module_limit], (err, data) => {
        if(err){
            res.sendStatus(500);
        }else{
        	hashIds(data.rows);
            res.send(data.rows);
        }
    });
}

const getFeaturedModules = (req, res) => {
	pool.query('SELECT * FROM featured INNER JOIN modules ON featured.module_id = modules.module_id', 
        [], (err, data) => {
        if(err){
            res.sendStatus(500);
        }else{
        	hashIds(data.rows);
            res.send(data.rows);
        }
    });
}

const cancelCertification = (req, res) => {
	let decoded_skill_id = hashids.decode(req.params.skill_id)[0];
	pool.query(
		`DELETE FROM versions WHERE versions.module_id = (SELECT module_id FROM modules WHERE skill_id = $1) AND cert_approved IS NULL`,
		[decoded_skill_id],
		(err, data) => {
			if(err){
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
				res.sendStatus(500);
			}else{
				res.sendStatus(200);
			}
		}
	);
}

const saveCertification = (req, res) => {
	let decoded_skill_id = hashids.decode(req.params.skill_id)[0];

	const createNewModule = (skill_id, global) => {
		pool.query(
			`INSERT INTO modules (title, descr, creator_id, skill_id, tags, type, overview, module_icon, color, input, output, global) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`, 
			[req.body.title, req.body.descr, req.body.creator_id, skill_id, req.body.tags, req.body.type, req.body.overview, req.body.module_icon, req.body.color, req.body.input, req.body.output, global],
			(err, data) => {
				if(err){
					writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
					res.sendStatus(500);
				}else{
					res.sendStatus(200);
				}
			}
		);
	}

	const updateModule = (module_id, global) => {
		pool.query(
			`UPDATE modules SET title = $1, descr = $2, tags = $3, type = $4, overview = $5, module_icon = $6, color = $7, input = $8, output = $9, global = $10 WHERE module_id = $11`, 
			[req.body.title, req.body.descr, req.body.tags, req.body.type, req.body.overview, req.body.module_icon, req.body.color, req.body.input, req.body.output, global, module_id],
			(err, data) => {
				if(err){
					writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
					res.sendStatus(500);
				}else{
					res.sendStatus(200);
				}
			}
		);
	}

	const getOrCreateModule = (skill_id, global) => {
		pool.query(`SELECT * FROM modules WHERE skill_id = $1`, [skill_id],
			(err, data) => {
				if(err){
					writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
					res.sendStatus(500);
				}else{
					if(data.rows.length > 0){
						// There's a module for this skill
						updateModule(data.rows[0].module_id, global);
					}else{
						createNewModule(skill_id, global);
					}
				}
			}
		);
	}

	pool.query(`SELECT global FROM skills WHERE skill_id = $1`, [decoded_skill_id],
	 	(err, data) => {
			if(err){
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
				res.sendStatus(500)
			}else{
				if(data.rows.length > 0){
					getOrCreateModule(decoded_skill_id, JSON.stringify(data.rows[0].global));
				}else{
					res.sendStatus(404)
				}
			}
		}
	)
}



const giveCertification = (req, res) => {
	let skill_id = hashids.decode(req.params.skill_id)[0];

	const updateVersionTable = (market_id, module_id, template_skill_id) => {
		pool.query(
			`UPDATE versions SET diagram_id = $1, cert_approved = now(), template_skill_id = $2 WHERE module_id = $3 AND cert_approved IS NULL`,
			[market_id, template_skill_id, module_id],
			(err, data) => {
				if(err){
					writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
					res.sendStatus(500);
				}else{
					res.sendStatus(200);
				}
			}
		)	
	}

	pool.query(`SELECT * FROM versions, modules WHERE versions.module_id = modules.module_id AND modules.skill_id = $1 AND cert_approved IS NULL`, [skill_id],
		async (err, data) => {
			if(err){
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
				res.sendStatus(500);
			}else{
				if(data.rows.length > 0){
					let version_id = data.rows[0].version_id
					let diagram_id = data.rows[0].diagram_id
					let module_id = data.rows[0].module_id
					let skill_id = data.rows[0].skill_id
					let market_id = "$" + version_id + '_' + diagram_id
					

					if(data.rows[0].type === 'FLOW') {
						let status = await renderDiagram(req.user, diagram_id, skill_id, {version: version_id, type: 'MARKET'});
						if(status === 200){
							updateVersionTable(market_id, module_id);
						}else{
							console.log("Failed to render diagram")
							res.sendStatus(500);
						}
					} else {
						// Alter request object to conform to copy skill, able to do this since we don't use req anymore in this fcn
						req.params.id = hashids.encode(skill_id)
						req.params.target_creator = ADMIN_MARKETPLACE_ACC
						req.user.id = data.rows[0].creator_id
						copySkill(req, res, {copying_default_template: true}, (row) => {
							let new_skill_id = hashids.decode(row.skill_id)[0]
							updateVersionTable(row.diagram, module_id, new_skill_id)
						})
					}
					
				}else{
					res.sendStatus(400);				
				}
			}
		}
	);	
}

const requestCertification = (req, res) => {
	// PRepAre 2 acQUIre cANcEr ;)
	let decoded_skill_id = hashids.decode(req.params.skill_id)[0]

	const createNewVersion = (skill_id, diagram_id, module_id, global) => {
		// Retrieve most recent version
		pool.query(
			`SELECT * FROM versions, modules WHERE versions.module_id = modules.module_id AND modules.skill_id = $1 ORDER BY version_id DESC LIMIT 1`,
			[skill_id],
			(err, data) => {
				if(err){
					writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
					res.sendStatus(500)
				}else{
					let version_id
					let input_array = "[]"
					let output_array = "[]"
					if(data.rows.length > 0){
						version_id = data.rows[0].version_id + 1
						input_array = data.rows[0].input
						output_array = data.rows[0].output
					}else{
						version_id = 1
					}

					pool.query(
						`INSERT INTO versions (module_id, diagram_id, version_id, input, output, global) VALUES ($1, $2, $3, $4, $5, $6)`, 
						[module_id, diagram_id, version_id, input_array, output_array, global],
						(err, data) => {
							if(err){
								writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
								res.sendStatus(500)
							}else{
								res.sendStatus(200)
							}
						}
					)
				}
			}
		)
	}

	const getModule = (skill_id, diagram_id) => {
		pool.query(`SELECT * FROM modules WHERE modules.skill_id = $1`, [skill_id],
			(err, data) => {
				if(err){
					writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
					res.sendStatus(500);
				}else{
					if(data.rows.length > 0){
						createNewVersion(skill_id, diagram_id, data.rows[0].module_id, JSON.stringify(data.rows[0].global));
					}
				}
			}
		);
	}

	const checkVersions = (skill_id, diagram_id) => {
		pool.query(`SELECT * FROM versions, modules WHERE versions.module_id = modules.module_id AND modules.skill_id = $1 AND cert_approved IS NULL`, [skill_id],
			(err, data) => {
				if(err){
					writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
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
					writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
					res.sendStatus(500);
				}else{
					checkVersions(skill_id, data.rows[0].diagram);
				}
			}
		);
	}

	retrieveDiagrams(decoded_skill_id);
}

const certStatus = (req, res) => {
	let skill_id = hashids.decode(req.params.skill_id)[0];

	pool.query(`SELECT * FROM versions, modules WHERE versions.module_id = modules.module_id AND modules.skill_id = $1 AND cert_approved IS NULL`, [skill_id],
		(err, data) => {
			if(err){
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
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
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
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
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
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
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
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
								writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
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

	pool.query(`SELECT * FROM modules, creators WHERE module_id = $1 AND modules.creator_id = creators.creator_id`, [module_id], (err, data) => {
		if(err){
			writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
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

	const retrieveVariables = (row) => {
		pool.query(
			`SELECT diagram FROM skills WHERE skill_id = $1`, 
			[skill_id],
			(err, data) =>{
				if(err){
					writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
					res.sendStatus(500);
				}else{
					if(data.rows.length > 0){
						let params = {
					        TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
					        Key: {'id': data.rows[0].diagram}
					    };
					    docClient.get(params, (err, data) => {
					        if (err) {
					            writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
					            res.sendStatus(err.statusCode);
					        } else if (data.Item) {
					            let diagram = data.Item;

					            row.variables = diagram.variables;
					            res.send(row);
					        } else {
					            res.sendStatus(404);
					        }
					    });
					}else{
						res.send(row);
					}
				}
			}
		);
	}

	pool.query(`SELECT title, descr, name, email, tags, type, overview, module_icon, color, input, output FROM modules, creators WHERE skill_id = $1 AND modules.creator_id = creators.creator_id`, [skill_id], (err, data) => {
		if(err){
			writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
			res.sendStatus(500);
		}else{
			if(data.rows.length > 0){
				//res.send(data.rows[0]);
				retrieveVariables(data.rows[0]);
			}else{
				res.send(false);
			}
		}
	});
}

const getUserModules = (req, res) => {
	let user_id = req.user.id;

	pool.query(
		`
		 SELECT modules.module_id, modules.descr, modules.title, modules.module_icon, ultimate_versions.version_id, 
		 		ultimate_versions.diagram_id, modules.color, modules.input, modules.output, modules.type
		 FROM 
		 	(SELECT versions.module_id, versions.version_id, versions.diagram_id FROM 
		 		(SELECT module_id, max(version_id) AS version_id FROM versions GROUP BY module_id) AS max_versions 
		 		INNER JOIN versions ON max_versions.module_id = versions.module_id AND max_versions.version_id = versions.version_id
		 	) AS ultimate_versions  
		 INNER JOIN modules ON ultimate_versions.module_id = modules.module_id 
		 INNER JOIN user_modules ON modules.module_id = user_modules.module_id
		 WHERE user_modules.creator_id = $1
		`,
		[user_id],
		(err, data) => {
			if(err){
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
				res.sendStatus(500);
			}else{
				hashIds(data.rows);
				res.send(data.rows);
			}
		}
	);
}

const retrieveTemplate = (req, res) => {
	let module_id = hashids.decode(req.params.module_id)[0]

	pool.query(
		`
		SELECT * FROM versions WHERE module_id = $1 AND cert_approved = (SELECT max(cert_approved) FROM versions WHERE module_id = $1)
		`,
		[module_id],
		(err, data) => {
			if(err){
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
				res.sendStatus(500)
			} else {
				if(data.rows.length > 0){
					let template_diagram_id = data.rows[0].diagram_id;
					let params = {
						TableName: `${process.env.SKILLS_DYNAMO_TABLE_BASE_NAME}.market`,
						Key: {'id': template_diagram_id}
					}
					docClient.get(params, (err, data) => {
						if (err) {
							writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
							res.sendStatus(err.statusCode)
						} else if (data.Item) {
							res.send(data.Item)
						} else {
							res.sendStatus(404)
						}
					})

				} else {
					res.sendStatus(404)
				}
			}
		}
	)
}

const getPendingModules = (req, res) => {
	pool.query(
		`
		SELECT * FROM versions JOIN modules ON versions.module_id = modules.module_id WHERE cert_approved IS NULL
		`,
		[],
		(err, data) => {
			if(err){
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
				res.sendStatus(500)
			} else {
				hashIds(data.rows)
				res.send(data.rows)
			}
		}
	)
}

const getDefaultTemplates = (req, res) => {
	pool.query(
		`
		SELECT modules.module_id, modules.descr, modules.title, modules.module_icon, ultimate_versions.version_id, 
			ultimate_versions.diagram_id, modules.color, modules.input, modules.output, modules.type, ultimate_versions.template_skill_id
		FROM 
		(SELECT versions.module_id, versions.version_id, versions.diagram_id, versions.template_skill_id FROM 
			(SELECT module_id, max(version_id) AS version_id FROM versions GROUP BY module_id) AS max_versions 
			INNER JOIN versions ON max_versions.module_id = versions.module_id AND max_versions.version_id = versions.version_id
		) AS ultimate_versions  
		INNER JOIN modules ON ultimate_versions.module_id = modules.module_id 
		WHERE modules.template_index > 0 ORDER BY modules.template_index DESC
		`,
		[],
		(err, data) => {
			if(err){
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
				res.sendStatus(500)
			} else {
				hashIds(data.rows)
				res.send(data.rows)
			}
		}
	)
}

// NEW PROJECTS CREATED HERE
const copyDefaultTemplate = (req, res) => {
	let module_id = hashids.decode(req.params.module_id)[0]
	// Retrieve diagram, trying 5 times 
	const getDiagram = (row, num_tries) => {
		let params = {
			TableName: `${getEnvVariable('DIAGRAMS_DYNAMO_TABLE')}`,
			Key: {'id': row.diagram}
		}

		docClient.get(params, (err, data) => {
			if (err) {
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
				res.sendStatus(err.statusCode)
			} else if (data.Item) {
				res.send({
					skill: row,
					diagram: data.Item
				})
			} else if (num_tries < 5) {
				getDiagram(row, num_tries + 1)
			} else {
				res.sendStatus(500)
			}
		})
	}

	const updateSkill = async (skill) => {
		if(req.body.name && Array.isArray(req.body.locales)){
			let name = req.body.name
			let invs = {value: [`open ${name}`,`start ${name}`, `launch ${name}`]}
			let sum = `This is a new summary for the skill ${name}`;
			let desc = `This is a new description for the skill ${name}\n\n Be sure to leave a 5-star review!`
			let locales = ['en-US']
			let platform = req.body.platform || 'alexa'
		
			if (req.body.locales) {
				locales = req.body.locales
			}
		
			await pool.query(`UPDATE projects SET name = $1 WHERE project_id = $2`, [name, skill.project_id])

			pool.query(`UPDATE skills SET name = $1, summary = $2, description = $3, invocations = $4, inv_name = $5, locales = $6, privacy_policy=$7, terms_and_cond=$8, platform=$9 WHERE skill_id = $10`,
					[name, sum, desc, invs, name, JSON.stringify(locales), 
						`https://creator.getvoiceflow.com/creator/privacy_policy?name=${encodeURI(req.user.name)}&skill=${encodeURI(name)}`,
						`https://creator.getvoiceflow.com/creator/terms?name=${encodeURI(req.user.name)}&skill=${encodeURI(name)}`,
						platform,
			hashids.decode(skill.skill_id)[0]], (err) => {
				if(err){
					writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
					res.sendStatus(500)
				} else {
					incrementSkillsCreatedIntercom(req.user.id)
					latestSkillToIntercom(req.user.id, name)
					res.send(skill)
				}
			})
		} else {
			res.send(skill)
		}
	}

	pool.query(`SELECT * FROM project_versions INNER JOIN modules ON project_versions.version_id = modules.skill_id WHERE modules.module_id = $1 ORDER BY cert_approved DESC LIMIT 1`,
		[module_id],
		(err, data) => {
			if(err){
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
				res.sendStatus(500)
			} else {
				if(data.rows.length > 0){
					let template_skill_id = hashids.encode(data.rows[0].version_id)
					req.params.id = template_skill_id
					req.params.target_creator = req.user.id
					req.user.id = ADMIN_MARKETPLACE_ACC
					copySkill(req, res, {copying_default_template: true}, updateSkill)
				} else {
					res.sendStatus(500)
				}
			}
		}
	)
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
	getCertModule: getCertModule,
	getUserModules: getUserModules,
	retrieveTemplate: retrieveTemplate,
	getPendingModules: getPendingModules,
	getDefaultTemplates: getDefaultTemplates,
	copyDefaultTemplate: copyDefaultTemplate
}