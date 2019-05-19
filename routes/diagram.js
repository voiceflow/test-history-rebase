const { docClient, pool, hashids, writeToLogs } = require('./../services');
const { deleteDynamoDiagramPromise } = require('./skill_util');
const { renderDiagram } = require('./../config/render_diagram.js');

const generateID = () =>
  'xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const { checkSkillAccess } = require('./team_util');

const checkDiagramAccess = async (diagram_id, user_id) => {
  if (diagram_id) {
    try {
      const result = await pool.query(
        `
        SELECT 1 FROM diagrams d
        INNER JOIN skills s ON s.skill_id = d.skill_id
        INNER JOIN projects p ON p.project_id = s.project_id
        INNER JOIN team_members tm ON tm.team_id = p.team_id
        WHERE d.id = $1 AND tm.creator_id = $2 LIMIT 1
      `,
        [diagram_id, user_id]
      );
      if (result.rowCount !== 0) return true;
    } catch (err) {}
  }
  return false;
};

const getVariables = (req, res) => {
  const params = {
    TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
    Key: {
      id: req.params.id,
    },
    ProjectionExpression: 'variables',
  };

  docClient.get(params, (err, data) => {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', {
        err,
      });
      res.sendStatus(err.statusCode);
    } else if (data.Item) {
      res.send(data.Item.variables);
    } else {
      res.sendStatus(404);
    }
  });
};

const getDiagram = (req, res) => {
  if (!req.user) {
    res.sendStatus(401);

    return;
  }

  const params = {
    TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
    Key: {
      id: req.params.id,
    },
  };
  docClient.get(params, (err, data) => {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', {
        err,
      });
      res.sendStatus(err.statusCode);
    } else if (data.Item) {
      if (data.Item.preview === false) {
        res.sendStatus(403);
        return;
      }

      res.send(data.Item);
    } else {
      res.sendStatus(404);
    }
  });
};

const updateName = async (req, res) => {
  if (!req.body || !req.body.name) {
    res.sendStatus(401);
    return;
  }

  pool.query('UPDATE diagrams SET name = $1 WHERE id = $2', [req.body.name, req.params.id], (err) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
};

const setDiagram = async (req, res) => {
  const diagram = req.body;
  diagram.skill = hashids.decode(diagram.skill)[0];

  // TODO: find underlying issue
  // check to make sure not to to overwrite projects with empty
  let data;
  try {
    data = JSON.parse(diagram.data);
  } catch (err) {
    return res.status(500).send('Invalid Project Format');
  }
  if (!data || !data.nodes || data.nodes.length === 0) {
    return res.status(500).send('Empty Project');
  }

  const DIAGRAM_ID = diagram.id || data.id;
  if (!DIAGRAM_ID) return res.status(500).send('Empty Project');

  try {
    if (!(await checkSkillAccess(diagram.skill, req.user.id))) return res.sendStatus(403);
    diagram.creator = req.user.id;
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {
      err,
    });
    return res.sendStatus(500);
  }

  const params = {
    TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
    Item: {
      id: DIAGRAM_ID,
      variables: diagram.variables,
      data: diagram.data,
      skill: diagram.skill,
      creator: diagram.creator,
    },
  };

  let global_string;
  // Make sure that the JSON validly parses
  try {
    global_string = diagram.global ? JSON.stringify(diagram.global) : '[]';
  } catch (err) {
    global_string = '[]';
  }

  docClient.put(params, async (err) => {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', {
        err,
      });
      res.sendStatus(err.statusCode);
    } else {
      try {
        if (req.query.new) {
          if (!diagram.title) {
            diagram.title = 'New Flow';
          }
          // If it is a new diagram insert (assume it has no blocks)
          await pool.query('INSERT INTO diagrams (id, name, skill_id) VALUES ($1, $2, $3)', [DIAGRAM_ID, diagram.title, diagram.skill]);
        } else {
          // otherwise update
          await pool.query('UPDATE diagrams SET sub_diagrams = $1, modified = NOW() WHERE id = $2', [diagram.sub_diagrams, DIAGRAM_ID]);
          await pool.query('UPDATE skills SET global = $1 WHERE skill_id = $2', [global_string, diagram.skill]);
        }
        res.sendStatus(200);
      } catch (e) {
        writeToLogs('CREATOR_BACKEND_ERRORS', {
          err: e,
        });
        res.sendStatus(500);
      }
    }
  });
};

const deleteDiagram = async (req, res) => {
  if (!(await checkDiagramAccess(req.params.id, req.user.id))) return res.sendStatus(403);

  pool.query(
    `
    DELETE FROM diagrams d USING skills s 
    WHERE d.skill_id = s.skill_id AND d.id = $1 AND s.diagram != d.id
  `,
    [req.params.id],
    async (err, response) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', {
          err,
        });
        return res.sendStatus(500);
      }
      if (response.rowCount !== 0) {
        try {
          await deleteDynamoDiagramPromise(req.params.id);
          return res.sendStatus(200);
        } catch (err) {
          console.trace(err);
          return res.sendStatus(500);
        }
      } else {
        return res.sendStatus(404);
      }
    }
  );
};

const purgeSubflows = (diagram) => {
  diagram.nodes.forEach((node) => {
    if (node.extras.diagram_id && node.extras.diagram_id !== null) {
      node.extras.diagram_id = null;
      if (node.extras.type === 'flow') {
        node.name = 'Flow';
      }
    }
  });
  return diagram;
};

const copyDiagram = async (req, res) => {
  try {
    const old_diagram_id = req.params.diagram_id;
    const get_params = {
      TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
      Key: {
        id: old_diagram_id,
      },
    };
    const get_diagram_promise = docClient.get(get_params).promise();
    const data = await get_diagram_promise;

    if (data.Item) {
      const purged_diagram = purgeSubflows(JSON.parse(data.Item.data));
      const new_diagram_id = generateID();
      let diagram_name = 'Diagram Copy';
      if (req.query && req.query.name && req.query.name.length < 80) {
        diagram_name = req.query.name;
      }

      const put_params = {
        TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
        Item: {
          id: new_diagram_id,
          variables: data.Item.variables,
          data: JSON.stringify(purged_diagram),
          skill: data.Item.skill,
          creator: data.Item.creator,
        },
      };

      const put_diagram_promise = docClient.put(put_params).promise();
      await put_diagram_promise;

      try {
        await pool.query(
          `INSERT INTO diagrams (id, name, skill_id, used_intents) 
          (SELECT $1, $2, skill_id, used_intents FROM diagrams WHERE id = $3)`,
          [new_diagram_id, diagram_name, old_diagram_id]
        );
        res.send(new_diagram_id);
      } catch (err) {
        // SQL insert failed so delete the diagram from dynamo
        const delete_params = {
          TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
          Key: {
            id: new_diagram_id,
          },
        };

        try {
          await docClient.delete(delete_params).promise();
          res.sendStatus(500);
        } catch (err) {
          writeToLogs('CREATOR_BACKEND_ERRORS', {
            err,
          });
          res.sendStatus(500);
        }
      }
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {
      err,
    });
    res.sendStatus(500);
  }
};

const publishTest = async (req, res) => {
  if (!req.user || !req.params.diagram_id) {
    return res.sendStatus(401);
  }

  const intents = {};
  const slots = {};
  if (Array.isArray(req.body.intents)) {
    req.body.intents.forEach((intent) => {
      if (intent.key && intent.inputs && intent.inputs.length !== 0) {
        intents[intent.key] = intent.name;
      }
    });
  }
  if (Array.isArray(req.body.slots)) {
    req.body.slots.forEach((slot) => {
      if (slot.key) {
        slots[slot.key] = slot.name;
      }
    });
  }

  const used_intents = new Set();
  const used_choices = [];
  const status = await renderDiagram(
    req.user,
    req.params.diagram_id,
    'TEST',
    {
      used_intents,
      used_choices,
      intents,
      slots,
    },
    undefined,
    req.body.platform
  );

  res.sendStatus(status);
};

const rerenderDiagram = async (req, res) => {
  const skill_id = hashids.decode(req.params.skill_id)[0];
  if (!(await checkSkillAccess(skill_id, req.user.id))) return res.sendStatus(403);

  const { diagram_id } = req.params;
  try {
    const skill_data = (await pool.query('SELECT * FROM skills WHERE skill_id = $1', [skill_id])).rows;
    const skill = skill_data[0];
    const intents = {};
    const slots = {};
    // CONVERT ARRAY TO OBJECTS
    const used_intents = new Set();
    const used_choices = [];
    const permissions = new Set();
    const interfaces = new Set();
    if (Array.isArray(skill.intents)) {
      skill.intents.forEach((intent) => {
        if (intent.key) intents[intent.key] = intent.name;
      });
    }
    if (Array.isArray(skill.slots)) {
      skill.slots.forEach((slot) => {
        if (slot.key) slots[slot.key] = slot.name;
      });
    }

    await renderDiagram(req.user, diagram_id, skill_id, {
      permissions,
      interfaces,
      used_intents,
      used_choices,
      intents,
      slots,
    });
    res.sendStatus(200);
  } catch (err) {
    console.trace(err);
    res.sendStatus(500);
  }
};

module.exports = {
  updateName,
  getVariables,
  getDiagram,
  deleteDiagram,
  setDiagram,
  publishTest,
  copyDiagram,
  rerenderDiagram,
};
