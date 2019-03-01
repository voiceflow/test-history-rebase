const { pool, intercom, writeToLogs } = require('./../services');

const checkIfOnboarded = (req, res) => {
	pool.query("SELECT * FROM user_info WHERE creator_id = $1", [req.user.id],
		(err, data) => {
			if(err){
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
				res.sendStatus(500);
			} else {
				if(data.rows.length > 0){
					res.send(true);
				} else {
					res.send(false);
				}
			}
		}
	);
}

const PROG_XP = (xp) => {
	switch(xp){
		case 'intermediate':
			return 'OKAY'
		case 'expert':
			return 'GOD'
		default:
			return 'NOOB'
	}
}

const convertToOld = (xp) => {
	switch(xp){
		case 'intermediate':
			return 1
		case 'expert':
			return 2
		default:
			return 0
	}
}

const submitOnboardSurvey = (req, res) => {
	if(!req.body.usage_type){
		req.body.usage_type = 'PERSONAL'
	}
	pool.query(
		"INSERT INTO user_info (creator_id, usage_type, company_name, xp, design, build) VALUES ($1, $2, $3, $4, $5, $6)",
		[req.user.id, req.body.usage_type, req.body.company_name, convertToOld(req.body.programming), req.body.design, req.body.build],
		(err, data) => {
			if(err){
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
				res.sendStatus(500)
			} else {
				res.sendStatus(200)
				intercom.users.create({
					user_id: req.user.id,
					email: req.user.email,
					name: req.user.name,
					custom_attributes: {
						usage: req.body.usage_type,
						company: req.body.company_name,
						design: req.body.design,
						build: req.body.build,
						programming_experience: PROG_XP(req.body.programming)
					}
				})
			}
		}
	);
}

module.exports = {
	checkIfOnboarded: checkIfOnboarded,
	submitOnboardSurvey: submitOnboardSurvey
}