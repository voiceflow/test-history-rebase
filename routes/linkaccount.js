const { pool, hashids, jwt, writeToLogs } = require('./../services');
const isVarName = require('is-var-name');

 exports.getTemplate = (req, res) => {
	let id = hashids.decode(req.params.id)[0];
	if(isNaN(id)){
		res.sendStatus(404);
	}else{
		pool.query('SELECT * FROM skills WHERE skill_id = $1 AND creator_id = $2 LIMIT 1',
			[id, req.user.id], (err, result) =>{
			if(err){
				res.sendStatus(500);
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
				console.trace();
			}else if(result.rows.length === 0){
				res.sendStatus(404);
			}else{
				if(result.rows[0].account_linking){
          if (result.rows[0].account_linking.clientSecret) {
            result.rows[0].account_linking.clientSecret = jwt.verify(result.rows[0].account_linking.clientSecret, process.env.ACCOUNT_SECRET_SIGNATURE)
          }else{
            result.rows[0].account_linking.clientSecret = ''
          }
				}
				result.rows[0].skill_id = hashids.encode(result.rows[0].skill_id);
				res.send(result.rows[0]);
			}
		})
	}
}


 exports.setTemplate = (req, res) => {
	let skill_id = hashids.decode(req.query.skill_id)[0]

 	if(isNaN(skill_id)){
		return res.sendStatus(400)
	}
	if(req.body){
    let account_linking = req.body
    if(account_linking.clientSecret){
      account_linking.clientSecret = jwt.sign(account_linking.clientSecret, process.env.ACCOUNT_SECRET_SIGNATURE);
    }
 		pool.query(
			'UPDATE skills SET account_linking = $2 WHERE (creator_id = $1 AND skill_id = $3) RETURNING *',
			[req.user.id, account_linking, skill_id], (err, skill) => {
				if(err){
					res.sendStatus(500)
					writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
					console.trace()
				}else{
					skill.rows[0].skill_id = hashids.encode(skill.rows[0].skill_id);
					res.send(skill.rows[0]);
				}
		})
	}
}

 // exports.deleteTemplate = (req, res) => {
// 	let id = hashids.decode(req.params.id)[0];
// 	if(!id){
// 		res.sendStatus(404);
// 	}else{
// 		pool.query('DELETE FROM skills WHERE template_id=$1 AND creator_id=$2', [id, req.user.id], err =>{
// 			if(err){
// 				res.sendStatus(500);
// 				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
// 				console.trace();
// 			}else{
// 				res.sendStatus(200);
// 			}
// 		})
// 	}
// }
