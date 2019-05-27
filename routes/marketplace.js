'use strict';

const {pool, writeToLogs} = require('./../services');

let ADMIN_MARKETPLACE_ACC;

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development_prod' || process.env.NODE_ENV === 'test') {
  ADMIN_MARKETPLACE_ACC = 2125;
} else {
  ADMIN_MARKETPLACE_ACC = 19;
}

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
  getDefaultTemplates,
  getInitialTemplate,
};
