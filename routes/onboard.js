const { pool } = require('./../services');

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

const submitOnboardSurvey = (req, res) => {
	pool.query(
		"INSERT INTO user_info (creator_id, usage_type, company_name, role, company_size, industry, org) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		[req.user.id, req.body.usage_type, req.body.company_name, req.body.role, req.body.company_size, req.body.industry, req.body.org],
		(err, data) => {
			if(err){
				console.log(err);
				res.sendStatus(500);
			} else {
				res.sendStatus(200);
			}
		}
	);
}

module.exports = {
	checkIfOnboarded: checkIfOnboarded,
	submitOnboardSurvey: submitOnboardSurvey
}