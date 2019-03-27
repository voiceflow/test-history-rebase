const axios = require('axios')
const { docClient, pool, hashids, logAxiosError, writeToLogs, analytics } = require('./../services')
const { AccessToken } = require('./authentication')
const { renderDiagram } = require('../config/render_diagram')
const { PLATFORMS } = require('../app/src/Constants')

const generateID = () => {
  return "xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

exports.deleteDynamoDiagramPromise = (diagram_id) => {
  return new Promise(async (resolve, reject) => {
    try{
      let diagrams_params = {
        TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
        Key: {
          'id': diagram_id
        }
      }
      let delete_diagrams_promise = docClient.delete(diagrams_params).promise()
      let skills_params = {
        TableName: process.env.SKILLS_DYNAMO_TABLE_BASE_NAME + '.live',
        Key: {
          'id': diagram_id
        }
      }
      let delete_skills_promise = docClient.delete(skills_params).promise()
    
      await delete_diagrams_promise
      await delete_skills_promise

      // don't care whether it's there or not
      try{
        let tests_params = {
          TableName: process.env.SKILLS_DYNAMO_TABLE_BASE_NAME + '.test',
          Key: {
            'id': diagram_id
          }
        }
        let delete_tests_promise = docClient.delete(tests_params).promise()
        await delete_tests_promise
        resolve()
      } catch (err) {
        resolve()
      }
    } catch (err) {
      reject(err)
    }
  })
}

exports.deleteSkillDiagramsPromise = (skill_id) => {
  return new Promise(async (resolve, reject) => {
    try{
      let diagram_data_rows = (await pool.query(`SELECT id FROM diagrams WHERE skill_id = $1`, [skill_id])).rows
      let diagram_delete_promises = []
      
      // Creating a set of ids for delete query, ex. (1,44545, 65564)
      let parsed_array = "("
      for(let i=0;i < diagram_data_rows.length;i++){
        // To0 f4st for 4mzn
        setTimeout(() => {diagram_delete_promises.push(exports.deleteDynamoDiagramPromise(diagram_data_rows[i].id))}, 20)

        if(i < diagram_data_rows.length - 1){
          parsed_array += "'" + diagram_data_rows[i].id + "',"
        } else {
          parsed_array += "'" + diagram_data_rows[i].id + "'"
        }
      }
      parsed_array += ")"
      // Delete the diagram rows since the skill they depend on won't be deleted
      await pool.query(`DELETE FROM diagrams WHERE id IN ${parsed_array}`)

      Promise.all(diagram_delete_promises)
      .then(() => {
        resolve()
      })
      .catch((err) => {
        reject(err)
      })
    } catch (err){
      writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
      reject(err)
    }
  })
}

/*
 * delete_diagrams: set to true if you wanna delete the diagrams of the version, false if not
 */
exports.deleteVersionPromise = (creator_id, skill_id, opts) => {
  if(!opts) opts = {}
  if(opts.delete_diagrams === undefined) opts.delete_diagrams = true

  return new Promise(async (resolve, reject) => {
    let delete_query = `DELETE FROM skills WHERE creator_id = $1 AND skill_id = $2`
    let select_query = `SELECT * FROM diagrams WHERE skill_id = $1`
    try{
      if(opts.delete_diagrams){
        let skill_data_rows = (await pool.query(select_query, [skill_id])).rows
        if(skill_data_rows.length === 0){
          console.trace('DELETE VERSION, EMPTY ROWS', select_query, skill_id)
          return resolve()
        } 

        await pool.query(delete_query, [creator_id, skill_id])

        for(let i=0; i < skill_data_rows.length; i++){
          setTimeout(()=>{
            try {
              exports.deleteDynamoDiagramPromise(skill_data_rows[i].id)
            }catch(err){
              writeToLogs('DELETE DYNAMO ERROR', err)
            }
          }, 20 * i )
        }
      } else {
        await pool.query(delete_query, [creator_id, skill_id])
      }
      resolve()
    } catch (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', {err: err, context: 'deleteVersionPromise'})
      reject(err)
    }
  })
}

exports.deleteProjectPromise = (creator_id, project_id) => {
  return new Promise(async (resolve, reject) => {
    let select_query = `
      SELECT * FROM projects 
        INNER JOIN project_versions ON projects.project_id = project_versions.project_id 
        INNER JOIN skills ON project_versions.version_id = skills.skill_id
        INNER JOIN diagrams ON skills.skill_id = diagrams.skill_id
      WHERE projects.creator_id = $1 AND projects.project_id = $2
      `
    let delete_query = `
        DELETE FROM skills WHERE creator_id = $1 AND skill_id IN 
        (SELECT version_id FROM project_versions WHERE project_id = $2)`

    try{
      let project_data_rows = (await pool.query(select_query, [creator_id, project_id])).rows
      if(project_data_rows.length === 0){
        console.trace('DELETE SKILL, EMPTY ROWS', select_query, creator_id, project_id)
        return resolve()
      }

      // Only if deleting the whole project
      if(project_data_rows[0] && project_data_rows[0].amzn_id){
        AccessToken(creator_id, token => {
          if (token === null) {
            return;
          }
  
          axios.request({
              url: `https://api.amazonalexa.com/v1/skills/${project_data_rows[0].amzn_id}`,
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

      await pool.query(delete_query, [creator_id, project_id])
      await pool.query(`DELETE FROM projects WHERE creator_id = $1 AND project_id = $2`, [creator_id, project_id])

      for(let i=0; i < project_data_rows.length; i++){
        // To0 f4st for 4mzn
        setTimeout(() => {
          try{
            exports.deleteDynamoDiagramPromise(project_data_rows[i].id)
          }catch(err){
            writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
          }
        }, 20 * i)
      }

      resolve()
    } catch (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
      reject(err)
    }
  })
}

copyProducts = (old_skill_id, new_skill_id) => new Promise(async (resolve, reject) => {
  let select_query = `
    SELECT * FROM products WHERE skill_id = $1 ORDER BY id
  `
  let copy_query = `
    INSERT INTO products (skill_id, name, data)
    (SELECT $1, name, data FROM products WHERE skill_id = $2 ORDER BY id)
    RETURNING *
  `
  try {
    let select_data = (await pool.query(select_query, [old_skill_id])).rows
    let insert_data = (await pool.query(copy_query, [new_skill_id, old_skill_id])).rows
    let product_remapping = {}

    if(select_data.length != insert_data.length){
      reject("Select and Insert had different lengths (copyProducts)")
    } 

    for(let i in select_data){
      product_remapping[hashids.encode(select_data[i].id)] = hashids.encode(insert_data[i].id)
    }
    resolve(product_remapping)
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {err: err, params: {old_skill_id: old_skill_id, new_skill_id: new_skill_id}})
    reject(err)
  }
})

copyEmailTemplates = (old_skill_id, new_skill_id, new_creator_id) => new Promise(async (resolve, reject) => {
  let select_query = `
    SELECT * FROM email_templates WHERE skill_id = $1 ORDER BY template_id
  `
  let copy_query = `
    INSERT INTO email_templates (creator_id, title, content, sender, variables, subject, skill_id)
    (SELECT $1, title, content, sender, variables, subject, $2 FROM email_templates WHERE skill_id = $3 ORDER BY template_id)
    RETURNING *
  `
  try {
    let select_data = (await pool.query(select_query, [old_skill_id])).rows
    let insert_data = (await pool.query(copy_query, [new_creator_id, new_skill_id, old_skill_id])).rows
    let email_templates_remapping = {}

    if(select_data.length != insert_data.length){
      reject("Select and Insert had different lengths (copyEmailTemplates)")
    } 

    for(let i in select_data){
      email_templates_remapping[hashids.encode(select_data[i].template_id)] = hashids.encode(insert_data[i].template_id)
    }
    resolve(email_templates_remapping)
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {err: err, params: {old_skill_id: old_skill_id, new_skill_id: new_skill_id, new_creator_id: new_creator_id}})
    reject(err)
  }
})

copyDisplays = (old_skill_id, new_skill_id, new_creator_id) => new Promise(async (resolve, reject) => {
  let select_query = `
    SELECT * FROM displays WHERE skill_id = $1 ORDER BY id
  `
  let copy_query = `
    INSERT INTO displays (document, compatibility, creator_id, title, description, skill_id, datasource)
    (SELECT document, compatibility, $1, title, description, $2, datasource FROM displays WHERE skill_id = $3 ORDER BY id)
    RETURNING *
  `
  try {
    let select_data = (await pool.query(select_query, [old_skill_id])).rows
    let insert_data = (await pool.query(copy_query, [new_creator_id, new_skill_id, old_skill_id])).rows
    let displays_remapping = {}

    if(select_data.length != insert_data.length){
      reject("Select and Insert had different lengths (copyDisplays)")
    } 

    for(let i in select_data){
      displays_remapping[hashids.encode(select_data[i].id)] = hashids.encode(insert_data[i].id)
    }
    resolve(displays_remapping)
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {err: err, params: {old_skill_id: old_skill_id, new_skill_id: new_skill_id, new_creator_id: new_creator_id}})
    reject(err)
  }
})

const uploadCopiedDiagram = (data, new_skill_id, new_creator_id, diagram_names) => new Promise(async (resolve, reject) => {
  let params = {
    TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
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
    writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
    reject()
  }
})

const remapDiagramIds = async (diagram, new_skill_id, new_creator_id, mappings, platform) => {
  let sub_diagrams = new Set()
  let old_diagram_id = diagram.id

  diagram.id = mappings.diagram[diagram.id]
  diagram.skill = new_skill_id
  let JSON_diagram_data = JSON.parse(diagram.data)
  let nodes = JSON_diagram_data.nodes
  if (!!nodes) {
    for (var i = 0; i < nodes.length; i++) {
      let node = nodes[i]
      if (node.extras.diagram_id && node.extras.diagram_id !== null) {
        node.extras.diagram_id = mappings.diagram[node.extras.diagram_id]
        sub_diagrams.add(node.extras.diagram_id)
      } else if (node.extras[platform] && node.extras[platform].diagram_id && node.extras[platform].diagram_id !== null) {

        PLATFORMS.forEach(p => {
          node.extras[p].diagram_id = mappings.diagram[node.extras[p].diagram_id]
        })

        sub_diagrams.add(node.extras[platform].diagram_id)
      } else if (node.extras.display_id && node.extras.display_id !== null && mappings.display[node.extras.display_id]){
        node.extras.display_id = mappings.display[node.extras.display_id]
      } else if (node.extras.template_id && node.extras.template_id !== null && mappings.email[node.extras.template_id]){
        node.extras.template_id = mappings.email[node.extras.template_id]
      } else if (node.extras.product_id && node.extras.product_id !== null && mappings.product[node.extras.product_id]){
        node.extras.product_id = mappings.product[node.extras.product_id]
      } else if (Array.isArray(node.combines) && node.combines.length !== 0){
        for(var j = 0; j < node.combines.length; j++){
          PLATFORMS.forEach(p => {
            try{
              if(node.combines[j].extras[p] && node.combines[j].extras[p].diagram_id){
                node.combines[j].extras[p].diagram_id = mappings.diagram[node.combines[j].extras[p].diagram_id]
                sub_diagrams.add(node.combines[j].extras[p].diagram_id)
              }
            }catch(e){}
          })  
        }
      }
    } 
  }

  diagram.data = JSON.stringify(JSON_diagram_data)
  let result = await uploadCopiedDiagram({
    diagram: diagram,
    sub_diagrams: [...sub_diagrams],
    old_diagram_id: old_diagram_id
  }, new_skill_id, new_creator_id, mappings.names)
  return result
}

const remapAndCopyDiagram = (diagram_id, new_skill_id, platform, new_creator_id, mappings) => {
  return new Promise((resolve, reject) => {
    let get_params = {
      TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
      Key: {
        'id': diagram_id
      }
    }

    docClient.get(get_params, async (err, data) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
        reject(err)
      } else if (data.Item) {
        let result = await remapDiagramIds(data.Item, new_skill_id, new_creator_id, mappings, platform)
        if (typeof result === 'Error') {
          reject(result)
        } else {
          resolve(result)
        }
      }
    })
  })
}

const renderSkill = async (skill, user) => {
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
  try{
    await renderDiagram(req.user, skill.diagram, skill.skill_id, {permissions, interfaces, used_intents, used_choices, intents, slots}, undefined, skill.platform)
    // UPDATE SKILL 
    await pool.query('UPDATE skills set used_intents = $2, used_choices = $3, alexa_permissions = $4, alexa_interfaces = $5 WHERE skill_id = $1', 
    [skill.skill_id, JSON.stringify([...used_intents]), JSON.stringify(used_choices), JSON.stringify([...permissions]), JSON.stringify([...interfaces])])
  }catch(err){
    writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
  }
}

const generateCopySkillQuery = (options) => {
  let copy_str = (options.append_copy_str ? `coalesce(name, '') || ' Copy' AS name, ` : 'name, ')
  let copy_query
  if (options.complete_copy || options.renderDiagram) {
    copy_query = `
          INSERT INTO skills (
            name, diagram,creator_id, amzn_id, summary, description, keywords, invocations, small_icon, large_icon, category,
            purchase, personal, copa, ads, export, instructions, inv_name, stage, review, locales, restart, global,
            privacy_policy, terms_and_cond, intents, slots, used_intents, used_choices, preview, resume_prompt, error_prompt,
            account_linking, fulfillment, alexa_permissions, alexa_interfaces, alexa_events, repeat, platform, google_publish_info, dialogflow_token
          )
          SELECT ` +
      copy_str + `
              $1 AS diagram, $2 AS creator_id, amzn_id, summary, description, keywords, invocations, small_icon, large_icon, category,
              purchase, personal, copa, ads, export, instructions, inv_name, stage, review, locales, restart, global,
              privacy_policy, terms_and_cond, intents, slots, used_intents, used_choices, preview, resume_prompt, error_prompt,
              account_linking, fulfillment, alexa_permissions, alexa_interfaces, alexa_events, repeat, platform, google_publish_info, dialogflow_token
          FROM skills WHERE skill_id = $3 RETURNING *`
  } else {
    copy_query = `
          INSERT INTO skills (
            name, diagram, creator_id, summary, description, keywords, invocations, small_icon, large_icon, category, purchase,
            personal, copa, ads, export, instructions, inv_name, locales, restart, global, privacy_policy, terms_and_cond,
            intents, slots, used_intents, used_choices, resume_prompt, error_prompt, account_linking, fulfillment, repeat, alexa_events, platform, google_publish_info, dialogflow_token
          )
          SELECT ` +
      copy_str + `
            $1 AS diagram, $2 AS creator_id, summary, description, keywords, invocations, small_icon, large_icon, category, purchase,
            personal, copa, ads, export, instructions, inv_name, locales, restart, global, privacy_policy, terms_and_cond,
            intents, slots, used_intents, used_choices, resume_prompt, error_prompt, account_linking, fulfillment, repeat, alexa_events, platform, google_publish_info, dialogflow_token
          FROM skills WHERE skill_id = $3 RETURNING *`
  }
  return copy_query
}

exports.copySkill = async (req, res, options, cb = false) => {

  let id = hashids.decode(req.params.id)[0]
  let new_creator_id = (req.params.target_creator === 'me' ? req.user.id : req.params.target_creator)
  let diagram_mapping = {}
  let remapped_products = {}
  let remapped_emails = {}
  let remapped_displays = {}
  let diagram_names = {}
  let root_diagram_id = generateID()

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
  let copy_query = generateCopySkillQuery(options)

  try {
    let copy_skill
    if(!options.diagrams_only){
      copy_skill = (await pool.query(copy_query, [root_diagram_id, new_creator_id, id])).rows[0]
    }
    // Copy products, displays, and email templates on sql and store new ids for remapping
    if(options.user_copy) {
      try{
        remapped_products = await copyProducts(id, copy_skill.skill_id)
        remapped_emails = await copyEmailTemplates(id, copy_skill.skill_id, new_creator_id)
        remapped_displays = await copyDisplays(id, copy_skill.skill_id, new_creator_id)
      } catch (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
        res.sendStatus(500)
      }
    }

    let diagram_data = await pool.query('SELECT id, diagrams.name, intents, slots FROM diagrams INNER JOIN skills ON diagrams.skill_id = skills.skill_id WHERE skills.skill_id = $1', [id])
    let remap_and_copy_promises = []
    for (let i = 0; i < diagram_data.rows.length; i++) {
      diagram_names[diagram_data.rows[i].id] = diagram_data.rows[i].name
      if (diagram_data.rows[i].name === 'ROOT') {
        diagram_mapping[diagram_data.rows[i].id] = root_diagram_id
      } else {
        diagram_mapping[diagram_data.rows[i].id] = generateID()
      }
      remap_and_copy_promises.push(
        remapAndCopyDiagram(diagram_data.rows[i].id, copy_skill.skill_id, copy_skill.platform, new_creator_id, {
          diagram: diagram_mapping,
          display: remapped_displays,
          product: remapped_products,
          email: remapped_emails,
          names: diagram_names
        })
      )
    }

    Promise.all(remap_and_copy_promises)
      .then(async () => {
        // Add working version to table
        if (options.copying_default_template || options.user_copy) {
          try{
            if(options.request_cert){ 
              await pool.query(
                `INSERT INTO project_versions (project_id, version_id, cert_requested) VALUES ($1, $2, now())`, 
                [options.project_id, copy_skill.skill_id])
            } else {
              let new_project_data = (await pool.query(`
                INSERT INTO projects (name, creator_id, dev_version) 
                VALUES ($1, $2, $3) 
                RETURNING *`, 
              [copy_skill.name, copy_skill.creator_id, copy_skill.skill_id])).rows[0]
              copy_skill.project_id = hashids.encode(new_project_data.project_id)
              await pool.query(`INSERT INTO project_versions (project_id, version_id) VALUES ($1, $2)`, [new_project_data.project_id, copy_skill.skill_id])
            
              if(process.env.NODE_ENV !== 'test'){
                analytics.track({
                  userId: req.user.id,
                  event: 'Project Created',
                  properties: {
                    skill_id: copy_skill.skill_id,
                    original_skill_id: id
                  }
                })
              }
            } 
          } catch (err) {
            writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
            res.sendStatus(500)
          }
        }

        if(options.renderDiagram){
          await renderSkill(copy_skill, req.user)
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
        writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
        res.sendStatus(500)
      })
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
    res.sendStatus(500)
  }
}

// exports.copyDiagramFromSkill = async (skill_id, new_user, target_skill_id) => {
//   // skill_id = hashids.decode(skill_id)[0]
//   // if(target_skill_id){
//   //   target_skill_id = hashids.decode(target_skill_id)[0]
//   // }

//   const copyDynamo = (diagram_id) => {
//     let get_params = {
//       TableName: process.env.DIAGRAMS_DYNAMO_TABLE,
//       Key: {
//         'id': diagram_id
//       }
//     }

//     try{
//       let data = await docClient.get(get_params).promise()
//       if(data.Item){
//         remapDiagramIds(data.Item)
//       } else {
//         return null
//       }

//     } catch (err){
//       writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
//       return null
//     }
//   }

//   const copyDiagram = (diagram_row, user) => {
//     if(user === undefined){
//       user = 185 // TODO: set to marketplace user
//     }

//     return new Promise((resolve, reject) => {
//       let new_diagram_id = copyDynamo()

//       // Copy on SQL
//     })
//   }

//   try{
//     let diagram_data = (await pool.query(`SELECT * FROM diagrams WHERE skill_id = $1`, [skill_id])).rows
//     let copied_diagram_promises = []
//     for(let i in diagram_data){
//       copied_diagram_promises.push(copyDiagram(diagram_data[i], new_user))
//     }

//     Promise.all(copied_diagram_promises)
//     .then(() => {
//       console.log('goteem')
//       return 200
//     })
//     .catch(err => {
//       writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
//       return 500
//     })

//     return 500
//   } catch (err) {
//     writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
//     return 500
//   }
// }