const { pool, hashids, writeToLogs } = require('../../services');
const axios = require('axios');
const { checkSkillAccess } = require("./../team_util")

const checkDisplayAccess = async (display_id, user_id) => {
  if(display_id) {
    try {
      const result = await pool.query(`
        SELECT 1 FROM displays d
        INNER JOIN skills s ON s.skill_id = d.skill_id
        INNER JOIN projects p ON p.project_id = s.project_id
        INNER JOIN team_members tm ON tm.team_id = p.team_id
        WHERE d.id = $1 AND tm.creator_id = $2 LIMIT 1
      `, [display_id, user_id])
      if(result.rowCount !== 0) return true
    } catch(err) {
    }
  }
  return false
}

exports.getDisplay = async (req, res) => {
  let id = hashids.decode(req.params.id)[0];
  if(!(await checkDisplayAccess(id, req.user.id))){
    return res.sendStatus(403)
  }

  pool.query('SELECT * FROM displays WHERE id = $1 LIMIT 1', 
    [id], (err, result) =>{
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

exports.getDisplays = async (req, res) => {
  let skill_id = hashids.decode(req.query.skill_id)[0]
  if(!(await checkSkillAccess(skill_id, req.user.id))){
    return res.sendStatus(403)
  }

  pool.query('SELECT * FROM displays WHERE skill_id = $1', [skill_id], (err, result)=>{
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

exports.setDisplay = async (req, res) => {
	let id = hashids.decode(req.params.id)[0];

	let skill_id = hashids.decode(req.query.skill_id)[0]
  if(!(await checkSkillAccess(skill_id, req.user.id))){
    return res.sendStatus(403)
  }

	if(id){
    if(!(await checkDisplayAccess(id, req.user.id))) return res.sendStatus(403)

		pool.query(
		'UPDATE displays SET title = $2, description = $3, document = $4, datasource = $5, skill_id = $6, modified = NOW() WHERE id = $1',
		[id, req.body.title, req.body.description, req.body.document, req.body.datasource, skill_id], (err) => {
			if(err){
				res.sendStatus(500);
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
			}else{
				res.sendStatus(200);
			}
		});
	}else{
		pool.query(
		'INSERT INTO displays (title, description, document, datasource, created_at, modified, skill_id, creator_id) VALUES ($1, $2, $3, $4, NOW(), NOW(), $5, $6) RETURNING id',
		[req.body.title, req.body.description, req.body.document, req.body.datasource, skill_id, req.user.id], (err, result) => {
			if(err){
				res.sendStatus(500);
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
			}else{
				res.send(hashids.encode(result.rows[0].id));
			}
		});
	}	
}

exports.deleteDisplay = async (req, res) => {
  let id = hashids.decode(req.params.id)[0];
  if(!(await checkDisplayAccess(id, req.user.id))) return res.sendStatus(403)

  pool.query('DELETE FROM displays WHERE id=$1', [id], err =>{
    if(err){
      res.sendStatus(500);
      writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
    }else{
      res.sendStatus(200);
    }
  })
}

exports.renderDisplay = async (req, res) => {
  try {
    const id = hashids.decode(req.params.id)[0];
    if(!(await checkDisplayAccess(id, req.user.id))) return res.sendStatus(403)

    const document = (await pool.query('SELECT document FROM displays WHERE id = $1 LIMIT 1', [id])).rows[0].document

    let result = await axios.post('http://ip-10-0-1-195.ec2.internal:8080/render', {
      document,
      datasource: req.body.datasource
    })
    res.send(result.data)
  } catch(err) {
    writeToLogs('APL TEST ERROR', err)
    res.sendStatus(500)
  }
}

