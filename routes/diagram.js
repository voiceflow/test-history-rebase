const Util = require('./../config/util');
const { docClient, pool, hashids, validateEmail, writeToLogs } = require('./../services');
const { getEnvVariable } = require('../util')
const { copySkill } = require('./skill_util')
const { renderDiagram } = require('./render_diagram.js')

const generateID = () => {
  return "xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const getVariables = (req, res) => {
  let params = {
    TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
    Key: {
      'id': req.params.id
    },
    ProjectionExpression: 'variables'
  }

  docClient.get(params, (err, data) => {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
      res.sendStatus(err.statusCode);
    } else if (data.Item) {
      res.send(data.Item.variables);
    } else {
      res.sendStatus(404);
    }
  })
}

const getDiagrams = (req, res) => {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  let params = {
    TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
    ProjectionExpression: req.query.verbose ? 'id, title, last_save' : 'id, title'
  }

  if (req.user.admin < 100) {
    params.FilterExpression = 'creator = :creator'
    params.ExpressionAttributeValues = {
      ':creator': req.user.id
    }
  }

  let items = []

  docClient.scan(params, onScan);

  function onScan(err, data) {
    if (err) {
      console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      data.Items.forEach(function (item) {
        items.push(item)
      });

      // continue scanning if we have more items
      if (typeof data.LastEvaluatedKey != "undefined") {
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        docClient.scan(params, onScan);
      } else {
        items.sort((a, b) => {
          let keyA = a.title,
            keyB = b.title;
          // Compare the 2 dates
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });
        res.send(items);
      }
    }
  }
};

const getDiagram = (req, res) => {
  if (!req.user) {
    res.sendStatus(401);

    return;
  }

  let params = {
    TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
    Key: {
      'id': req.params.id
    }
  };
  docClient.get(params, (err, data) => {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
      res.sendStatus(err.statusCode);
    } else if (data.Item) {
      let diagram = data.Item

      if (diagram.preview === false) {
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
  try{
      data = JSON.parse(diagram.data)
  }catch(err){
      return res.status(500).send('Invalid Project Format')
  }
  if(!data || !data.nodes || data.nodes.length === 0){
      return res.status(500).send('Empty Project')
  }

  try{
      let result = await pool.query('SELECT creator_id FROM skills WHERE skill_id = $1 LIMIT 1', [diagram.skill])

      if(result.rows.length > 0 && result.rows[0].creator_id !== req.user.id && req.user.admin < 100){
          return res.sendStatus(403)
      }else{
          diagram.creator = req.user.id
      }
  }catch(err){
      writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
      return res.sendStatus(500)
  }

  diagram.last_save = Date.now();
  let params = {
      TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
      Item: {
          id: diagram.id,
          variables: diagram.variables,
          data: diagram.data,
          skill: diagram.skill,
          creator: diagram.creator
      }
  }

  let global_string, used_intents_string
  // Make sure that the JSON validly parses
  try {
      global_string = diagram.global ? JSON.stringify(diagram.global) : '[]'
  } catch(err) {
      global_string = '[]'
  }

  try {
      used_intents_string = diagram.used_intents ? JSON.stringify(diagram.used_intents) : '[]'
  } catch(err) {
      used_intents_string = '[]'
  }

  docClient.put(params, async(err) => {
      if (err) {
          writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
          res.sendStatus(err.statusCode);
      } else {
          try{
              if(req.query.new){
                  if (!diagram.title){
                      diagram.title = "New Flow";
                  }
                  // If it is a new diagram insert (assume it has no blocks)
                  await pool.query('INSERT INTO diagrams (id, name, skill_id) VALUES ($1, $2, $3)', [diagram.id, diagram.title, diagram.skill]);
              }else{
                  // otherwise update
                  await pool.query(`UPDATE diagrams SET sub_diagrams = $1, used_intents = $2, modified = NOW() WHERE id = $3`, [diagram.sub_diagrams, used_intents_string, diagram.id]);
                  await pool.query(`UPDATE skills SET global = $1 WHERE skill_id = $2`, [global_string, diagram.skill])
                  await pool.query(`UPDATE skill_versions SET last_save = NOW() WHERE skill_id=$1 AND canonical_skill_id = $1`, [diagram.skill]) 
              }
              res.sendStatus(200);
          }catch(e){
              writeToLogs('CREATOR_BACKEND_ERRORS', {err: e})
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
    [req.params.id, req.user.id], (err, response) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
        return res.sendStatus(500)
      }
      if (response.rowCount !== 0) {
        let params = {
          TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
          Key: {
            'id': req.params.id
          }
        }

        docClient.delete(params, err => {
          if (err) {
            writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
            res.sendStatus(err.statusCode);
          } else {
            res.sendStatus(200);
          }
        })
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
  try{
    let old_diagram_id = req.params.diagram_id
    let get_params = {
      TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
      Key: {
        'id': old_diagram_id
      }
    }
    let get_diagram_promise = docClient.get(get_params).promise()
    let data = await get_diagram_promise

    if(data.Item){
      let purged_diagram = purgeSubflows(JSON.parse(data.Item.data))
      let new_diagram_id = generateID()
      let diagram_name = 'Diagram Copy'
      if(req.query && req.query.name && req.query.name.length < 80) {
        diagram_name = req.query.name
      }

      let put_params = {
        TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
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
      
      try{
        await pool.query(`INSERT INTO diagrams (id, name, skill_id, used_intents) 
          (SELECT $1, $2, skill_id, used_intents FROM diagrams WHERE id = $3)`, [new_diagram_id, diagram_name, old_diagram_id])
        res.send(new_diagram_id)
      } catch (err) {
        // SQL insert failed so delete the diagram from dynamo
        let delete_params = {
          TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
          Key: {
            'id': new_diagram_id
          }
        }

        try{
          await docClient.delete(delete_params).promise()
          res.sendStatus(500)
        } catch (err) {
          writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
          res.sendStatus(500)
        }
      }
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
  }
}

const publish = (req, res) => {
  if (!req.user || !req.params.skill_id || !req.params.diagram_id) {
    return res.sendStatus(401)
  }

  let skill_id = hashids.decode(req.params.skill_id)[0]

  // Copy the skill, making sure it points to the same canonical skill point
  const updateVersion = (new_skill_id_decoded, skill_id, new_skill_row) => {
    let version_query = `
          INSERT INTO skill_versions (canonical_skill_id, version, skill_id)
          SELECT canonical_skill_id, COALESCE(max(version) + 1, 1), ${new_skill_id_decoded}
          FROM skill_versions
          WHERE canonical_skill_id = (SELECT COALESCE(canonical_skill_id, ${new_skill_id_decoded}) FROM skill_versions WHERE skill_id = ${skill_id})
          GROUP BY canonical_skill_id
          RETURNING *
          `

    pool.query(version_query, [], (err, data) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
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
  copySkill(req, res, {renderDiagram: true}, (new_skill_row) => {
    let new_skill_id_decoded = hashids.decode(new_skill_row.skill_id)[0]
    updateVersion(new_skill_id_decoded, skill_id, new_skill_row)
  })
}

const publishTest = async (req, res) => {
  if (!req.user || !req.params.diagram_id) {
    res.sendStatus(401)
    return;
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
  let used_choices = new Set()
  let status = await renderDiagram(req.user, req.params.diagram_id, 'TEST', {used_intents, used_choices, intents, slots})

  res.sendStatus(status)
}

module.exports = {
  updateName: updateName,
  getVariables: getVariables,
  getDiagrams: getDiagrams,
  getDiagram: getDiagram,
  deleteDiagram: deleteDiagram,
  setDiagram: setDiagram,
  publish: publish,
  publishTest: publishTest,
  copyDiagram: copyDiagram
}