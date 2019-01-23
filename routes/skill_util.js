const axios = require('axios')
const { docClient, pool, hashids, logAxiosError } = require('./../services')
const { AccessToken } = require('./authentication')
const { getEnvVariable } = require('../util')
const analytics = new (require('analytics-node'))(getEnvVariable('SEGMENT_WRITE_KEY'))
const { renderDiagram } = require('./render_diagram')

const generateID = () => {
  return "xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

exports.deleteDynamoDiagramPromise = (diagram_id) => {
  return new Promise(async (resolve, reject) => {
    let diagrams_params = {
      TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
      Key: {
        'id': diagram_id
      }
    }
    let delete_diagrams_promise = docClient.delete(diagrams_params).promise()
    let skills_params = {
      TableName: getEnvVariable('SKILLS_DYNAMO_TABLE_BASE_NAME') + '.live',
      Key: {
        'id': diagram_id
      }
    }
    let delete_skills_promise = docClient.delete(skills_params).promise()

    try{
      await delete_diagrams_promise
      await delete_skills_promise
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

exports.deleteSkillPromise = (creator_id, skill_id, delete_all_versions) => {
  return new Promise(async (resolve, reject) => {
    let select_query
    let delete_query

    if (delete_all_versions) {
      select_query = `
      SELECT * FROM skills 
        INNER JOIN skill_versions ON skills.skill_id = skill_versions.skill_id 
        INNER JOIN diagrams ON skills.skill_id = diagrams.skill_id
      WHERE creator_id = $1 AND skill_versions.canonical_skill_id = 
        (SELECT min(canonical_skill_id) FROM skill_versions WHERE skill_versions.skill_id = $2)
      `
      delete_query = `
        DELETE FROM skills WHERE creator_id = $1 AND skill_id IN 
        (SELECT skill_id FROM skill_versions WHERE canonical_skill_id = 
          (SELECT min(canonical_skill_id) FROM skill_versions WHERE skill_versions.skill_id = $2))`
    } else {
      select_query = `SELECT * FROM skills INNER JOIN diagrams ON diagrams.skill_id = skills.skill_id WHERE creator_id = $1 AND skills.skill_id = $2`
      delete_query = `DELETE FROM skills WHERE creator_id = $1 AND skill_id = $2`
    }

    try{
      let skill_data_rows = (await pool.query(select_query, [creator_id, skill_id])).rows
        // Only if deleting the whole project
        if(skill_data_rows[0].amzn_id && delete_all_versions){
          AccessToken(creator_id, token => {
            if (token === null) {
              return;
            }
    
            axios.request({
                url: `https://api.amazonalexa.com/v1/skills/${skill_data_rows[0].amzn_id}`,
                method: 'DELETE',
                headers: {
                  Authorization: token
                }
              })
              .catch(err => {
                logAxiosError(err, 'DELETE SKILL')
              })
          })
        }

        await pool.query(delete_query, [creator_id, skill_id])
        let diagram_delete_promises = []
        for(let i=0;i < skill_data_rows.length;i++){
          diagram_delete_promises.push(exports.deleteDynamoDiagramPromise(skill_data_rows[i].id))
        }

        Promise.all(diagram_delete_promises)
        .then(() => {
          resolve()
        })
        .catch((err) => {
          console.trace(err)
          reject()
        })


    } catch (err) {
      console.trace(err)
      reject(err)
    }
  })
}

// Async call to copy all products
copyAllProducts = (id, new_skill_id) => {
  let copy_query = `
    INSERT INTO products (skill_id, name, data, amzn_prod_id)
    SELECT $1, name, data, amzn_prod_id FROM products WHERE id = $2
  `

  pool.query(copy_query, [new_skill_id, id], (err) => {
    if (err) {
      console.trace(err)
    }
  })
}

// Async call to copy all templates
copyAllTemplates = (id, new_skill_id) => {
  let copy_query = `
    INSERT INTO email_templates (creator_id, title, created, content, sender, variables, subject, skill_id)
    SELECT creator_id, title, NOW(), content, sender, variables, subject, $1 FROM email_templates WHERE skill_id = $2
  `

  pool.query(copy_query, [new_skill_id, id], (err) => {
    if (err) {
      console.trace(err)
    }
  })
}

// Async call to
copyAllDisplays = (id, new_skill_id) => {
  let copy_query = `
    INSERT INTO displays (document, compatibility, created_at, creator_id, title, description, datasource, skill_id)
    SELECT document, compatibility, NOW(), creator_id, title, description, datasource, $1 FROM displays WHERE skill_id = $2
  `

  pool.query(copy_query, [new_skill_id, id], (err) => {
    if (err) {
      console.trace(err)
    }
  })
}

exports.copySkill = async (req, res, options, cb = false) => {

  let id = hashids.decode(req.params.id)[0]
  let new_creator_id = req.params.target_creator
  let diagram_mapping = {}
  let diagram_names = {}
  let root_diagram_id = generateID()

  if (new_creator_id === 'me') {
    new_creator_id = req.user.id
  }

  const retrieveDiagram = (diagram_id, new_skill_id) => {

    const uploadNewDiagram = (data) => new Promise(async (resolve, reject)=>{
      let params = {
        TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
        Item: {
          id: data.diagram.id,
          variables: data.diagram.variables,
          data: data.diagram.data,
          skill: new_skill_id,
          creator: new_creator_id
        }
      }

      try {
        await pool.query(
          `INSERT INTO diagrams (id, name, skill_id, sub_diagrams, used_intents) (SELECT $1, $2, $3, $4, used_intents FROM diagrams WHERE id = $5)`,
          [data.diagram.id, diagram_names[data.old_diagram_id], new_skill_id, JSON.stringify(data.sub_diagrams), data.old_diagram_id])
        await docClient.put(params).promise()
        resolve()
      } catch (err) {
        console.trace(err)
        reject()
      }
    })

    const remapDiagramIds = async (diagram) => {
      let sub_diagrams = []
      let old_diagram_id = diagram.id
      diagram.id = diagram_mapping[diagram.id]
      diagram.skill = new_skill_id
      let JSON_diagram_data = JSON.parse(diagram.data)
      let nodes = JSON_diagram_data.nodes

      if (!!nodes) {
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i]
          if (node.extras.diagram_id && node.extras.diagram_id !== null) {
            node.extras.diagram_id = diagram_mapping[node.extras.diagram_id]
            sub_diagrams.push(node.extras.diagram_id)
          }
        }
      }

      diagram.data = JSON.stringify(JSON_diagram_data)
      let result = await uploadNewDiagram({
        diagram: diagram,
        sub_diagrams: sub_diagrams,
        old_diagram_id: old_diagram_id
      })
      return result
    }

    // retrieveDiagramIds returns this promise
    return new Promise((resolve, reject) => {
      let get_params = {
        TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
        Key: {
          'id': diagram_id
        }
      }

      docClient.get(get_params, async (err, data) => {
        if (err) {
          console.trace(err)
          reject(err)
        } else if (data.Item) {
          let result = await remapDiagramIds(data.Item)
          if (typeof result === 'Error') {
            reject(result)
          } else {
            resolve(result)
          }
        }
      })
    })
  }

  const renderSkill = async (skill) => {
    let intents = {}
    let slots = {}
    // CONVERT ARRAY TO OBJECTS
    let used_intents = new Set(), used_choices = new Set(), permissions = new Set(), interfaces = new Set()
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
    try{
      await renderDiagram(req.user, skill.diagram, skill.skill_id, {permissions, interfaces, used_intents, used_choices, intents, slots})
      // UPDATE SKILL 
      await pool.query('UPDATE skills set used_intents = $2, used_choices = $3, alexa_permissions = $4, alexa_interfaces = $5 WHERE skill_id = $1', 
      [skill.skill_id, JSON.stringify([...used_intents]), JSON.stringify([...used_choices]), JSON.stringify([...permissions]), JSON.stringify([...interfaces])])
    }catch(err){
      console.trace(err)
    }
  }

  // Starts here: verify that the skill is under the current creator
  if (!options.copying_default_template) {
    if (req.user.admin < 100) {
      try {
        let data = await pool.query('SELECT creator_id FROM skills WHERE skill_id = $1', [id])
        if (data.rows.length === 0 || data.rows[0].creator_id !== req.user.id) {
          throw new Error('Not your skill')
        }
      } catch (err) {
        // forbidden
        return res.sendStatus(401)
      }
    }
  }

  let copy_str = (options.append_copy_str ? `coalesce(name, '') || ' Copy' AS name, ` : 'name, ')
  let copy_query
  if (options.complete_copy || options.renderDiagram) {
    copy_query = `
          INSERT INTO skills (
            name, diagram,creator_id, amzn_id, summary, description, keywords, invocations, small_icon, large_icon, category,
            purchase, personal, copa, ads, export, instructions, inv_name, stage, review, live, locales, restart, global,
            privacy_policy, terms_and_cond, intents, slots, used_intents, used_choices, preview, resume_prompt, error_prompt,
            account_linking, fulfillment, alexa_permissions, alexa_interfaces, alexa_events
          )
          SELECT ` +
      copy_str + `
              $1 AS diagram, $2 AS creator_id, amzn_id, summary, description, keywords, invocations, small_icon, large_icon, category,
              purchase, personal, copa, ads, export, instructions, inv_name, stage, review, live, locales, restart, global,
              privacy_policy, terms_and_cond, intents, slots, used_intents, used_choices, preview, resume_prompt, error_prompt,
              account_linking, fulfillment, alexa_permissions, alexa_interfaces, alexa_events
          FROM skills WHERE skill_id = $3 RETURNING *`
  } else {
    copy_query = `
          INSERT INTO skills (
            name, diagram, creator_id, summary, description, keywords, invocations, small_icon, large_icon, category, purchase,
            personal, copa, ads, export, instructions, inv_name, locales, restart, global, privacy_policy, terms_and_cond,
            intents, slots, used_intents, used_choices, resume_prompt, error_prompt, account_linking, fulfillment
          )
          SELECT ` +
      copy_str + `
            $1 AS diagram, $2 AS creator_id, summary, description, keywords, invocations, small_icon, large_icon, category, purchase,
            personal, copa, ads, export, instructions, inv_name, locales, restart, global, privacy_policy, terms_and_cond,
            intents, slots, used_intents, used_choices, resume_prompt, error_prompt, account_linking, fulfillment
          FROM skills WHERE skill_id = $3 RETURNING *`
  }

  try {
    let copy_skill = (await pool.query(copy_query, [root_diagram_id, new_creator_id, id])).rows[0]
    let diagram_data = await pool.query('SELECT id, diagrams.name, intents, slots FROM diagrams INNER JOIN skills ON diagrams.skill_id = skills.skill_id WHERE skills.skill_id = $1', [id])
    let retrieve_promises = []
    for (let i = 0; i < diagram_data.rows.length; i++) {
      diagram_names[diagram_data.rows[i].id] = diagram_data.rows[i].name
      if (diagram_data.rows[i].name === 'ROOT') {
        diagram_mapping[diagram_data.rows[i].id] = root_diagram_id
      } else {
        diagram_mapping[diagram_data.rows[i].id] = generateID()
      }
      retrieve_promises.push(
        retrieveDiagram(diagram_data.rows[i].id, copy_skill.skill_id)
      )
    }
    Promise.all(retrieve_promises)
      .then(async () => {
        // Add working version to table
        if (options.copying_default_template || options.user_copy) {
          pool.query(`INSERT INTO skill_versions (canonical_skill_id, skill_id) VALUES ($1, $2)`, [copy_skill.skill_id, copy_skill.skill_id], (err) => {
            if (err) {
              console.trace(err)
              res.sendStatus(500)
            }
          })

          analytics.track({
            userId: req.user.id,
            event: 'Project Created',
            properties: {
              skill_id: copy_skill.skill_id,
              original_skill_id: id
            }
          })
        }

        // Async copy rows depending on the skill, doesn't need to be synced
        copyAllDisplays(id, copy_skill.skill_id)
        copyAllProducts(id, copy_skill.skill_id)
        copyAllTemplates(id, copy_skill.skill_id)

        if(options.renderDiagram){
          await renderSkill(copy_skill)
        }

        // Default name of cb when no callback provided is 'next'
        copy_skill.skill_id = hashids.encode(copy_skill.skill_id)
        if (cb && cb.name !== 'next') {
          cb(copy_skill)
        } else {
          res.send(copy_skill)
        }
      })
      .catch((err) => {
        console.trace(err)
        res.sendStatus(500)
      })
  } catch (err) {
    console.trace(err)
    res.sendStatus(500)
  }
}