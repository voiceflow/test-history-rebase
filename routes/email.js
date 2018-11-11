const { pool, hashids } = require('./../services');

exports.getTemplate = (req, res) => {
	let id = hashids.decode(req.params.id)[0];
	if(!id){
		res.sendStatus(404);
	}else{
		pool.query('SELECT * FROM email_templates WHERE template_id = $1 AND creator_id = $2 LIMIT 1', 
			[id, req.user.id], (err, result) =>{
			if(err){
				res.sendStatus(500);
				console.error(err)
				console.trace();
			}else if(result.rows.length === 0){
				res.sendStatus(404);
			}else{
				result.rows[0].template_id = hashids.encode(result.rows[0].template_id);
				res.send(result.rows[0]);
			}
		})
	}
}

exports.getTemplates = (req, res) => {
	pool.query('SELECT * FROM email_templates WHERE creator_id = $1', [req.user.id], (err, result)=>{
		if(err){
			res.sendStatus(500);
			console.error(err)
			console.trace();
		}else{
			res.send(result.rows.map(row => {
				row.template_id = hashids.encode(row.template_id);
				return row;
			}));
		}
	});
}

exports.setTemplate = (req, res) => {
	let id = hashids.decode(req.params.id)[0];
	if(id){
		pool.query(
		'UPDATE email_templates SET title = $2, content = $3, sender = $4, modified = NOW() WHERE creator_id = $1 AND template_id = $5',
		[req.user.id, req.body.title, req.body.content, req.body.sender, id], (err, result) => {
			if(err){
				res.sendStatus(500);
				console.error(err)
				console.trace();
			}else{
				res.sendStatus(200);
			}
		});
	}else{
		pool.query(
		'INSERT INTO email_templates (creator_id, title, content, sender) VALUES ($1, $2, $3, $4) RETURNING template_id',
		[req.user.id, req.body.title, req.body.content, req.body.sender], (err, result) => {
			if(err){
				res.sendStatus(500);
				console.error(err)
				console.trace();
			}else{
				res.send(hashids.encode(result.rows[0].template_id));
			}
		});
	}	
}

exports.deleteTemplate = (req, res) => {
	let id = hashids.decode(req.params.id)[0];
	if(!id){
		res.sendStatus(404);
	}else{
		pool.query('DELETE FROM email_templates WHERE template_id=$1 AND creator_id=$2', [id, req.user.id], err =>{
			if(err){
				res.sendStatus(500);
				console.error(err)
				console.trace();
			}else{
				res.sendStatus(200);
			}
		})
	}
}