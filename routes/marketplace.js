'use strict';

const { pool, hashids, docClient, writeToLogs, ESclient, analytics } = require('./../services');
const { copySkill, deleteVersionPromise, copyDiagramsFromSkill } = require('./skill_util');
const { latestSkillToIntercom, incrementSkillsCreatedIntercom } = require('./skill');

const DEFAULT_VARIABLES = ['sessions', 'user_id', 'timestamp', 'platform', 'locale', 'access_token'];

let ADMIN_MARKETPLACE_ACC;

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development_prod' || process.env.NODE_ENV === 'test') {
  ADMIN_MARKETPLACE_ACC = 2125;
} else {
  ADMIN_MARKETPLACE_ACC = 19;
}

const setIntersect = (array_1, array_2, defaults) => {
  if (defaults === undefined) {
    defaults = [];
  }
  const set_1 = new Set(array_1);
  return new Set([...array_2].filter((x) => set_1.has(x) && defaults.indexOf(x) < 0));
};

const getTeamId = (project_id) =>
  new Promise(async (resolve) => {
    try {
      resolve((await pool.query('SELECT team_id FROM projects WHERE project_id = $1 LIMIT 1', [project_id])).rows[0].team_id);
    } catch (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', { err });
      resolve(undefined);
    }
  });

const MODULE_COLOURS = [
  'F86683|FEF2F4',
  '5891FB|EFF5FF',
  'E29C42|FCF5EC',
  '36B4D2|ECF8FA',
  '42B761|EDF8F0',
  'E760D4|FCEFFB',
  '26A69A|EBF7F5',
  '8DA2B5|F2F5F7',
  'D58B5F|FAF2ED',
  '697986|EEF0F1',
];

const MODULE_LIMIT = 20;
const hashIds = (rows) => {
  for (let i = 0; i < rows.length; i++) {
    rows[i].skill_id = hashids.encode(rows[i].skill_id);
    rows[i].project_id = hashids.encode(rows[i].project_id);
    rows[i].module_id = hashids.encode(rows[i].module_id);
  }
};

const getModuleColour = () => MODULE_COLOURS[Math.floor(Math.random() * MODULE_COLOURS.length)];

const updateModuleInES = (module_data) =>
  new Promise(async (resolve, reject) => {
    const downloads = module_data.downloads === null ? 0 : module_data.downloads;
    const index_options = {
      index: 'marketplace',
      type: 'flows',
      id: hashids.encode(module_data.module_id),
      body: {
        title: module_data.title,
        descr: module_data.descr,
        created: module_data.created,
        overview: module_data.overview,
        module_icon: module_data.module_icon,
        color: module_data.color,
        downloads,
        author: module_data.name,
        tag: typeof module_data.tags === 'string' ? JSON.parse(module_data.tags) : '',
      },
    };

    try {
      await ESclient.index(index_options);
      resolve();
    } catch (err) {
      reject(err);
    }
  });

const getModules = async (req, res) => {
  const project_id = hashids.decode(req.params.project_id)[0];
  try {
    const team_id = await getTeamId(project_id);
    const module_data = (await pool.query(
      `
			SELECT * 
			FROM modules 
			INNER JOIN (SELECT DISTINCT project_id FROM skills WHERE cert_approved IS NOT NULL) AS distinct_versions 
				ON modules.module_project_id = distinct_versions.project_id 
			INNER JOIN creators 
				ON creators.creator_id = modules.creator_id
			WHERE modules.module_id NOT IN (
				SELECT module_id FROM team_modules WHERE team_modules.project_id = $2 AND team_modules.team_id = $3
			) AND modules.template_index = 0 LIMIT $1
		`,
      [MODULE_LIMIT, project_id, team_id]
    )).rows;
    hashIds(module_data);
    res.send(module_data);
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    res.sendStatus(500);
  }
};

const getFeaturedModules = async (req, res) => {
  try {
    const featured_modules_data = (await pool.query(`
			SELECT * 
			FROM featured 
			INNER JOIN modules 
				ON featured.module_id = modules.module_id
		`)).rows;
    hashIds(featured_modules_data);
    res.send(featured_modules_data);
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    res.sendStatus(500);
  }
};

const cancelCertification = async (req, res) => {
  const project_id = hashids.decode(req.params.project_id)[0];
  try {
    const { skill_id } = (await pool.query(
      `
			SELECT skill_id
			FROM skills
			WHERE
				project_id = 
					(
						SELECT module_project_id 
						FROM modules 
						WHERE project_id = $1
					)
				AND cert_requested IS NOT NULL
				AND cert_approved IS NULL
		`,
      [project_id]
    )).rows[0];
    await deleteVersionPromise(ADMIN_MARKETPLACE_ACC, skill_id, { delete_diagrams: true });
    res.sendStatus(200);
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    res.sendStatus(500);
  }
};

const saveCertification = async (req, res) => {
  const project_id = hashids.decode(req.params.project_id)[0];

  const createNewModule = async () => {
    // Leaving module icon in for now, but not using it anymore
    req.body.module_icon = null;

    // Randomly choose module colour
    const colour = getModuleColour();
    try {
      const new_module_data = (await pool.query('INSERT INTO projects (name, creator_id) VALUES ($1, $2) RETURNING *', [
        req.body.title,
        ADMIN_MARKETPLACE_ACC,
      ])).rows[0];
      await pool.query(
        `INSERT INTO modules 
				(title, descr, creator_id, tags, type, overview, module_icon, color, input, output, module_project_id, project_id) 
			VALUES 
				($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          req.body.title,
          req.body.descr,
          req.user.id,
          req.body.tags,
          req.body.type,
          req.body.overview,
          req.body.module_icon,
          colour,
          req.body.input,
          req.body.output,
          new_module_data.project_id,
          project_id,
        ]
      );
      res.sendStatus(200);
    } catch (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', { err });
      res.sendStatus(500);
    }
  };

  const updateModule = async (module_id) => {
    // Leaving module icon in for now, but not using it anymore
    req.body.module_icon = null;
    try {
      await pool.query(
        'UPDATE modules SET title = $1, descr = $2, tags = $3, type = $4, overview = $5, module_icon = $6, color = $7, input = $8, output = $9 WHERE module_id = $10',
        [
          req.body.title,
          req.body.descr,
          req.body.tags,
          req.body.type,
          req.body.overview,
          req.body.module_icon,
          req.body.color,
          req.body.input,
          req.body.output,
          module_id,
        ]
      );
      res.sendStatus(200);
    } catch (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', { err });
      res.sendStatus(500);
    }
  };

  try {
    const module_data = (await pool.query('SELECT * FROM modules WHERE project_id = $1', [project_id])).rows;
    if (module_data.length > 0) {
      updateModule(module_data[0].module_id);
    } else {
      createNewModule();
    }
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    res.sendStatus(500);
  }
};

const giveCertification = async (req, res) => {
  const project_id = hashids.decode(req.params.project_id)[0];

  try {
    await pool.query(
      `
			UPDATE skills
			SET cert_approved = now() 
			WHERE project_id = (SELECT module_project_id FROM modules WHERE project_id = $1) 
				AND cert_approved IS NULL 
				AND cert_requested IS NOT NULL`,
      [project_id]
    );

    const module_data = (await pool.query(
      `
			SELECT * 
			FROM modules 
			INNER JOIN creators ON modules.creator_id = creators.creator_id
			WHERE modules.project_id = $1`,
      [project_id]
    )).rows[0];
    await updateModuleInES(module_data);

    res.sendStatus(200);
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    res.sendStatus(500);
  }
};

const requestCertification = async (req, res) => {
  const project_id = hashids.decode(req.params.project_id)[0];
  let module_project_id;
  try {
    const module_data = (await pool.query(
      `
			SELECT * 
			FROM modules
			WHERE project_id = $1`,
      [project_id]
    )).rows;
    module_project_id = module_data[0].module_project_id;
    // Creates a new version of the skill at this pt
    req.params.version_id = req.params.skill_id;
    copySkill(
      req,
      res,
      {
        user_copy: true,
        request_cert: true,
        project_id: module_project_id,
        creator_id: ADMIN_MARKETPLACE_ACC,
      },
      () => {
        analytics.track({
          userId: req.user.id,
          event: 'Flow Created',
          properties: module_data,
        });
        res.sendStatus(200);
      }
    );
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    res.sendStatus(500);
  }
};

const certStatus = (req, res) => {
  const project_id = hashids.decode(req.params.project_id)[0];

  pool.query(
    `
		SELECT *
		FROM modules
			INNER JOIN skills s ON modules.module_project_id = s.project_id
		WHERE modules.project_id = $1 AND cert_requested IS NOT NULL AND cert_approved IS NULL
	`,
    [project_id],
    (err, data) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', { err });
        res.sendStatus(500);
      } else if (data.rows.length > 0) {
        res.send(true);
      } else {
        res.send(false);
      }
    }
  );
};

const removeAccess = async (req, res) => {
  const module_id = hashids.decode(req.params.module_id)[0];
  const project_id = hashids.decode(req.params.project_id)[0];
  const team_id = await getTeamId(project_id);

  try {
    await pool.query('DELETE FROM team_modules WHERE team_id = $1 AND module_id = $2 AND project_id = $3', [team_id, module_id, project_id]);
    res.sendStatus(200);
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    res.sendStatus(500);
  }
};

const checkConflicts = async (req, res) => {
  const project_id = hashids.decode(req.params.project_id)[0];
  const module_id = hashids.decode(req.params.module_id)[0];
  try {
    const current_dev_data = (await pool.query(
      `
			SELECT * 
			FROM projects 
			INNER JOIN skills ON projects.dev_version = skills.skill_id
			WHERE projects.project_id = $1
		`,
      [project_id]
    )).rows[0];

    const module_data = (await pool.query(
      `
			SELECT * 
			FROM projects
			INNER JOIN modules ON projects.project_id = modules.module_project_id
			INNER JOIN skills ON skills.skill_id = 
				(SELECT max(skills.skill_id) 
				FROM skills
				INNER JOIN modules ON skills.project_id = modules.module_project_id
				WHERE skills.cert_approved IS NOT NULL
				AND module_id = $1)
			WHERE module_id = $1
		`,
      [module_id]
    )).rows[0];

    const globals_intersect = setIntersect(current_dev_data.global, module_data.global, DEFAULT_VARIABLES);

    // TODO: intents intersect
    res.send({ globals_intersect: Array.from(globals_intersect) });
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    res.sendStatus(500);
  }
};

const giveAccess = async (req, res) => {
  const module_id = hashids.decode(req.params.module_id)[0];
  const project_id = hashids.decode(req.params.project_id)[0];
  const team_id = await getTeamId(project_id);
  const creator_id = req.user.id;
  let user_module_data;

  try {
    user_module_data = (await pool.query('SELECT * FROM team_modules WHERE module_id = $1 AND team_id = $2 AND project_id = $3', [
      module_id,
      team_id,
      project_id,
    ])).rows;
    if (user_module_data.length > 0) {
      res.sendStatus(400);
    }
    await pool.query('INSERT INTO team_modules (team_id, module_id, project_id) VALUES ($1, $2, $3)', [team_id, module_id, project_id]);
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    res.sendStatus(500);
  }

  try {
    const dest_skill_id = (await pool.query('SELECT dev_version FROM projects WHERE project_id = $1', [project_id])).rows[0].dev_version;
    const origin_skill = (await pool.query(
      `
			SELECT skills.skill_id, modules.title 
			FROM modules 
			INNER JOIN projects ON modules.module_project_id = projects.project_id
			INNER JOIN skills ON modules.module_project_id = skills.project_id
			WHERE module_id = $1 AND cert_approved IS NOT NULL
			ORDER BY cert_approved DESC
			LIMIT 1
    `,
      [module_id]
    )).rows[0];
    const { new_diagrams, new_globals, new_intents, new_slots } = await copyDiagramsFromSkill(
      origin_skill.skill_id,
      dest_skill_id,
      creator_id,
      origin_skill.title,
      module_id,
      true
    );
    // Increment # of downloads and update ES index
    await pool.query('UPDATE modules SET downloads = downloads + 1 WHERE module_id = $1', [module_id]);
    const module_data = (await pool.query(
      `
			SELECT *
			FROM modules
			INNER JOIN creators ON modules.creator_id = creators.creator_id
			WHERE modules.module_id = $1
		`,
      [module_id]
    )).rows[0];
    await updateModuleInES(module_data);

    new_diagrams.map((diagram) => {
      diagram.skill_id = hashids.encode(diagram.skill_id);
      if (diagram.module_id !== null) {
        diagram.module_id = hashids.encode(diagram.module_id);
      }
    });
    module_data.module_id = hashids.encode(module_data.module_id);
    analytics.track({
      userId: req.user.id,
      event: 'Flow Added',
      properties: module_data,
    });
    res.send({
      new_module: module_data,
      globals: new_globals,
      new_diagrams,
      new_intents,
      new_slots,
    });
  } catch (err) {
    await pool.query('DELETE FROM team_modules WHERE team_id = $1 AND module_id = $2 AND project_id = $3', [team_id, module_id, project_id]);
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    res.sendStatus(500);
  }
};

const getModule = (req, res) => {
  const module_id = hashids.decode(req.params.module_id)[0];

  pool.query('SELECT * FROM modules, creators WHERE module_id = $1 AND modules.creator_id = creators.creator_id', [module_id], (err, data) => {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', { err });
      res.sendStatus(500);
    } else if (data.rows.length > 0) {
      res.send(data.rows[0]);
    } else {
      res.sendStatus(404);
    }
  });
};

const getCertModule = (req, res) => {
  const project_id = hashids.decode(req.params.project_id)[0];

  const retrieveVariables = (row) => {
    pool.query('SELECT diagram FROM skills WHERE skill_id = $1', [row.skill_id], (err, data) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', { err });
        res.sendStatus(500);
      } else if (data.rows.length > 0) {
        const params = {
          TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
          Key: { id: data.rows[0].diagram },
        };
        docClient.get(params, (err, data) => {
          if (err) {
            writeToLogs('CREATOR_BACKEND_ERRORS', { err });
            res.sendStatus(err.statusCode);
          } else if (data.Item) {
            const diagram = data.Item;

            row.variables = diagram.variables;
            res.send(row);
          } else {
            res.sendStatus(404);
          }
        });
      } else {
        res.send(row);
      }
    });
  };

  pool.query(
    `
		SELECT title, descr, name, email, tags, type, overview, module_icon, color, input, output 
		FROM modules
			INNER JOIN creators ON modules.creator_id = creators.creator_id
		WHERE project_id = $1`,
    [project_id],
    (err, data) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', { err });
        res.sendStatus(500);
      } else if (data.rows.length > 0) {
        // res.send(data.rows[0]);
        retrieveVariables(data.rows[0]);
      } else {
        res.send(false);
      }
    }
  );
};

const getUserModules = async (req, res) => {
  const project_id = hashids.decode(req.params.project_id)[0];
  const team_id = await getTeamId(project_id);
  try {
    const user_modules = (await pool.query(
      `
			SELECT modules.module_id, modules.descr, modules.title, modules.module_icon, modules.color
			FROM modules 
			INNER JOIN team_modules ON modules.module_id = team_modules.module_id
			WHERE team_modules.team_id = $1 AND team_modules.project_id = $2
		`,
      [team_id, project_id]
    )).rows;
    hashIds(user_modules);
    res.send(user_modules);
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    res.sendStatus(500);
  }
};

const retrieveTemplate = (req, res) => {
  const module_id = hashids.decode(req.params.module_id)[0];

  pool.query(
    `
		SELECT * 
		FROM skills s
			INNER JOIN modules ON s.project_id = modules.project_id
		WHERE module_id = $1 AND cert_approved = (
			SELECT max(cert_approved) FROM versions WHERE module_id = $1)
		`,
    [module_id],
    (err, data) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', { err });
        res.sendStatus(500);
      } else if (data.rows.length > 0) {
        const template_diagram_id = data.rows[0].diagram_id;
        const params = {
          TableName: `${process.env.SKILLS_DYNAMO_TABLE_BASE_NAME}.market`,
          Key: { id: template_diagram_id },
        };
        docClient.get(params, (err, data) => {
          if (err) {
            writeToLogs('CREATOR_BACKEND_ERRORS', { err });
            res.sendStatus(err.statusCode);
          } else if (data.Item) {
            res.send(data.Item);
          } else {
            res.sendStatus(404);
          }
        });
      } else {
        res.sendStatus(404);
      }
    }
  );
};

const getPendingModules = async (req, res) => {
  try {
    const module_data = (await pool.query(`
			SELECT * 
			FROM skills s
      JOIN modules ON s.project_id = modules.module_project_id 
			WHERE cert_approved IS NULL AND cert_requested IS NOT NULL`)).rows;
    hashIds(module_data);
    res.status(200).send(module_data);
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    res.sendStatus(500);
  }
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
        writeToLogs('CREATOR_BACKEND_ERRORS', { err });
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
        writeToLogs('CREATOR_BACKEND_ERRORS', { err });
        res.sendStatus(500);
      } else {
        hashIds(data.rows);
        res.send(data.rows);
      }
    }
  );
};

// NEW PROJECTS CREATED HERE
const copyDefaultTemplate = (req, res) => {
  const team_id = req.params._team_id;
  const { name } = req.body;
  if (!team_id || !name) return res.sendStatus(400);

  const module_id = hashids.decode(req.params.module_id)[0];

  // Retrieve diagram, trying 5 times
  const getDiagram = (row, num_tries) => {
    const params = {
      TableName: `${process.env.DIAGRAMS_DYNAMO_TABLE}`,
      Key: { id: row.diagram },
    };

    docClient.get(params, (err, data) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', { err });
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
      const invs = { value: [`open ${name}`, `start ${name}`, `launch ${name}`] };
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
            writeToLogs('CREATOR_BACKEND_ERRORS', { err });
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
        writeToLogs('CREATOR_BACKEND_ERRORS', { err });
        res.sendStatus(500);
      } else if (data.rows.length > 0) {
        req.params._version_id = data.rows[0].skill_id;
        req.params._team_id = team_id;
        copySkill(req, res, { copying_default_template: true, name }, updateSkill);
      } else {
        res.sendStatus(404);
      }
    }
  );
};

const getModuleDiagram = async (req, res) => {
  const module_id = hashids.decode(req.params.module_id)[0];
  try {
    const project_id = (await pool.query('SELECT module_project_id FROM modules WHERE module_id = $1', [module_id])).rows[0].module_project_id;
    const latest_version_data = (await pool.query(
      `
			SELECT *
			FROM skills
			WHERE skills.cert_approved = (SELECT max(cert_approved) FROM skills WHERE project_id = $1)
			AND project_id = $1
		`,
      [project_id]
    )).rows[0];
    res.send({ diagram_id: latest_version_data.diagram });
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    res.sendStatus(500);
  }
};

const flowsSearch = async (req, res) => {
  try {
    if (
      (await pool.query('SELECT * FROM creators WHERE creator_id = $1 AND password = $2', [req.headers.creator_id, req.headers.password])).rows
        .length > 0
    ) {
      const query = JSON.parse(req.body.split('\n')[1]);
      const ESoptions = {
        index: 'marketplace',
        type: 'flows',
        body: query,
      };
      ESclient.search(ESoptions)
        .then((data) => res.send({ responses: [data] }))
        .catch((err) => {
          writeToLogs('CREATOR_BACKEND_ERRORS', { err });
          return res.sendStatus(500);
        });
    } else {
      return res.sendStatus(403);
    }
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    return res.sendStatus(500);
  }
};

module.exports = {
  getModules,
  getModule,
  getFeaturedModules,
  requestCertification,
  cancelCertification,
  saveCertification,
  certStatus,
  giveAccess,
  // hasAccess: hasAccess,
  removeAccess,
  giveCertification,
  getCertModule,
  getUserModules,
  retrieveTemplate,
  getPendingModules,
  getDefaultTemplates,
  copyDefaultTemplate,
  checkConflicts,
  getInitialTemplate,
  getModuleDiagram,
  flowsSearch,
};
