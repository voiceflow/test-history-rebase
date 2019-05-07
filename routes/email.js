const { pool, hashids, writeToLogs } = require('./../services');
const isVarName = require('is-var-name');

exports.getTemplate = (req, res) => {
  const id = hashids.decode(req.params.id)[0];
  if (isNaN(id)) {
    res.sendStatus(404);
  } else {
    pool.query('SELECT * FROM email_templates WHERE template_id = $1 AND creator_id = $2 LIMIT 1',
      [id, req.user.id], (err, result) => {
        if (err) {
          res.sendStatus(500);
          writeToLogs('CREATOR_BACKEND_ERRORS', { err });
          console.trace();
        } else if (result.rows.length === 0) {
          res.sendStatus(404);
        } else {
          result.rows[0].template_id = hashids.encode(result.rows[0].template_id);
          res.send(result.rows[0]);
        }
      });
  }
};

exports.getTemplates = (req, res) => {
  const skill_id = hashids.decode(req.query.skill_id)[0];
  if (isNaN(skill_id)) {
    res.sendStatus(400);
  } else {
    pool.query('SELECT * FROM email_templates WHERE creator_id = $1 AND (skill_id = $2 OR skill_id IS NULL)', [req.user.id, skill_id], (err, result) => {
      if (err) {
        res.sendStatus(500);
        writeToLogs('CREATOR_BACKEND_ERRORS', { err });
        console.trace();
      } else if (result.rows && result.rows.length !== 0) {
        res.send(result.rows.map((row) => {
          row.template_id = hashids.encode(row.template_id);
          return row;
        }));
      } else {
        res.send([]);
      }
    });
  }
};

exports.setTemplate = (req, res) => {
  const id = hashids.decode(req.params.id)[0];
  const skill_id = hashids.decode(req.query.skill_id)[0];

  if (isNaN(skill_id)) {
    return res.sendStatus(400);
  }

  // match all variables inside the email and put them to a list
  let variables = new Set();

  const regex = /\{([^{}]*)\}/g;

  // Check the body and title for variables
  if (req.body.content) {
    let match = regex.exec(req.body.content);
    while (match != null) {
      if (isVarName(match[1])) {
		    	variables.add(match[1]);
		    }
		    match = regex.exec(req.body.content);
    }
  }
  if (req.body.subject) {
    let match = regex.exec(req.body.subject);
    while (match != null) {
      if (isVarName(match[1])) {
		    	variables.add(match[1]);
		    }
		    match = regex.exec(req.body.subject);
    }
  }

  variables = JSON.stringify(Array.from(variables));
  if (isNaN(id)) {
    pool.query(
      'INSERT INTO email_templates (creator_id, title, content, sender, variables, subject, skill_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING template_id',
      [req.user.id, req.body.title, req.body.content, req.body.sender, variables, req.body.subject, skill_id], (err, result) => {
        if (err) {
          res.sendStatus(500);
          writeToLogs('CREATOR_BACKEND_ERRORS', { err });
          console.trace();
        } else {
          res.send(hashids.encode(result.rows[0].template_id));
        }
      },
    );
  } else {
    pool.query(
      'UPDATE email_templates SET title = $2, content = $3, sender = $4, modified = NOW(), variables=$5, subject=$6, skill_id=$7 WHERE creator_id = $1 AND template_id = $8',
      [req.user.id, req.body.title, req.body.content, req.body.sender, variables, req.body.subject, skill_id, id], (err) => {
        if (err) {
          res.sendStatus(500);
          writeToLogs('CREATOR_BACKEND_ERRORS', { err });
          console.trace();
        } else {
          res.sendStatus(200);
        }
      },
    );
  }
};

exports.deleteTemplate = (req, res) => {
  const id = hashids.decode(req.params.id)[0];
  if (!id) {
    res.sendStatus(404);
  } else {
    pool.query('DELETE FROM email_templates WHERE template_id=$1 AND creator_id=$2', [id, req.user.id], (err) => {
      if (err) {
        res.sendStatus(500);
        writeToLogs('CREATOR_BACKEND_ERRORS', { err });
        console.trace();
      } else {
        res.sendStatus(200);
      }
    });
  }
};
