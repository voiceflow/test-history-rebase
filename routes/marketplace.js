'use strict';

const {pool, hashids, writeToLogs} = require('./../services');
const {copySkill} = require('./skill_util');
const {latestSkillToIntercom, incrementSkillsCreatedIntercom} = require('./skill');

let ADMIN_MARKETPLACE_ACC;

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development_prod' || process.env.NODE_ENV === 'test') {
  ADMIN_MARKETPLACE_ACC = 2125;
} else {
  ADMIN_MARKETPLACE_ACC = 19;
}

// NEW PROJECTS CREATED HERE
const copyDefaultTemplate = (req, res) => {
  const team_id = req.params._team_id;
  const {name} = req.body;
  if (!team_id || !name) return res.sendStatus(400);

  const module_id = hashids.decode(req.params.module_id)[0];

  // Retrieve diagram, trying 5 times
  const getDiagram = (row, num_tries) => {
    const params = {
      TableName: `${process.env.DIAGRAMS_DYNAMO_TABLE}`,
      Key: {id: row.diagram},
    };

    docClient.get(params, (err, data) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', {err});
        res.sendStatus(err.statusCode);
      } else if (data.Item) {
        res.send({
          skill: row,
          diagram: data.Item,
        });
      } else if (num_tries < 5) {
        getDiagram(row, num_tries + 1);
      } else {
        res.sendStatus(500);
      }
    });
  };

  const updateSkill = async (skill) => {
    if (Array.isArray(req.body.locales)) {
      const invs = {value: [`open ${name}`, `start ${name}`, `launch ${name}`]};
      const sum = `This is a new summary for the skill ${name}`;
      const desc = `This is a new description for the skill ${name}\n\n Be sure to leave a 5-star review!`;
      let locales = ['en-US'];
      const platform = req.body.platform || 'alexa';

      if (req.body.locales) {
        locales = req.body.locales;
      }

      pool.query(
        `
        UPDATE skills SET 
        name = $1, summary = $2, description = $3, invocations = $4, inv_name = $5, locales = $6, privacy_policy=$7, terms_and_cond=$8, platform=$9 
        WHERE skill_id = $10;`,
        [
          name,
          sum,
          desc,
          invs,
          name,
          JSON.stringify(locales),
          `https://creator.getvoiceflow.com/creator/privacy_policy?name=${encodeURI(req.user.name)}&skill=${encodeURI(name)}`,
          `https://creator.getvoiceflow.com/creator/terms?name=${encodeURI(req.user.name)}&skill=${encodeURI(name)}`,
          platform,
          hashids.decode(skill.skill_id)[0],
        ],
        (err) => {
          if (err) {
            writeToLogs('CREATOR_BACKEND_ERRORS', {err});
            res.sendStatus(500);
          } else {
            incrementSkillsCreatedIntercom(req.user.id);
            latestSkillToIntercom(req.user.id, name);
            res.send(skill);
          }
        }
      );
    } else {
      res.send(skill);
    }
  };

  pool.query(
    `
		SELECT s.skill_id 
		FROM skills s
			INNER JOIN modules ON s.project_id = modules.module_project_id 
		WHERE modules.module_id = $1 AND cert_approved IS NOT NULL
		ORDER BY cert_approved 
		DESC LIMIT 1`,
    [module_id],
    (err, data) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', {err});
        res.sendStatus(500);
      } else if (data.rows.length > 0) {
        req.params._version_id = data.rows[0].skill_id;
        req.params._team_id = team_id;
        copySkill(req, res, {copying_default_template: true, name}, updateSkill);
      } else {
        res.sendStatus(404);
      }
    }
  );
};


const getDefaultTemplates = (req, res) => {
  pool.query(
    `
    SELECT * 
    FROM modules 
      INNER JOIN skills s ON modules.module_project_id = s.project_id
    WHERE modules.template_index > 0 
      AND cert_approved IS NOT NULL
    ORDER BY modules.template_index DESC
  `,
    (err, data) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', {err});
        res.sendStatus(500);
      } else {
        hashIds(data.rows);
        res.send(data.rows);
      }
    }
  );
};

const getInitialTemplate = (req, res) => {
  pool.query(
    `
		SELECT *
		FROM modules 
			INNER JOIN skills s ON modules.module_project_id = s.project_id
		WHERE modules.template_index > 0
			AND cert_approved IS NOT NULL
		ORDER BY modules.template_index DESC LIMIT 1
	`,
    [],
    (err, data) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', {err});
        res.sendStatus(500);
      } else {
        hashIds(data.rows);
        res.send(data.rows);
      }
    }
  );
};

module.exports = {
  copyDefaultTemplate,
  getDefaultTemplates,
  getInitialTemplate,
};
