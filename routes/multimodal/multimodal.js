const { pool, hashids } = require('../../services');
const axios = require('axios')

exports.getDisplay = (req, res) => {
	let id = hashids.decode(req.params.id)[0];
	if(!id){
		res.sendStatus(404);
	}else{
		pool.query('SELECT * FROM displays WHERE id = $1 AND creator_id = $2 LIMIT 1', 
			[id, req.user.id], (err, result) =>{
			if(err){
				res.sendStatus(500);
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
			}else if(result.rows.length === 0){
				res.sendStatus(404);
			}else{
				result.rows[0].id = hashids.encode(result.rows[0].id);
				res.send(result.rows[0]);
			}
		})
	}
}

exports.getDisplays = (req, res) => {
	let skill_id = hashids.decode(req.query.skill_id)[0]
	if(isNaN(skill_id)){
		res.sendStatus(400)
	}else{
		pool.query('SELECT * FROM displays WHERE creator_id = $1 AND (skill_id = $2 OR skill_id IS NULL)', [req.user.id, skill_id], (err, result)=>{
			if(err){
				res.sendStatus(500)
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
			}else{
				res.send(result.rows.map(row => {
					row.id = hashids.encode(row.id);
					return row;
				}));
			}
		})
	}
}

exports.setDisplay = (req, res) => {
	let id = hashids.decode(req.params.id)[0];

	let skill_id = hashids.decode(req.query.skill_id)[0]
	if(isNaN(skill_id)){
		return res.sendStatus(400)
	}

	if(id){
		pool.query(
		'UPDATE displays SET title = $3, description = $4, document = $5, datasource = $6, skill_id = $7, modified = NOW() WHERE creator_id = $1 AND id = $2',
		[req.user.id, id, req.body.title, req.body.description, req.body.document, req.body.datasource, skill_id], (err) => {
			if(err){
				res.sendStatus(500);
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
			}else{
				res.sendStatus(200);
			}
		});
	}else{
		pool.query(
		'INSERT INTO displays (creator_id, title, description, document, datasource, created_at, modified, skill_id) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6) RETURNING id',
		[req.user.id, req.body.title, req.body.description, req.body.document, req.body.datasource, skill_id], (err, result) => {
			if(err){
				res.sendStatus(500);
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
			}else{
				res.send(hashids.encode(result.rows[0].id));
			}
		});
	}	
}

exports.deleteDisplay = (req, res) => {
	let id = hashids.decode(req.params.id)[0];
	if(!id){
		res.sendStatus(404);
	}else{
		pool.query('DELETE FROM displays WHERE id=$1 AND creator_id=$2', [id, req.user.id], err =>{
			if(err){
				res.sendStatus(500);
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
			}else{
				res.sendStatus(200);
			}
		})
	}
}

exports.renderDisplay = async (req, res) => {
  try {
    const display_id = hashids.decode(req.params.id)[0];
    const document = (await pool.query('SELECT document FROM displays WHERE id = $1 AND creator_id = $2 LIMIT 1', [display_id, req.user.id])).rows[0].document

    let result = await axios.post('http://18.207.123.181:8080/render', {
      document,
      datasource: req.body.datasource
    })
    res.send(result.data)
  } catch(err) {
    writeToLogs('APL TEST ERROR', err)
    res.sendStatus(500)
  }
}