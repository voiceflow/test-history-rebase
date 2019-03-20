const {
  docClient,
  pool,
  hashids,
  validateEmail,
  writeToLogs
} = require('./../services');
const {
  delay
} = require('../util')
const {
  copySkill,
  deleteDynamoDiagramPromise
} = require('./skill_util')
const {
  renderDiagram
} = require('./../config/render_diagram.js')

const {
  _getGoogleAccessToken
} = require('../routes/authentication')

const del = require('del');
const spawn = require('child_process').spawn

const mkdirp = require('mkdirp');
const _ = require('lodash')

const fs = require('fs');
const GACTIONS_CLI_ROOT = './gactions_cli'

const uuid = require('uuid/v4')

const generateID = () => {
  return "xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const getVariables = (req, res) => {
  let params = {
    TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
    Key: {
      'id': req.params.id
    },
    ProjectionExpression: 'variables'
  }

  docClient.get(params, (err, data) => {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', {
        err: err
      })
      res.sendStatus(err.statusCode);
    } else if (data.Item) {
      res.send(data.Item.variables);
    } else {
      res.sendStatus(404);
    }
  })
}

const getDiagram = (req, res) => {
  if (!req.user) {
    res.sendStatus(401);

    return;
  }

  let params = {
    TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
    Key: {
      'id': req.params.id
    }
  };
  docClient.get(params, (err, data) => {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', {
        err: err
      })
      res.sendStatus(err.statusCode);
    } else if (data.Item) {
      if (data.Item.preview === false) {
        res.sendStatus(403)
        return;
      }

      res.send(data.Item)
    } else {
      res.sendStatus(404)
    }
  })
}

const updateName = async (req, res) => {
  if (!req.body || !req.body.name) {
    res.sendStatus(401);
    return;
  }

  pool.query('UPDATE diagrams SET name = $1 WHERE id = $2',
    [req.body.name, req.params.id], (err) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
}

const setDiagram = async (req, res) => {
  let diagram = req.body
  diagram.skill = hashids.decode(diagram.skill)[0]

  // TODO: find underlying issue
  // check to make sure not to to overwrite projects with empty
  let data
  try {
    data = JSON.parse(diagram.data)
  } catch (err) {
    return res.status(500).send('Invalid Project Format')
  }
  if (!data || !data.nodes || data.nodes.length === 0) {
    return res.status(500).send('Empty Project')
  }

  let DIAGRAM_ID = diagram.id || data.id
  if(!DIAGRAM_ID) return res.status(500).send('Empty Project')

  try{
      let result = await pool.query('SELECT creator_id FROM skills WHERE skill_id = $1 LIMIT 1', [diagram.skill])

    if (result.rows.length > 0 && result.rows[0].creator_id !== req.user.id && req.user.admin < 100) {
      return res.sendStatus(403)
    } else {
      diagram.creator = req.user.id
    }
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {
      err: err
    })
    return res.sendStatus(500)
  }

  let params = {
      TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
      Item: {
          id: DIAGRAM_ID,
          variables: diagram.variables,
          data: diagram.data,
          skill: diagram.skill,
          creator: diagram.creator
      }
  }

  let global_string
  // Make sure that the JSON validly parses
  try {
    global_string = diagram.global ? JSON.stringify(diagram.global) : '[]'
  } catch (err) {
    global_string = '[]'
  }

  docClient.put(params, async (err) => {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', {
        err: err
      });
      res.sendStatus(err.statusCode);
    } else {
      try {
        if (req.query.new) {
          if (!diagram.title) {
            diagram.title = "New Flow";
          }
          // If it is a new diagram insert (assume it has no blocks)
          await pool.query('INSERT INTO diagrams (id, name, skill_id) VALUES ($1, $2, $3)', [DIAGRAM_ID, diagram.title, diagram.skill]);
        } else {
          // otherwise update
          await pool.query(`UPDATE diagrams SET sub_diagrams = $1, modified = NOW() WHERE id = $2`, [diagram.sub_diagrams, DIAGRAM_ID]);
          await pool.query(`UPDATE skills SET global = $1 WHERE skill_id = $2`, [global_string, diagram.skill])
        }
        res.sendStatus(200);
      } catch (e) {
        writeToLogs('CREATOR_BACKEND_ERRORS', {
          err: e
        })
        res.sendStatus(500);
      }
    }
  })
}

const deleteDiagram = (req, res) => {
  pool.query(`
            DELETE FROM diagrams d USING skills s
            WHERE d.skill_id = s.skill_id AND d.id = $1 AND s.creator_id = $2 AND s.diagram != d.id
        `,
    [req.params.id, req.user.id], async (err, response) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', {
          err: err
        })
        return res.sendStatus(500)
      }
      if (response.rowCount !== 0) {
        try {
          await deleteDynamoDiagramPromise(req.params.id)
          return res.sendStatus(200)
        } catch (err) {
          console.trace(err)
          return res.sendStatus(500)
        }
      } else {
        return res.sendStatus(404)
      }
    }
  )
}

const purgeSubflows = (diagram) => {
  diagram.nodes.forEach(node => {
    if (node.extras.diagram_id && node.extras.diagram_id !== null) {
      node.extras.diagram_id = null;
      if (node.extras.type === 'flow') {
        node.name = 'Flow'
      }
    }
  })
  return diagram
}

const copyDiagram = async (req, res) => {
  try {
    let old_diagram_id = req.params.diagram_id
    let get_params = {
      TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
      Key: {
        'id': old_diagram_id
      }
    }
    let get_diagram_promise = docClient.get(get_params).promise()
    let data = await get_diagram_promise

    if (data.Item) {
      let purged_diagram = purgeSubflows(JSON.parse(data.Item.data))
      let new_diagram_id = generateID()
      let diagram_name = 'Diagram Copy'
      if (req.query && req.query.name && req.query.name.length < 80) {
        diagram_name = req.query.name
      }

      let put_params = {
        TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
        Item: {
          id: new_diagram_id,
          variables: data.Item.variables,
          data: JSON.stringify(purged_diagram),
          skill: data.Item.skill,
          creator: data.Item.creator
        }
      }

      let put_diagram_promise = docClient.put(put_params).promise()
      await put_diagram_promise

      try {
        await pool.query(`INSERT INTO diagrams (id, name, skill_id, used_intents) 
          (SELECT $1, $2, skill_id, used_intents FROM diagrams WHERE id = $3)`, [new_diagram_id, diagram_name, old_diagram_id])
        res.send(new_diagram_id)
      } catch (err) {
        // SQL insert failed so delete the diagram from dynamo
        let delete_params = {
          TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
          Key: {
            'id': new_diagram_id
          }
        }

        try {
          await docClient.delete(delete_params).promise()
          res.sendStatus(500)
        } catch (err) {
          writeToLogs('CREATOR_BACKEND_ERRORS', {
            err: err
          })
          res.sendStatus(500)
        }
      }
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
    res.sendStatus(500)
  }
}

const checkGactionsVersionChanged = (creds, project_id, skill_id) => new Promise(async (resolve, reject) => {
  let random_id = uuid()
  let dir = `${GACTIONS_CLI_ROOT}/${random_id}`
  while (fs.existsSync(dir)) {
    random_id = uuid()
    dir = `${GACTIONS_CLI_ROOT}/${random_id}`
  }

  let google_versions_to_update = {}
  let all_google_versions

  try {
    await new Promise((resolve, reject) => {
      mkdirp(dir, function (err) {
        if (err) reject(err)
        else resolve()
      })
    })

    const cli_filename = /production/.test(process.env.NODE_ENV) || /staging/.test(process.env.NODE_ENV) ? 'gactions_linux' : 'gactions'

    await new Promise((resolve, reject) => {
      fs.copyFile(`${GACTIONS_CLI_ROOT}/${cli_filename}`, `${dir}/gactions`, (err) => {
        if (err) reject(err)
        resolve()
      })
    })

    await new Promise((resolve, reject) => {
      fs.writeFile(`${dir}/creds.data`, creds, 'utf8', (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })

    all_google_versions = await new Promise(async (resolve, reject) => {
      const gactions = spawn('./gactions', ['list', `--project=${project_id}`], {
        cwd: dir
      })

      let output = ''

      gactions.stdout.on('data', (data) => {
        output += data.toString()
      });

      gactions.stderr.on('data', (data) => {
        reject(data.toString())
      })

      await delay(4000)

      const attached_google_versions = {}
      const lines = output.split('\n').filter(Boolean)

      lines.forEach(line => {
        const words = line.split('  ').filter(Boolean)
        const version = words[0]
        const create_time = words[1]
        const update_time = words[2]
        const approval = words[3]
        const deployment_status = words[4]

        if (/.-\[[^\[\]]+\]\S+/.test(version)) {
          attached_google_versions[version] = {
            create_time,
            update_time,
            approval,
            deployment_status
          }
        }
      })
      resolve(attached_google_versions)
    })

    // WINSTON PLS HALP
    const data = await pool.query('SELECT google_versions FROM skill_versions WHERE skill_id = $1', [skill_id])

    let existing_google_versions = data.rows[0].google_versions
    let highest_existing_version = 0

    if (existing_google_versions && Object.keys(existing_google_versions).length > 0) {
      highest_existing_version = Object.keys(existing_google_versions).sort((a, b) => {
        const aVersion = +a.match(/.-\[([^\[\]]+)\]\S+/)[1]
        const bVersion = +b.match(/.-\[([^\[\]]+)\]\S+/)[1]

        return aVersion - bVersion
      })
      highest_existing_version = +highest_existing_version[highest_existing_version.length - 1].match(/.-\[([^\[\]]+)\]\S+/)[1]
    } else {
      existing_google_versions = {}
    }

    Object.keys(all_google_versions).forEach(version => {
      const version_number = +version.match(/.-\[([^\[\]]+)\]\S+/)[1]
      if (version_number > highest_existing_version) {
        google_versions_to_update[version] = all_google_versions[version]
      }
      existing_google_versions[version] = all_google_versions[version]
    })

    // WINSTON PLS HALP
    if (existing_google_versions) await pool.query('UPDATE skill_versions SET google_versions = $2 WHERE skill_id = $1', [skill_id, existing_google_versions])
  } catch (e) {
    await new Promise((resolve, reject) => {
      del([dir]).then(resolve()).catch(e => reject(e))
    })
    console.error(e)
    reject(`Unable to check Google Actions version! Does the project ${project_id} belong to the same google account that you used for authentication?`)
  }
  await new Promise((resolve, reject) => {
    del([dir]).then(resolve()).catch(e => reject(e))
  })
  resolve(google_versions_to_update)
})

const publish = (req, res) => {
  if (!req.user || !req.params.skill_id || !req.params.diagram_id) {
    return res.sendStatus(401)
  }

  let skill_id = hashids.decode(req.params.skill_id)[0]
  let platform = req.body.platform || 'alexa'
  let google_project_id

  if (platform === 'google') {
    google_project_id = req.body.project_id
    if (!google_project_id) return res.sendStatus(401)
  }

  // Copy the skill, making sure it points to the same canonical skill point
  const updateVersion = async (new_skill_id_decoded, skill_id, new_skill_row) => {

    let google_versions_to_update
    if (platform === 'google') {
      try {
        const token = await _getGoogleAccessToken(req.user.id)
        google_versions_to_update = await checkGactionsVersionChanged(token, google_project_id, skill_id)
        if (Object.keys(google_versions_to_update).length === 0) google_versions_to_update = null
        // WINSTON PLS HALP
        const versions = await pool.query(`
          SELECT
            skill_id
          FROM
            skill_versions
          WHERE
            canonical_skill_id = (
              SELECT
                COALESCE(canonical_skill_id, $2)
              FROM
                skill_versions
              WHERE
                skill_id = $1)
              AND published_platform = $3
              AND version = (
                SELECT
                  MAX(version)
                FROM
                  skill_versions
                WHERE
                  canonical_skill_id = (
                    SELECT
                      COALESCE(canonical_skill_id, $2)
                    FROM
                      skill_versions
                    WHERE
                      skill_id = $1)
                    AND published_platform = $3)`, [skill_id, new_skill_id_decoded, platform])

        if (versions.rows && versions.rows.length > 0) {
          let latest_version_skill_id = versions.rows[0].skill_id
          await pool.query('UPDATE project_versions SET google_versions = $2 where version_id = $1', [latest_version_skill_id, google_versions_to_update])
        }
      } catch (e) {
        console.error(e)
        return res.status(400).send(e)
      }
    }

    let version_query = `
      INSERT INTO project_versions (project_id, version_id, platform)
      SELECT
        project_id, $1, $2
      FROM
        project_versions
      WHERE
        version_id = $3`

    pool.query(version_query, [new_skill_id_decoded, platform, skill_id], async (err, data) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', {
          err: err
        })
        res.sendStatus(500)
      } else {
        new_skill_row.canonical_skill_id = hashids.encode(data.rows[0].canonical_skill_id)
        res.send({
          new_skill: new_skill_row
        })
      }
    })
  }

  // Spoof the request cause we don't use it anymore
  req.params.id = hashids.encode(skill_id)
  req.params.target_creator = req.user.id
  copySkill(req, res, {
    renderDiagram: true
  }, (new_skill_row) => {
    let new_skill_id_decoded = hashids.decode(new_skill_row.skill_id)[0]
    updateVersion(new_skill_id_decoded, skill_id, new_skill_row)
  })
}

const publishTest = async (req, res) => {
  if (!req.user || !req.params.diagram_id) {
    return res.sendStatus(401)
  }

  let intents = {}
  let slots = {}
  if (Array.isArray(req.body.intents)) {
    req.body.intents.forEach(intent => {
      if (intent.key && intent.inputs && intent.inputs.length !== 0) {
        intents[intent.key] = intent.name
      }
    })
  }
  if (Array.isArray(req.body.slots)) {
    req.body.slots.forEach(slot => {
      if (slot.key) {
        slots[slot.key] = slot.name
      }
    })
  }

  let used_intents = new Set()
  let used_choices = []
  let status = await renderDiagram(req.user, req.params.diagram_id, 'TEST', {
    used_intents,
    used_choices,
    intents,
    slots
  }, undefined, req.body.platform)

  res.sendStatus(status)
}

const rerenderDiagram = async (req, res) => {
  let skill_id = hashids.decode(req.params.skill_id)[0]
  let diagram_id = req.params.diagram_id
  try{
    let skill_data = (await pool.query(`SELECT * FROM skills WHERE skill_id = $1 AND creator_id = $2`, [skill_id, req.user.id])).rows
    let skill = skill_data[0]
    let intents = {}
    let slots = {}
    // CONVERT ARRAY TO OBJECTS
    let used_intents = new Set(), used_choices = [], permissions = new Set(), interfaces = new Set()
    if (Array.isArray(skill.intents)) {
      skill.intents.forEach(intent => {
        if (intent.key) intents[intent.key] = intent.name
      })
    }
    if (Array.isArray(skill.slots)) {
      skill.slots.forEach(slot => {
        if (slot.key) slots[slot.key] = slot.name
      })
    }

    await renderDiagram(req.user, diagram_id, skill_id, {permissions, interfaces, used_intents, used_choices, intents, slots})
    res.sendStatus(200)
  } catch (err) {
    console.trace(err)
    res.sendStatus(500)
  }
}

module.exports = {
  updateName: updateName,
  getVariables: getVariables,
  getDiagram: getDiagram,
  deleteDiagram: deleteDiagram,
  setDiagram: setDiagram,
  publish: publish,
  publishTest: publishTest,
  copyDiagram: copyDiagram,
  rerenderDiagram: rerenderDiagram
}