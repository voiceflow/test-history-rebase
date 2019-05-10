const axios = require('axios');
const {
  docClient, pool, hashids, logAxiosError, writeToLogs, analytics,
} = require('./../services');
const { AccessToken } = require('./authentication');
const { renderDiagram } = require('../config/render_diagram');
const { PLATFORMS } = require('../app/src/Constants');

const generateID = () => 'xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = (Math.random() * 16) | 0;
  const v = c === 'x' ? r : (r & 0x3) | 0x8;
  return v.toString(16);
});

exports.deleteDynamoDiagramPromise = (diagram_id) => new Promise(async (resolve, reject) => {
  try {
    const diagrams_params = {
      TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
      Key: {
        id: diagram_id,
      },
    };
    const delete_diagrams_promise = docClient.delete(diagrams_params).promise();
    const skills_params = {
      TableName: `${process.env.SKILLS_DYNAMO_TABLE_BASE_NAME}.live`,
      Key: {
        id: diagram_id,
      },
    };
    const delete_skills_promise = docClient.delete(skills_params).promise();

    await delete_diagrams_promise;
    await delete_skills_promise;

    // don't care whether it's there or not
    try {
      const tests_params = {
        TableName: `${process.env.SKILLS_DYNAMO_TABLE_BASE_NAME}.test`,
        Key: {
          id: diagram_id,
        },
      };
      const delete_tests_promise = docClient.delete(tests_params).promise();
      await delete_tests_promise;
      resolve();
    } catch (err) {
      resolve();
    }
  } catch (err) {
    reject(err);
  }
});

exports.deleteSkillDiagramsPromise = (skill_id) => new Promise(async (resolve, reject) => {
  try {
    const diagram_data_rows = (await pool.query('SELECT id FROM diagrams WHERE skill_id = $1', [skill_id])).rows;
    const diagram_delete_promises = [];

    // Creating a set of ids for delete query, ex. (1,44545, 65564)
    let parsed_array = '(';
    for (let i = 0; i < diagram_data_rows.length; i++) {
      // To0 f4st for 4mzn
      setTimeout(() => { diagram_delete_promises.push(exports.deleteDynamoDiagramPromise(diagram_data_rows[i].id)); }, 20);

      if (i < diagram_data_rows.length - 1) {
        parsed_array += `'${diagram_data_rows[i].id}',`;
      } else {
        parsed_array += `'${diagram_data_rows[i].id}'`;
      }
    }
    parsed_array += ')';
    // Delete the diagram rows since the skill they depend on won't be deleted
    await pool.query(`DELETE FROM diagrams WHERE id IN ${parsed_array}`);

    Promise.all(diagram_delete_promises)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    reject(err);
  }
});

/*
 * delete_diagrams: set to true if you wanna delete the diagrams of the version, false if not
 */
exports.deleteVersionPromise = (creator_id, skill_id, opts) => {
  if (!opts) opts = {};
  if (opts.delete_diagrams === undefined) opts.delete_diagrams = true;

  return new Promise(async (resolve, reject) => {
    const delete_query = 'DELETE FROM skills WHERE creator_id = $1 AND skill_id = $2';
    const select_query = 'SELECT * FROM diagrams WHERE skill_id = $1';
    try {
      if (opts.delete_diagrams) {
        const skill_data_rows = (await pool.query(select_query, [skill_id])).rows;
        if (skill_data_rows.length === 0) {
          console.trace('DELETE VERSION, EMPTY ROWS', select_query, skill_id);
          return resolve();
        }

        await pool.query(delete_query, [creator_id, skill_id]);

        for (let i = 0; i < skill_data_rows.length; i++) {
          setTimeout(() => {
            try {
              exports.deleteDynamoDiagramPromise(skill_data_rows[i].id);
            } catch (err) {
              writeToLogs('DELETE DYNAMO ERROR', err);
            }
          }, 20 * i);
        }
      } else {
        await pool.query(delete_query, [creator_id, skill_id]);
      }
      resolve();
    } catch (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', { err, context: 'deleteVersionPromise' });
      reject(err);
    }
  });
};

exports.deleteProjectPromise = (project_id) => new Promise(async (resolve, reject) => {
  const select_query = `
      SELECT * FROM projects p
        INNER JOIN skills s ON p.project_id = s.project_id
        INNER JOIN diagrams d ON s.skill_id = d.skill_id
      WHERE p.project_id = $1`;

  const delete_query = 'DELETE FROM skills WHERE project_id = $1';

  try {
    const project_data_rows = (await pool.query(select_query, [project_id])).rows;
    if (project_data_rows.length === 0) {
      console.trace('DELETE SKILL, EMPTY ROWS', select_query, project_id);
      return resolve();
    }

    await pool.query(delete_query, [project_id]);
    await pool.query('DELETE FROM projects WHERE project_id = $1', [project_id]);

    const checked_amzn = new Set();

    for (let i = 0; i < project_data_rows.length; i++) {
      const version = project_data_rows[i];

      // If versions have an Amazon ID
      if (version.amzn_id && !checked_amzn.has(version.amzn_id)) {
        AccessToken(version.creator_id, (token) => {
          if (token === null) return;
          axios.request({
            url: `https://api.amazonalexa.com/v1/skills/${version.amzn_id}`,
            method: 'DELETE',
            headers: {
              Authorization: token,
            },
          })
            .catch((err) => {
              logAxiosError(err, 'DELETE AMAZON SKILL');
            });
        });
        checked_amzn.add(version.amzn_id);
      }

      // To0 f4st for 4mzn
      setTimeout(() => {
        try {
          exports.deleteDynamoDiagramPromise(version.id);
        } catch (err) {
          writeToLogs('CREATOR_BACKEND_ERRORS', { err });
        }
      }, 20 * i);
    }

    resolve();
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    reject(err);
  }
});

copyProducts = (old_skill_id, new_skill_id) => new Promise(async (resolve, reject) => {
  const select_query = `
    SELECT * FROM products WHERE skill_id = $1 ORDER BY id
  `;
  const copy_query = `
    INSERT INTO products (skill_id, name, data)
    (SELECT $1, name, data FROM products WHERE skill_id = $2 ORDER BY id)
    RETURNING *
  `;
  try {
    const select_data = (await pool.query(select_query, [old_skill_id])).rows;
    const insert_data = (await pool.query(copy_query, [new_skill_id, old_skill_id])).rows;
    const product_remapping = {};

    if (select_data.length != insert_data.length) {
      reject('Select and Insert had different lengths (copyProducts)');
    }

    for (const i in select_data) {
      product_remapping[hashids.encode(select_data[i].id)] = hashids.encode(insert_data[i].id);
    }
    resolve(product_remapping);
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err, params: { old_skill_id, new_skill_id } });
    reject(err);
  }
});

copyEmailTemplates = (old_skill_id, new_skill_id, new_creator_id) => new Promise(async (resolve, reject) => {
  const select_query = `
    SELECT * FROM email_templates WHERE skill_id = $1 ORDER BY template_id
  `;
  const copy_query = `
    INSERT INTO email_templates (creator_id, title, content, sender, variables, subject, skill_id)
    (SELECT $1, title, content, sender, variables, subject, $2 FROM email_templates WHERE skill_id = $3 ORDER BY template_id)
    RETURNING *
  `;
  try {
    const select_data = (await pool.query(select_query, [old_skill_id])).rows;
    const insert_data = (await pool.query(copy_query, [new_creator_id, new_skill_id, old_skill_id])).rows;
    const email_templates_remapping = {};

    if (select_data.length != insert_data.length) {
      reject('Select and Insert had different lengths (copyEmailTemplates)');
    }

    for (const i in select_data) {
      email_templates_remapping[hashids.encode(select_data[i].template_id)] = hashids.encode(insert_data[i].template_id);
    }
    resolve(email_templates_remapping);
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err, params: { old_skill_id, new_skill_id, new_creator_id } });
    reject(err);
  }
});

copyDisplays = (old_skill_id, new_skill_id, new_creator_id) => new Promise(async (resolve, reject) => {
  const select_query = `
    SELECT * FROM displays WHERE skill_id = $1 ORDER BY id
  `;
  const copy_query = `
    INSERT INTO displays (document, compatibility, creator_id, title, description, skill_id, datasource)
    (SELECT document, compatibility, $1, title, description, $2, datasource FROM displays WHERE skill_id = $3 ORDER BY id)
    RETURNING *
  `;
  try {
    const select_data = (await pool.query(select_query, [old_skill_id])).rows;
    const insert_data = (await pool.query(copy_query, [new_creator_id, new_skill_id, old_skill_id])).rows;
    const displays_remapping = {};

    if (select_data.length != insert_data.length) {
      reject('Select and Insert had different lengths (copyDisplays)');
    }

    for (const i in select_data) {
      displays_remapping[hashids.encode(select_data[i].id)] = hashids.encode(insert_data[i].id);
    }
    resolve(displays_remapping);
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err, params: { old_skill_id, new_skill_id, new_creator_id } });
    reject(err);
  }
});

const uploadCopiedDiagram = (data, new_skill_id, new_creator_id, diagram_names, module_id) => new Promise(async (resolve, reject) => {
  const params = {
    TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
    Item: {
      id: data.diagram.id,
      variables: data.diagram.variables,
      data: data.diagram.data,
      skill: new_skill_id,
      creator: new_creator_id,
    },
  };

  try {
    if (module_id === undefined) {
      module_id = null;
    }
    const new_diagram_data = (await pool.query(
      'INSERT INTO diagrams (id, name, skill_id, sub_diagrams, used_intents, module_id) (SELECT $1, $2, $3, $4, used_intents, $5 FROM diagrams WHERE id = $6) RETURNING *',
      [data.diagram.id, diagram_names[data.old_diagram_id], new_skill_id, JSON.stringify(data.sub_diagrams), module_id, data.old_diagram_id],
    )).rows[0];
    await docClient.put(params).promise();
    resolve(new_diagram_data);
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    reject();
  }
});

const remapDiagramIds = async (diagram, new_skill_id, new_creator_id, mappings, platform, module_id) => {
  const sub_diagrams = new Set();
  const old_diagram_id = diagram.id;

  diagram.id = mappings.diagram[diagram.id];
  diagram.skill = new_skill_id;
  const JSON_diagram_data = JSON.parse(diagram.data);
  const { nodes } = JSON_diagram_data;
  if (nodes) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.extras.diagram_id && node.extras.diagram_id !== null) {
        node.extras.diagram_id = mappings.diagram[node.extras.diagram_id];
        sub_diagrams.add(node.extras.diagram_id);
      } else if (node.extras[platform] && node.extras[platform].diagram_id && node.extras[platform].diagram_id !== null) {
        PLATFORMS.forEach((p) => {
          node.extras[p].diagram_id = mappings.diagram[node.extras[p].diagram_id];
        });

        sub_diagrams.add(node.extras[platform].diagram_id);
      } else if (node.extras.display_id && node.extras.display_id !== null && mappings.display[node.extras.display_id]) {
        node.extras.display_id = mappings.display[node.extras.display_id];
      } else if (node.extras.template_id && node.extras.template_id !== null && mappings.email[node.extras.template_id]) {
        node.extras.template_id = mappings.email[node.extras.template_id];
      } else if (node.extras.product_id && node.extras.product_id !== null && mappings.product[node.extras.product_id]) {
        node.extras.product_id = mappings.product[node.extras.product_id];
      } else if (Array.isArray(node.combines) && node.combines.length !== 0) {
        for (var j = 0; j < node.combines.length; j++) {
          PLATFORMS.forEach((p) => {
            try {
              if (node.combines[j].extras[p] && node.combines[j].extras[p].diagram_id) {
                node.combines[j].extras[p].diagram_id = mappings.diagram[node.combines[j].extras[p].diagram_id];
                sub_diagrams.add(node.combines[j].extras[p].diagram_id);
              }
            } catch (e) {}
          });
        }
      }
    }
  }

  diagram.data = JSON.stringify(JSON_diagram_data);
  const result = await uploadCopiedDiagram({
    diagram,
    sub_diagrams: [...sub_diagrams],
    old_diagram_id,
  }, new_skill_id, new_creator_id, mappings.names, module_id);
  return result;
};

const remapAndCopyDiagram = (diagram_id, new_skill_id, platform, new_creator_id, mappings, module_id) => new Promise((resolve, reject) => {
  const get_params = {
    TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
    Key: {
      id: diagram_id,
    },
  };

  docClient.get(get_params, async (err, data) => {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', { err });
      reject(err);
    } else if (data.Item) {
      const result = await remapDiagramIds(data.Item, new_skill_id, new_creator_id, mappings, platform, module_id);
      if (typeof result === 'Error') {
        reject(result);
      } else {
        resolve(result);
      }
    }
  });
});

const renderSkill = async (skill, user) => {
  const intents = {};
  const slots = {};
  // CONVERT ARRAY TO OBJECTS
  const used_intents = new Set(); const used_choices = []; const permissions = new Set(); const
    interfaces = new Set();
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
  try {
    await renderDiagram(user, skill.diagram, skill.skill_id, {
      permissions, interfaces, used_intents, used_choices, intents, slots,
    }, undefined, skill.platform);
    // UPDATE SKILL
    await pool.query('UPDATE skills set used_intents = $2, used_choices = $3, alexa_permissions = $4, alexa_interfaces = $5 WHERE skill_id = $1',
      [skill.skill_id, JSON.stringify([...used_intents]), JSON.stringify(used_choices), JSON.stringify([...permissions]), JSON.stringify([...interfaces])]);
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
  }
};

const generateCopySkillQuery = (options) => {
  const copy_str = (options.append_copy_str ? 'coalesce(name, \'\') || \' Copy\' AS name' : 'name');
  let copy_query;
  if (options.complete_copy || options.renderDiagram) {
    copy_query = `
          INSERT INTO skills (
            name, diagram, creator_id, amzn_id, summary, description, keywords, invocations, small_icon, large_icon, category,
            purchase, personal, copa, ads, export, instructions, inv_name, stage, review, locales, restart, global,
            privacy_policy, terms_and_cond, intents, slots, used_intents, used_choices, preview, resume_prompt, error_prompt,
            account_linking, fulfillment, alexa_permissions, alexa_interfaces, alexa_events, repeat, platform, google_publish_info, project_id
          )
          SELECT ${copy_str}, $1 AS diagram, $2 AS creator_id, amzn_id, summary, description, keywords, invocations, small_icon, large_icon, category,
              purchase, personal, copa, ads, export, instructions, inv_name, stage, review, locales, restart, global,
              privacy_policy, terms_and_cond, intents, slots, used_intents, used_choices, preview, resume_prompt, error_prompt,
              account_linking, fulfillment, alexa_permissions, alexa_interfaces, alexa_events, repeat, platform, google_publish_info, project_id
          FROM skills WHERE skill_id = $3 RETURNING *`;
  } else {
    copy_query = `
          INSERT INTO skills (
            name, diagram, creator_id, summary, description, keywords, invocations, small_icon, large_icon, category, purchase,
            personal, copa, ads, export, instructions, inv_name, locales, restart, global, privacy_policy, terms_and_cond,
            intents, slots, used_intents, used_choices, resume_prompt, error_prompt, account_linking, fulfillment, repeat, alexa_events, platform, google_publish_info
          )
          SELECT ${copy_str}, $1 AS diagram, $2 AS creator_id, summary, description, keywords, invocations, small_icon, large_icon, category, purchase,
            personal, copa, ads, export, instructions, inv_name, locales, restart, global, privacy_policy, terms_and_cond,
            intents, slots, used_intents, used_choices, resume_prompt, error_prompt, account_linking, fulfillment, repeat, alexa_events, platform, google_publish_info
          FROM skills WHERE skill_id = $3 RETURNING *`;
  }
  return copy_query;
};

exports.copySkill = async (req, res, options, cb = false) => {
  const id = req.params._version_id ? req.params._version_id : hashids.decode(req.params.version_id)[0];
  const new_creator_id = options.creator_id || req.user.id;
  const team_id = req.params._team_id;
  const diagram_mapping = {};
  let remapped_products = {};
  let remapped_emails = {};
  let remapped_displays = {};
  const diagram_names = {};
  const root_diagram_id = generateID();

  // Starts here: verify that the skill is under the current creator
  if (!options.copying_default_template && !options.request_cert) {
    if (req.user.admin < 100) {
      try {
        const CHECK = await pool.query(`
          SELECT 1 FROM skills s
          INNER JOIN projects p ON p.project_id = s.project_id
          INNER JOIN team_members tm ON tm.team_id = p.team_id
          WHERE tm.creator_id = $1 AND s.skill_id = $2 LIMIT 1
        `, [req.user.id, id]);

        if (CHECK.rowCount === 0) throw new Error('Not your skill');
      } catch (err) {
        // forbidden
        return res.sendStatus(401);
      }
    }
  }
  const copy_query = generateCopySkillQuery(options);
  try {
    let copy_skill;
    if (!options.diagrams_only) {
      copy_skill = (await pool.query(copy_query, [root_diagram_id, new_creator_id, id])).rows[0];
      if (!copy_skill) throw new Error('Unable to Create Version');
      // Copy products, displays, and email templates on sql and store new ids for remapping
      if (options.user_copy) {
        try {
          remapped_products = await copyProducts(id, copy_skill.skill_id);
          remapped_emails = await copyEmailTemplates(id, copy_skill.skill_id, new_creator_id);
          remapped_displays = await copyDisplays(id, copy_skill.skill_id, new_creator_id);
        } catch (err) {
          writeToLogs('CREATOR_BACKEND_ERRORS', { err });
          return res.sendStatus(500);
        }
      }
    }
    const diagram_data = await pool.query('SELECT id, diagrams.name, intents, slots FROM diagrams INNER JOIN skills ON diagrams.skill_id = skills.skill_id WHERE skills.skill_id = $1', [id]);
    const remap_and_copy_promises = [];
    for (let i = 0; i < diagram_data.rows.length; i++) {
      diagram_names[diagram_data.rows[i].id] = diagram_data.rows[i].name;
      if (diagram_data.rows[i].name === 'ROOT') {
        diagram_mapping[diagram_data.rows[i].id] = root_diagram_id;
      } else {
        diagram_mapping[diagram_data.rows[i].id] = generateID();
      }
      remap_and_copy_promises.push(
        remapAndCopyDiagram(diagram_data.rows[i].id, copy_skill.skill_id, copy_skill.platform, new_creator_id, {
          diagram: diagram_mapping,
          display: remapped_displays,
          product: remapped_products,
          email: remapped_emails,
          names: diagram_names,
        }),
      );
    }

    Promise.all(remap_and_copy_promises)
      .then(async (values) => {
        // Add working version to table
        if (options.copying_default_template || options.user_copy) {
          try {
            if (options.request_cert && copy_skill) {
              await pool.query('UPDATE skills SET project_id = $1, cert_requested = NOW() WHERE skill_id = $2', [options.project_id, copy_skill.skill_id]);
            } else if (copy_skill) {
              if (options.append_copy_str) options.name = copy_skill.name;

              const new_project_data = (await pool.query(`
                INSERT INTO projects (name, creator_id, dev_version, team_id) 
                VALUES ($1, $2, $3, $4) 
                RETURNING *`,
              [options.name, copy_skill.creator_id, copy_skill.skill_id, team_id])).rows[0];
              copy_skill.project_id = hashids.encode(new_project_data.project_id);

              await pool.query('UPDATE skills SET project_id = $1 WHERE skill_id = $2', [new_project_data.project_id, copy_skill.skill_id]);

              analytics.track({
                userId: req.user.id,
                event: 'Project Created',
                properties: {
                  skill_id: copy_skill.skill_id,
                  original_skill_id: id,
                },
              });
            }
          } catch (err) {
            writeToLogs('CREATOR_BACKEND_ERRORS', { err });
            return res.sendStatus(500);
          }
        }

        if (options.renderDiagram) {
          await renderSkill(copy_skill, req.user);
        }

        // Default name of cb when no callback provided is 'next'
        copy_skill.skill_id = hashids.encode(copy_skill.skill_id);
        if (cb && cb.name !== 'next') {
          cb(copy_skill);
        } else {
          return res.send(copy_skill);
        }
      })
      .catch((err) => {
        writeToLogs('CREATOR_BACKEND_ERRORS', { err });
        res.sendStatus(500);
      });
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    res.sendStatus(500);
  }
};

const copyIntentsAndSkills = (origin_skill_id, dest_skill_id) => {
  return new Promise(async (resolve, reject) => {
    try{
      let origin_skill = (await pool.query(`SELECT * FROM skills WHERE skill_id = $1`, [origin_skill_id])).rows[0]
      let dest_skill = (await pool.query(`SELECT * FROM skills WHERE skill_id = $1`, [dest_skill_id])).rows[0]

      let new_intents = dest_skill.intents.concat(origin_skill.intents)
      let new_slots = dest_skill.slots.concat(origin_skill.slots)

      await pool.query(`UPDATE skills SET intents = $1, slots = $2 WHERE skill_id = $3`, [JSON.stringify(new_intents), JSON.stringify(new_slots), dest_skill_id])
      resolve({ new_intents: new_intents, new_slots: new_slots })
    } catch (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', { err })
      reject()
    }
  })
}

// Expect origin_skill_id and dest_skill_id to be decoded
exports.copyDiagramsFromSkill = async (origin_skill_id, dest_skill_id, new_creator_id, new_flow_name, module_id, copy_intents_and_skills) => new Promise(async (resolve, reject) => {
  const diagram_names = {};
  const diagram_mapping = {};
  let remapped_products;
  let remapped_emails;
  let remapped_displays;
  const root_diagram_id = generateID();

  try {
    remapped_products = await copyProducts(origin_skill_id, dest_skill_id);
    remapped_emails = await copyEmailTemplates(origin_skill_id, dest_skill_id, new_creator_id);
    remapped_displays = await copyDisplays(origin_skill_id, dest_skill_id, new_creator_id);

    let dest_diagram_names = (await pool.query('SELECT diagrams.name FROM diagrams INNER JOIN skills ON diagrams.skill_id = skills.skill_id WHERE skills.skill_id = $1', [dest_skill_id])).rows;
    dest_diagram_names = new Set(dest_diagram_names.map((row) => row.name));
    const { platform } = (await pool.query('SELECT platform FROM skills WHERE skill_id = $1', [origin_skill_id])).rows[0];
    const diagram_data = await pool.query('SELECT id, diagrams.name, intents, slots FROM diagrams INNER JOIN skills ON diagrams.skill_id = skills.skill_id WHERE skills.skill_id = $1', [origin_skill_id]);
    const remap_and_copy_promises = [];
    for (let i = 0; i < diagram_data.rows.length; i++) {
      if (dest_diagram_names.has(diagram_data.rows[i].name)) {
        diagram_names[diagram_data.rows[i].id] = `${diagram_data.rows[i].name} (${new_flow_name})`;
      } else {
        diagram_names[diagram_data.rows[i].id] = diagram_data.rows[i].name;
      }

      if (diagram_data.rows[i].name === 'ROOT') {
        diagram_names[diagram_data.rows[i].id] = new_flow_name;
        diagram_mapping[diagram_data.rows[i].id] = root_diagram_id;
      } else {
        diagram_mapping[diagram_data.rows[i].id] = generateID();
      }

      remap_and_copy_promises.push(
        remapAndCopyDiagram(diagram_data.rows[i].id, dest_skill_id, platform, new_creator_id, {
          diagram: diagram_mapping,
          display: remapped_displays,
          product: remapped_products,
          email: remapped_emails,
          names: diagram_names,
        }, module_id),
      );
    }

    // Update global variables for new skill
    const origin_globals = new Set((await pool.query('SELECT global FROM skills WHERE skill_id = $1', [origin_skill_id])).rows[0].global);
    const dest_globals = new Set((await pool.query('SELECT global FROM skills WHERE skill_id = $1', [dest_skill_id])).rows[0].global);

    for (const elem of origin_globals) {
      dest_globals.add(elem);
    }
    const total_globals = JSON.stringify(Array.from(dest_globals));
    await pool.query('UPDATE skills SET global = $1 WHERE skill_id = $2', [total_globals, dest_skill_id]);

    let intents = [];
    let slots = [];
    if(copy_intents_and_skills){
      let {new_intents, new_slots} = await copyIntentsAndSkills(origin_skill_id, dest_skill_id)
      intents = new_intents
      slots = new_slots
    }

    Promise.all(remap_and_copy_promises)
      .then((values) => {
        resolve({ new_diagrams: values, new_globals: total_globals, new_intents: intents, new_slots: slots });
      })
      .catch((err) => {
        writeToLogs('CREATOR_BACKEND_ERRORS', { err });
        reject(err);
      });
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    reject(err);
  }
});
