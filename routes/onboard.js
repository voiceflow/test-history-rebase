const { pool, intercom } = require('./../services');

const checkIfOnboarded = (req, res) => {
	pool.query("SELECT * FROM user_info WHERE creator_id = $1", [req.user.id],
		(err, data) => {
			if(err){
				console.log(err);
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
		case 1:
			return 'OKAY'
		case 2:
			return 'GOD'
		default:
			return 'NOOB'
	}
}

const submitOnboardSurvey = (req, res) => {
	if(!req.body.usage_type){
		req.body.usage_type = 'PERSONAL'
	}

	pool.query(
		"INSERT INTO user_info (creator_id, usage_type, company_name, role, company_size, industry, xp) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		[req.user.id, req.body.usage_type, req.body.company_name, req.body.role, req.body.company_size, req.body.industry, req.body.programming],
		(err, data) => {
			if(err){
				console.log(err)
				res.sendStatus(500)
			} else {
				res.sendStatus(200)
				intercom.users.create({
					user_id: req.user.id,
					custom_attributes: {
						usage: req.body.usage_type,
						company: req.body.company_name,
						role: req.body.role,
						company_size: req.body.company_size,
						industry: req.body.industry,
						organization: req.body.org,
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