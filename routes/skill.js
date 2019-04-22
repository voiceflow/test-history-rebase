const axios = require('axios')
const _ = require('lodash')
const secondPass = require('./../config/secondary_pass')
const {
  pool,
  hashids,
  intercom,
  jwt,
  logAxiosError,
  writeToLogs,
  analytics
} = require('./../services')
const {
  AccessToken,
  AmazonAccessToken,
  _getGoogleAccessToken
} = require('./authentication')
const {createManifest} = require('./../config/manifest')
const {createInteractionModel} = require('./../config/interaction_model')
const {
  generateDialogflowPackage
} = require('./../config/gactions_package')
const {
  deleteVersionPromise,
  copySkill,
  deleteSkillDiagramsPromise
} = require('./skill_util')
const {
  pg_num
} = require('./../util')
const { checkSkillAccess } = require("./team_util")

const DialogflowClient = require('../clients/Dialogflow/Dialogflow')

const latestSkillToIntercom = (id, name) => {
  if(process.env.TEST) return
  intercom.users.create({
    user_id: id,
    custom_attributes: {
      latest_skill: name
    }
  })
}

const incrementSkillsCreatedIntercom = (id) => {
  if(process.env.TEST) return
  intercom.users.find({
    user_id: id
  }, async (res) => {
    if (!res.body) {
      return
    }
    let sc = res.body.custom_attributes.skills_created
    if (!sc) {
      let data = await pool.query('SELECT * FROM skills WHERE creator_id = $1', [id])
      if (Array.isArray(data.rows)) {
        sc = data.rows.length
      } else {
        sc = 1
      }
    }
    intercom.users.create({
      user_id: id,
      custom_attributes: {
        skills_created: sc
      }
    })
  })
}

exports.latestSkillToIntercom = latestSkillToIntercom
exports.incrementSkillsCreatedIntercom = incrementSkillsCreatedIntercom

const incrementTimesPublishedIntercom = (id) => {
  if(process.env.TEST) return
  intercom.users.find({
    user_id: id
  }, async (res) => {
    if (!res.body) {
      return
    }
    let n = res.body.custom_attributes.times_published ?
      res.body.custom_attributes.times_published : 0
    intercom.users.create({
      user_id: id,
      custom_attributes: {
        times_published: n + 1
      }
    })
  })
}

const incrementTimesPublishedSuccessfulIntercom = (id) => {
  if(process.env.TEST) return
  intercom.users.find({
    user_id: id
  }, async (res) => {
    if (!res.body) {
      return
    }
    let n = res.body.custom_attributes.times_published_successful ?
      res.body.custom_attributes.times_published_successful : 0
    intercom.users.create({
      user_id: id,
      custom_attributes: {
        times_published_successful: n + 1
      }
    })
  })
}

exports.getSkill = async (req, res) => {

  let project_id = hashids.decode(req.params.project_id)[0]
  let id = hashids.decode(req.params.skill_id)[0]
  let sql
  let params

  // Sync up with AMAZON
  // Check Current Amazon Status
  try {
    await checkVersions(project_id, 'alexa', {check_only: true})
  } catch (err) {
    writeToLogs('GET SKILL CHECK VERSIONS', {err});
  }

  if (req.query.preview) {
    // expose as little information as possible if previewing
    sql = `
      SELECT
        name,
        preview,
        diagram,
        intents,
        slots
      FROM
        skills
      WHERE
        skill_id = $1 LIMIT 1`;
    params = [id];
  } else {
    sql = `
      SELECT
        s.*, pm.amzn_id AS amzn_id
      FROM
        skills s
        INNER JOIN projects p ON p.project_id = s.project_id
        INNER JOIN team_members tm ON tm.team_id = p.team_id
        LEFT JOIN (SELECT * FROM project_members WHERE creator_id = $2) pm ON pm.project_id = p.project_id
        WHERE
          skill_id = $1
          AND tm.creator_id = $2
        LIMIT 1`;
    params = [id, req.user.id]
  }

  try{
    let skill_data = (await pool.query(sql, params)).rows[0]
    if(skill_data === undefined){
      res.sendStatus(404)
    } else {
      delete skill_data.dialogflow_token
        // Don't expose these on front end

      skill_data.skill_id = req.params.skill_id
      skill_data.project_id = hashids.encode(skill_data.project_id)
      res.send(skill_data)
    }
  } catch (err){
    writeToLogs('CREATOR_BACKEND_ERRORS', {
      err: err
    })
    res.sendStatus(500)
  }
}

exports.getDiagrams = (req, res) => {
  if (!req.params.id) {
    res.sendStatus(401);
    return;
  }

  let sql = `SELECT d.id, d.name, d.sub_diagrams FROM diagrams d
        INNER JOIN skills s ON s.skill_id = d.skill_id WHERE d.skill_id = $1`

  let id = hashids.decode(req.params.id)[0];

  pool.query(sql, [id], (err, data) => {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', {
        err: err
      });
      res.sendStatus(500);
    } else {
      res.send(data.rows);
    }
  });
}

exports.getProducts = (req, res) => {
  if (!req.params.id) {
    res.sendStatus(401);
    return;
  }

  let sql = `SELECT id, name, data FROM products WHERE skill_id = $1`;

  let id = hashids.decode(req.params.id)[0];

  pool.query(sql, [id], (err, data) => {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', {
        err: err
      })
      res.sendStatus(500);
    } else {
      res.send(data.rows);
    }
  });
}

exports.getProduct = (req, res) => {
  if (!req.params.id || !req.params.pid) {
    res.sendStatus(401);
    return;
  }

  let sql = `SELECT id, name, data FROM products WHERE skill_id = $1 AND id = $2`;

  let id = hashids.decode(req.params.id)[0];
  let pid = req.params.pid;

  pool.query(sql, [id, pid], (err, data) => {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', {
        err: err
      });
      res.sendStatus(500);
    } else {
      res.send(data.rows);
    }
  });
}

exports.setProduct = async (req, res) => {
  let product = req.body;
  product.skill = hashids.decode(product.skill)[0]

  if(!(await checkSkillAccess(product.skill, req.user.id))){
    return res.sendStatus(403)
  }
  product.creator = req.user.id

  if (!product.name) {
    product.name = 'New Product'
  }
  try {
    if (req.query.new) {
      pool.query('INSERT INTO products (name, skill_id, data) VALUES ($1, $2, $3) RETURNING id', [product.name, product.skill, product.data], (err, results) => {
        res.status(200).send({
          id: results.rows[0].id
        });
      });
    } else {
      pool.query('UPDATE products SET data = $1, name = $2 WHERE id = $3', [product.data, product.name, product.id], (err, results) => {
        res.sendStatus(200);
      });
    }
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {
      err: err
    });
    res.sendStatus(500);
  }
}

exports.deleteProduct = async (req, res) => {
  if (!req.params.id || !req.params.pid) {
    res.sendStatus(401);
    return;
  }

  let pid = req.params.pid;

  try {
    products = (await pool.query(`
      SELECT pc.amzn_prod_id, pc.creator_id, p.skill_id 
      FROM products p 
      INNER JOIN product_creators pc ON pc.product_id = p.id
      WHERE p.id = $1
    `, [pid])).rows

    if(products.length === 0) throw { status: 404 }
    if(!(await checkSkillAccess(products[0].skill_id, req.user.id))) throw { status: 403 }

    products.forEach(product => {
      if(!product.amzn_prod_id) return

      AmazonAccessToken(dev_version.creator_id)
      .then(token => {
        if(!token) return
        axios.request({
          url: `https://api.amazonalexa.com/v1/inSkillProducts/${product.amzn_prod_id}/stages/development`,
          method: 'DELETE',
          headers: {
            Authorization: token
          }
        })
      })
    })

    await pool.query('DELETE FROM products WHERE id = $1', [pid])
    
  } catch (err) {
    if(!(err && err.status === 404)) writeToLogs('DELETE PRODUCT', err)

    if(err.message || err.status){
      return res.status(err.status || 400).send(err.message)
    }
    return res.sendStatus(500)
  }
}

exports.patchSkill = async (req, res) => {
  if (!req.user || !req.params.id || !req.body) {
    res.sendStatus(401)
    return
  }

  let id = hashids.decode(req.params.id)[0]
  if(!(await checkSkillAccess(id, req.user.id))){
    return res.sendStatus(403)
  }

  let b = req.body

  if (!b.locales) {
    b.locales = '["en-US"]';
  } else if (Array.isArray(b.locales)) {
    b.locales = JSON.stringify(b.locales)
  }

  if (!b.fulfillment) b.fulfillment = '{}'
  if (!b.name) b.name = 'UNTITLED PROJECT'

  try {
    if (req.query.fulfillment) {
      // UPDATE FULFILLMENT COLUMN
      await pool.query(`UPDATE skills SET fulfillment = $2 WHERE skill_id = $1`, [id, b.fulfillment])
    } else if (req.query.inv_name) {
      await pool.query(`UPDATE skills SET inv_name = $2 WHERE skill_id = $1`, [id, b.inv_name])
    } else if (req.query.settings) {
      if (typeof b.repeat !== 'number') {
        b.repeat = 100
      }
      if(!b.alexa_events) b.alexa_events = undefined
      // UPDATE COLUMNS RELATED TO SETTINGS
      await pool.query(`UPDATE skills SET name=$2, restart=$3, resume_prompt=$4, error_prompt=$5, alexa_events=$6, repeat=$7  WHERE skill_id = $1`,
        [id, b.name, b.restart, b.resume_prompt, b.error_prompt, b.alexa_events, b.repeat])
    } else if (req.query.intents) {
      // UPDATE INTENTS COLUMN
      await pool.query(`UPDATE skills SET intents=$2, slots=$3, fulfillment=$4, account_linking=$5, platform=$6 WHERE skill_id = $1`,
        [id, b.intents, b.slots, b.fulfillment, b.account_linking, b.platform])
    } else if (req.query.preview) {
      // UPDATE PREVIEW COLUMN
      await pool.query(`UPDATE skills SET preview = $2 WHERE skill_id = $1`, [id, b.isPreview])
    } else if (req.query.publish) {
      // UPDATE EVERYTHING RELATED TO PUBLISHING THE SKILL
      if (req.query.platform === 'google') {
        await pool.query(`
          UPDATE skills
          SET google_publish_info = $2
          WHERE skill_id = $1`,
          [id, JSON.stringify(b.google_publish_info)])
      } else {
        await pool.query(`
              UPDATE skills
              SET
              name = $2,
              inv_name = $3,
              summary = $4,
              description = $5,
              keywords = $6,
              invocations = $7,
              small_icon = $8,
              large_icon = $9,
              category = $10,
              purchase = $11,
              personal = $12,
              copa = $13,
              ads = $14,
              export = $15,
              instructions = $16,
              locales = $17,
              privacy_policy = $18,
              terms_and_cond = $19
              WHERE skill_id = $1`,
          [id, b.name, b.inv_name, b.summary, b.description, b.keywords, {value: b.invocations}, b.small_icon, b.large_icon, 
          b.category, b.purchase, b.personal, b.copa, b.ads, b.export, b.instructions, b.locales, b.privacy_policy, b.terms_and_cond])
      }
      latestSkillToIntercom(req.user.id, b.name)
    } else {
      // UPDATE GENERAL SKILL SETTINGS
      await pool.query(`
              UPDATE skills
              SET
              name = $2,
              inv_name = $3,
              summary = $4,
              description = $5,
              keywords = $6,
              invocations = $7,
              small_icon = $8,
              large_icon = $9,
              category = $10,
              locales = $11,
              privacy_policy = $12,
              terms_and_cond = $13
              WHERE skill_id = $1`,
        [id, b.name, b.inv_name, b.summary, b.description, b.keywords, {value: b.invocations},
        b.small_icon, b.large_icon, b.category, b.locales, b.privacy_policy, b.terms_and_cond])
      latestSkillToIntercom(req.user.id, b.name)
    }
    res.sendStatus(200)
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {
      err: err
    })
    res.sendStatus(500)
  }
}

exports.checkInterationModel = async (req, res) => {
  AccessToken(req.user.id, token => {
    if (token === null) {
      res.status(401).send({
        message: "Invalid Amazon Login Token"
      });
      return;
    }

    axios.request({
        url: `https://api.amazonalexa.com/v1/skills/${req.params.amzn_id}/status?resource=interactionModel`,
        method: 'GET',
        headers: {
          Authorization: token
        }
      }).then(result => {
        res.send(result.data)
      })
      .catch(err => {
        logAxiosError(err, 'CHECK INTERACTION MODEL')
        res.sendStatus(500)
      })
  })
}

exports.enableSkill = async (req, res) => {
  AccessToken(req.user.id, token => {
    if (token === null) {
      res.status(401).send({
        message: "Invalid Amazon Login Token"
      });
      return
    }

    axios.request({
        url: `https://api.amazonalexa.com/v1/skills/${req.params.amzn_id}/stages/development/enablement`,
        method: 'PUT',
        headers: {
          Authorization: token
        }
      }).then(result => {
        res.sendStatus(200)
      })
      .catch(err => {
        res.status(500).send(err && err.response && err.response.data)
      })
  })
}

const checkVersions = (project_id, platform, options={}) => new Promise(async resolve => {
  // get the project id and dev version from this skill
  try{

    // GET ALL THE BASE VERSIONS FROM PROJECT MEMBERS
    var q
    if (platform === 'alexa') {
      q = `SELECT * FROM project_members WHERE project_id = $1 AND amzn_id IS NOT NULL`
    } else if(platform === 'google') {
      q = `SELECT * FROM project_members WHERE project_id = $1 AND google_versions IS NOT NULL`
    } else {
      return resolve()
    }
    const dev_versions = (await pool.query(q, [project_id])).rows
    if(dev_versions.length === 0) return resolve()


    // GET ALL PROJECT VERSIONS
    const project_versions = (await pool.query(`
      SELECT s.* FROM skills s
      INNER JOIN projects p ON p.project_id = s.project_id
      WHERE s.skill_id != p.dev_version AND s.project_id = $1 AND s.platform = $2
      ORDER BY created ASC
    `, [project_id, platform])).rows

    if(project_versions.length === 0) return resolve()

    const creators = new Set()
    const live_ids = new Set()

    // If checking Alexa versions 
    if(platform === 'alexa'){

      const remove_live = new Set()
      const add_live = new Set()

      for(dev_version of dev_versions){        
        var token

        try {
          token = await AmazonAccessToken(dev_version.creator_id)
          if(!token) throw new Error("Token Not Found")
          
          await axios.request({
            url: `https://api.amazonalexa.com/v1/skills/${encodeURI(dev_version.amzn_id)}/stages/development/manifest`,
            method: 'GET',
            headers: {
              Authorization: token
            }
          });
        } catch(err) {
          continue
        }

        // skills published by this creator have been checked
        creators.add(dev_version.creator_id)

        // find all the live skills for this amzn skill
        const live_projects = project_versions.filter(v => ((v.amzn_id === dev_version.amzn_id) && v.live)).map(v => v.skill_id)
        var live_id

        try {
          // Check if this endpoint is LIVE
          // const response = await axios.request({
          //   url: `https://api.amazonalexa.com/v1/skills/${encodeURI(dev_version.amzn_id)}/stages/live/manifest`,
          //   method: 'GET',
          //   headers: {
          //     Authorization: token
          //   }
          // })

          // // take the endpoint's Version ID
          // const split_uri = response.data.manifest.apis.custom.endpoint.uri.split('/')
          // live_id = hashids.decode(split_uri[split_uri.length - 1])[0]

          // TEST
          live_id = 3741

          const index = live_projects.indexOf(live_id)

          // If it doesn't exist already, update it as live. If it doesn't don't try to remove it
          if(index === -1) {
            add_live.add(live_id)
          } else {
            live_projects.splice(index, 1)
          }
        } catch(err) {
          // If the response failed and it wasn't a 404 Not Found for Live Version
          if (!(err && err.response && err.response.status === 404 )) {
            creators.delete(dev_version.creator_id);
            continue
          }
        }

        live_projects.forEach(p => remove_live.add(p))
        live_ids.add(live_id)
      }

      if(remove_live.size > 0) {
        await pool.query(`UPDATE skills SET live = FALSE WHERE skill_id IN (${pg_num(remove_live.size)})`, Array.from(remove_live))
      }
      if(add_live.size > 0) {
        await pool.query(`UPDATE skills SET live = TRUE WHERE skill_id IN (${pg_num(add_live.size)})`, Array.from(add_live))
      }
    }else if(platform === 'google'){
      
      for(dev_version of dev_versions){
        const all_google_versions = dev_version.google_versions
        const creator_versions = project_versions.filter(v => ((v.creator_id === dev_version.creator_id) && !!v.google_versions))

        for(const version of creator_versions){
          const approvals = Object.keys(version.google_versions).map(key => all_google_versions[key].approval)
          if (approvals.length > 0 && approvals.filter(e => e !== 'DENIED').length > 0) {
            live_ids.add(version.skill_id)
          }
        }
        creators.add(dev_version.creator_id)
      }
    }

    // No need to delete on just the check
    if(options.check_only) return resolve()

    // ensure projects have max 10 versions of either google/amazon
    let i = 0
    let num_versions_to_delete = project_versions.length - 5
    let deletion_promises = []
    if (live_ids) {
      num_versions_to_delete -= live_ids.size
    }

    while (i < project_versions.length && num_versions_to_delete > 0) {
      const v = project_versions[i]
      if (
        !live_ids.has(v.skill_id) && creators.has(v.creator_id)
      ) {
        deletion_promises.push(deleteVersionPromise(v.creator_id, v.skill_id))
        num_versions_to_delete -= 1
      }
      i += 1
    }

    await Promise.all(deletion_promises)
    resolve()
  }catch(err){
    writeToLogs("CHECK VERSIONS", err)
    resolve()
  }
})

exports.buildSkill = async (req, res) => {
  let project_id = hashids.decode(req.params.project_id)[0];
  let id = hashids.decode(req.params.version_id)[0];
  let original_id = req.params.version_id

  try {
    incrementTimesPublishedIntercom(req.user.id);
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {
      err: err
    })
  }

  AccessToken(req.user.id, token => {
    if (token === null) {
      res.status(401).send({
        message: "Invalid Amazon Login Token"
      });
      return;
    }

    // Asynchronously check version logic, doesn't affect publishing
    checkVersions(project_id, 'alexa')

    pool.query(`
      SELECT s.*, pm.amzn_id AS amzn_id, pm.creator_id AS status 
      FROM skills s
      LEFT JOIN (SELECT * FROM project_members WHERE creator_id = $2) pm ON pm.project_id = s.project_id
      WHERE s.skill_id = $1 LIMIT 1
    `, [id, req.user.id], async (err, data) => {
      if (err || data.rowCount === 0) {
        writeToLogs('CREATOR_BACKEND_ERRORS', {
          err: err
        })
        res.sendStatus(500)
      } else {

        let r = data.rows[0]
        const project_id = r.project_id
        let amzn_id = r.amzn_id
        let manifest = createManifest(r, original_id)

        analytics.track({
          userId: req.user.id,
          event: 'Publish Attempt',
          properties: {
            amzn_id: amzn_id,
            skill_id: id
          }
        })

        try {
          if (amzn_id) {
            try {
              let request = await axios.request({
                url: `https://api.amazonalexa.com/v1/skills/${encodeURI(amzn_id)}/stages/development/manifest`,
                method: 'GET',
                headers: {
                  Authorization: token
                }
              });
              if (request.data.manifest &&
                request.data.manifest.lastUpdateRequest &&
                request.data.manifest.lastUpdateRequest.status === 'FAILED') {
                amzn_id = null;
              }
            } catch (err) {
              if (err.response.status === 404) {
                amzn_id = null;
              } else if (err.response) {
                console.error(err.response.status);
                console.error(JSON.stringify(err.response.data));
              }
            }
          }

          let vendor_request

          try {
            vendor_request = await axios.request({
              url: 'https://api.amazonalexa.com/v1/vendors',
              method: 'GET',
              headers: {
                Authorization: token
              }
            })
          } catch (err) {
            throw ({
              type: "VendorIdError",
              data: JSON.stringify(err && err.response && err.response.data)
            })
          }

          let vendors = vendor_request ? vendor_request.data.vendors : null
          let vendorId = null
          if (Array.isArray(vendors) && vendors.length !== 0) {
            vendorId = vendors[0].id;
          } else {
            throw ({
              type: "VendorIdError",
              data: JSON.stringify(vendor_request.data)
            })
          }

          // UPDATE MANIFEST
          try {
            if (!amzn_id) {

              manifest.vendorId = vendorId;

              let request = await axios.request({
                url: 'https://api.amazonalexa.com/v1/skills',
                method: 'POST',
                headers: {
                  Authorization: token
                },
                data: manifest
              });

              amzn_id = request.data.skillId;

              // Update AMZN ID in SQL
              if(!!r.status){
                await pool.query("UPDATE project_members SET amzn_id = $3 WHERE project_id = $1 AND creator_id = $2", 
                [project_id, req.user.id, amzn_id]);
              }else{
                await pool.query("INSERT INTO project_members (project_id, creator_id, amzn_id) VALUES ($1, $2, $3)", 
                [project_id, req.user.id, amzn_id])
                r.status = true
              }

              // Update Amazon ID
              r.amzn_id = amzn_id

            } else {

              await axios.request({
                url: `https://api.amazonalexa.com/v1/skills/${encodeURI(amzn_id)}/stages/development/manifest`,
                method: 'PUT',
                headers: {
                  Authorization: token
                },
                data: manifest
              })
            }
          } catch (err) {
            logAxiosError(err, 'PUT MANIFEST', JSON.stringify(manifest))
            throw err
          }

          // Update the AMZN ID of the current version (manifest updated)
          await pool.query('UPDATE skills SET amzn_id = $1 WHERE skill_id = $2', [amzn_id, id])

          // Don't even bother with products if not in US
          if (Array.isArray(r.locales) && r.locales.includes('en-US')) {
            let products = await pool.query(`
              SELECT p.*, pc.amzn_prod_id, pc.creator_id AS status
              FROM products p
              LEFT JOIN (SELECT * FROM product_creators WHERE creator_id = $2) pc ON p.id = pc.product_id
              WHERE skill_id = $1
            `, [r.skill_id, req.user.id]);

            if (Array.isArray(products.rows) && products.rows.length !== 0) {
              for (row of products.rows) {
                let product = row.data
                let productId = row.id
                let AmazonProductId = row.amzn_prod_id
                try {
                  // Try to update the product if it exists
                  if (!AmazonProductId) throw null
                  await axios.request({
                    url: `https://api.amazonalexa.com/v1/inSkillProducts/${AmazonProductId}/stages/development`,
                    method: 'PUT',
                    headers: {
                      Authorization: token
                    },
                    data: {
                      vendorId: vendorId,
                      inSkillProductDefinition: product
                    }
                  })
                } catch (err) {
                  if (err) logAxiosError(err, 'PRODUCT', JSON.stringify(product))
                  // Create new product and update the database
                  let product_response = await axios.request({
                    url: `https://api.amazonalexa.com/v1/inSkillProducts`,
                    method: 'POST',
                    headers: {
                      Authorization: token
                    },
                    data: {
                      vendorId: vendorId,
                      inSkillProductDefinition: product
                    }
                  })

                  AmazonProductId = product_response.data.productId

                  if(AmazonProductId !== row.amzn_prod_id) {
                    if(row.status){
                      await pool.query(
                        "UPDATE product_creators SET amzn_prod_id = $1 WHERE product_id = $2 AND creator_id = $3", 
                        [AmazonProductId, pid, req.user.id])
                    }else{
                      await pool.query(
                        "INSERT INTO product_creators (product_id, creator_id, amzn_prod_id) VALUES ($1, $2, $3)", 
                        [pid, req.user.id, AmazonProductId])
                    }
                  }

                  // Insert this Project with the skill
                  await axios.request({
                    url: `https://api.amazonalexa.com/v1/inSkillProducts/${AmazonProductId}/skills/${amzn_id}`,
                    method: 'PUT',
                    headers: {
                      Authorization: token
                    }
                  })
                }
              }
            }
          }

          const iterate = (depth) => {
            if (depth === 3) {
              res.status(500).send({
                message: "Skill is taking too long to be initialized"
              });
              return;
            } else {
              setTimeout(async () => {

                // interaction models only need to be generated per langauge. i.e en-US/en-CA or fr-CA/fr-FR are the same shit
                let models = {}
                let secondary = false // flag on doing a secondary pass
                for (locale of r.locales) {
                  // ONLY NEED ONE INTERACTION MODEL PER LANGUAGE LOCALE
                  let lang = locale.substring(0,2)
                  if(!(lang in models)){
                    let {model, samples} = createInteractionModel(r, locale)

                    models[lang] = model
                    // ruh-oh time to do a secondary pass on the entire project's diagram ripperionis
                    if(samples && !secondary) {
                      secondary = true
                      secondPass(r.diagram, samples)
                    }
                  }
                  
                  try {
                    await axios.request({
                      url: `https://api.amazonalexa.com/v1/skills/${encodeURI(amzn_id)}/stages/development/interactionModel/locales/${locale}`,
                      method: 'PUT',
                      headers: {
                        Authorization: token
                      },
                      data: models[lang]
                    })
                  } catch (err) {
                    logAxiosError(err, 'INTERACTION MODEL UPLOAD', JSON.stringify(models[lang]))
                    if (err.response) {
                      if (err.response.status === 404) {
                        iterate(depth + 1)
                      } else {
                        res.status(500).send(err.response.data)
                      }
                    } else {
                      res.sendStatus(500)
                    }
                    return
                  }
                }

                if (!_.isNull(r.account_linking)) {
                  let account_linking = r.account_linking
                  if (account_linking.defaultTokenExpirationInSeconds) {
                    account_linking.defaultTokenExpirationInSeconds = parseInt(account_linking.defaultTokenExpirationInSeconds)
                  }
                  account_linking.domains = _.flattenDeep(account_linking.domains)
                  account_linking.scopes = _.flattenDeep(account_linking.scopes)
                  if(account_linking.clientSecret) {
                    account_linking.clientSecret = jwt.verify(account_linking.clientSecret, process.env.JWT_SECRET)
                  }
                  try {
                    await axios.request({
                      url: `https://api.amazonalexa.com/v1/skills/${encodeURI(amzn_id)}/stages/development/accountLinkingClient`,
                      method: 'PUT',
                      headers: {
                        Authorization: token
                      },
                      data: {
                        accountLinkingRequest: account_linking
                      }
                    })
                  } catch (err) {
                    logAxiosError(err, 'ACCOUNT LINKING')
                    // return res.status(500).send(err.response.data)
                  }
                }

                // Check whether building before certifying
                const getSkillStatus = (depth) => {
                  setTimeout(() => {
                    axios.request({
                        url: `https://api.amazonalexa.com/v1/skills/${amzn_id}/stages/development/manifest`,
                        method: 'GET',
                        headers: {
                          Authorization: token
                        }
                      })
                      .then(async response => {
                        if (response.hasOwnProperty('violations')) {
                          getSkillStatus(depth + 1)
                        } else {
                          incrementTimesPublishedSuccessfulIntercom(req.user.id);

                          analytics.track({
                            userId: req.user.id,
                            event: 'Publish Success',
                            properties: {
                              amzn_id: amzn_id,
                              skill_id: id
                            }
                          })

                          if(r.amzn_id !== amzn_id){
                            // Update canonical skill id's amzn id
                            try{
                              // Update AMZN ID in SQL
                              if(!!r.status){
                                await pool.query("UPDATE project_members SET amzn_id = $3 WHERE project_id = $1 AND creator_id = $2", 
                                [project_id, req.user.id, amzn_id]);
                              }else{
                                await pool.query("INSERT INTO project_members (project_id, creator_id, amzn_id) VALUES ($1, $2, $3)", 
                                [project_id, req.user.id, amzn_id])
                              }
                            }catch(err){
                              writeToLogs('AMAZON PROJECT MEMBER', {err})
                              return res.sendStatus(500)
                            }
                          }

                          res.send(amzn_id)
                        }
                      })
                      .catch(err => {
                        logAxiosError(err, 'GETTING SKILL MANIFEST')
                        res.status(500).send(err.response.data)
                      });
                  }, 10000)
                }
                getSkillStatus(0)
              }, 5000)
            }
          }

          iterate(0);

        } catch (err) {
          logAxiosError(err, err.url)
          if (err.type === "VendorIdError") {
            // writeToLogs('CREATOR_BACKEND_ERRORS', {err: err});
            res.sendStatus(403);
          } else {
            if (err.response) {
              res.status(500).send(err.response.data);
            } else {
              res.sendStatus(500);
            }
          }
        }
      }
    });
  });
}

exports.certifySkill = (req, res) => {
  if (!req.params.amzn_id) {
    res.sendStatus(401);
  }

  AccessToken(req.user.id, token => {
    if (token === null) {
      res.status(401).send({
        message: "Invalid Amazon Login Token"
      });
      return;
    }
    // Check whether building before certifying
    const getSkillStatus = (depth) => {
      setTimeout(() => {
        axios.request({
            url: `https://api.amazonalexa.com/v1/skills/${req.params.amzn_id}/stages/development/manifest`,
            method: 'GET',
            headers: {
              Authorization: token
            }
          })
          .then(response => {
            if (response.hasOwnProperty('violations')) {
              getSkillStatus(depth + 1);
            } else {
              axios.request({
                  url: `https://api.amazonalexa.com/v1/skills/${req.params.amzn_id}/submit`,
                  method: 'POST',
                  headers: {
                    Authorization: token
                  }
                })
                .then(() => {
                  pool.query(`
                    UPDATE skills
                    SET
                    review = TRUE
                    WHERE amzn_id = $1`,
                    [req.params.amzn_id],
                    (err) => {
                      if (err) {
                        writeToLogs('CREATOR_BACKEND_ERRORS', {
                          err: err
                        });
                        res.sendStatus(500);
                      } else {
                        analytics.track({
                          userId: req.user.id,
                          event: 'Submitted for Certification',
                          properties: {
                            amzn_id: req.params.amzn_id,
                            skill_id: hashids.decode(req.params.id)[0]
                          }
                        })
                        res.sendStatus(200);
                      }
                    }
                  );
                })
                .catch(err => {
                  logAxiosError(err, 'CERTIFY SKILL')
                  res.status(500).send(err && err.response && err.response.data);
                });
            }
          })
          .catch(err => {
            logAxiosError(err, 'CERTIFY SKILL MANIFEST')
            res.status(500).send(err.response.data);
          });
      }, 10000);
    }
    getSkillStatus(0);
  })
}

exports.withdrawSkill = (req, res) => {
  if (!req.params.amzn_id) {
    res.sendStatus(401);
  }

  AccessToken(req.user.id, token => {
    if (token === null) {
      res.status(401).send({
        message: "Invalid Amazon Login Token"
      });
      return;
    }

    axios.request({
        url: `https://api.amazonalexa.com/v1/skills/${req.params.amzn_id}/withdraw`,
        method: 'POST',
        headers: {
          Authorization: token,
        },
        data: {
          //TODO: make this custom, not hardcoded
          reason: 'MORE_FEATURES'
        }
      })
      .then(response => {
        pool.query(`
                UPDATE skills
                SET
                review=FALSE
                WHERE amzn_id = $1`,
          [req.params.amzn_id],
          (err) => {
            if (err) {
              writeToLogs('CREATOR_BACKEND_ERRORS', {
                err: err
              });
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          }
        );
      })
      .catch(err => {
        logAxiosError(err, 'WITHDRAW SKILL')
        res.status(500).send(err.response.data);
      });
  });
}

exports.copyProduct = async (req, res) => {
  let id = hashids.decode(req.params.id)[0]
  let pid = req.params.pid

  let copy_query = `
      INSERT INTO products(
        skill_id,
        name,
        data
      )
      SELECT
        $1,
        coalesce(name, '') || ' Copy' AS name,
        data
        FROM products where id = $2 RETURNING *
    `
  pool.query(copy_query, [id, pid], (err, data) => {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', {
        err: err
      });
      res.sendStatus(500)
    } else {
      // let new_product_id = data.rows[0].id
      data.rows[0].skill_id = hashids.encode(data.rows[0].skill_id)
      res.send(data.rows[0])
    }
  })
}

exports.restoreSkillVersion = async (req, res) => {
  // Get dev version
  let dev_version, team_id
  let restore_id = hashids.decode(req.params.restore_id)[0]
  try {
    let data = (await pool.query(`
      SELECT dev_version, team_id FROM projects p 
      INNER JOIN skills s ON p.project_id = s.project_id
      WHERE s.skill_id = $1`, 
      [restore_id])
    ).rows[0]
    dev_version = data.dev_version
    team_id = data.team_id
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {
      err: err
    })
    return res.sendStatus(500)
  }

  if (dev_version === restore_id){
    return res.sendStatus(409)
  }

  // important to set it to the undecoded version
  req.params._version_id = restore_id
  req.params._team_id = team_id
  // Make a copy of the verision
  copySkill(req, res, {
    complete_copy: true
  }, async (row) => {
    try {
      // Delete the canonical skill's old diagrams
      await deleteSkillDiagramsPromise(dev_version)
      let new_skill_id = hashids.decode(row.skill_id)[0]
      // Set canonical's field to new version
      await pool.query(`
        UPDATE skills
        SET name=sq.name, diagram=sq.diagram, creator_id=sq.creator_id, amzn_id=sq.amzn_id, summary=sq.summary, description=sq.description, keywords=sq.keywords,
            invocations=sq.invocations, small_icon=sq.small_icon, large_icon=sq.large_icon, category=sq.category, purchase=sq.purchase, personal=sq.personal,
            copa=sq.copa, ads=sq.ads, export=sq.export, instructions=sq.instructions, inv_name=sq.inv_name, stage=sq.stage, review=sq.review, live=sq.live,
            locales=sq.locales, restart=sq.restart, global=sq.global, privacy_policy=sq.privacy_policy, terms_and_cond=sq.terms_and_cond, intents=sq.intents,
            slots=sq.slots, used_intents=sq.used_intents, used_choices=sq.used_choices, preview=sq.preview, resume_prompt=sq.resume_prompt, error_prompt=sq.error_prompt,
            account_linking=sq.account_linking, fulfillment=sq.fulfillment, alexa_permissions=sq.alexa_permissions, alexa_interfaces=sq.alexa_interfaces, alexa_events=sq.alexa_events,
            repeat=sq.repeat
        FROM (SELECT name, diagram, creator_id, amzn_id, summary, description, keywords, invocations, small_icon, large_icon, category,
              purchase, personal, copa, ads, export, instructions, inv_name, stage, review, live, locales, restart, global,
              privacy_policy, terms_and_cond, intents, slots, used_intents, used_choices, preview, resume_prompt, error_prompt,
              account_linking, fulfillment, alexa_permissions, alexa_interfaces, alexa_events, repeat
              FROM skills WHERE skill_id = $1) AS sq
        WHERE skills.skill_id = $2
      `, [new_skill_id, dev_version])
      // Update diagram to point to new skill
      await pool.query(`
        UPDATE diagrams
        SET skill_id = $1
        WHERE skill_id = $2
      `, [dev_version, new_skill_id])
      // Delete the new copy's skill row
      await deleteVersionPromise(req.user.id, new_skill_id, {delete_diagrams: false})
      row.skill_id = hashids.encode(dev_version)
      res.send(row)
    } catch (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', {
        err: err
      })
      res.sendStatus(500)
    }
  })
}

exports.buildGoogleSkill = async (req, res) => {

  let project_id = hashids.decode(req.params.project_id)[0];
  let id = hashids.decode(req.params.version_id)[0];
  let original_id = req.params.version_id

  try {
    const version = (await pool.query(`
      SELECT pm.*, s.google_publish_info, s.intents, s.slots, s.used_intents FROM project_members pm
      INNER JOIN skills s ON s.project_id = pm.project_id
      WHERE s.skill_id = $1 AND pm.creator_id = $2
    `, [id, req.user.id])).rows[0]

    if(!version) throw ('Not Found')

    const google_id = version.google_id
    const publish_info = version.google_publish_info

    if (!publish_info) throw ('No publish info found')
    if (_.isNil(google_id)) throw ('Project ID not found')

    let {
      locales,
      main_locale
    } = publish_info

    locales = [] // We only support one locale for now

    if (!main_locale) {
      main_locale = 'en'
    }

    version.skill_id = original_id

    let dialogflow_creds
    try {
      dialogflow_creds = version.dialogflow_token
    } catch (e) {
      throw ('Credentials not found')
    }

    checkVersions(project_id, 'google')

    const main_client = new DialogflowClient(google_id, dialogflow_creds.private_key, dialogflow_creds.client_email)

    let agent = await main_client.getAgent()
    if (agent && agent.length > 0) {
      agent = agent[0]
    }

    // Have to update the agent. TODO: Use canonical skill id in endpoint so this doesn't have to happen every time
    await main_client.updateAgentFulfillment(original_id, main_locale, locales)

    const updates = []
    const _package = generateDialogflowPackage(version)

    if (!locales.includes(main_locale)) {
      locales.push(main_locale)
    }

    locales.forEach(locale => {
      updates.push(updateDialogflowPackage(dialogflow_creds, google_id, _package, locale))
    })
    await Promise.all(updates)

    publish_info.uploaded = true
    await pool.query('UPDATE skills set google_publish_info = $2 WHERE skills.skill_id = $1', [id, publish_info])

    res.status(200).send({google_id: google_id})

  } catch (e) {
    console.trace(e)
    res.status(400).send(`Error while building skill: ${e}`)
  }
}

const updateDialogflowPackage = ({private_key, client_email}, google_id, {intents,slots}, locale) => 
new Promise(async (resolve, reject) => {
  try {
    const client = new DialogflowClient(google_id, private_key, client_email)
    client.setLocale(locale)
    await client.updateEntities(slots)
    await client.updateIntents(intents)
    await client.trainAgent()
    resolve()
  } catch (e) {
    reject(e)
  }
})

exports.getGoogleSkill = async (req, res) => {
  if (!req.params.id) {
    res.sendStatus(401);
    return;
  }

  let id = hashids.decode(req.params.id)[0];
  if(!(await checkSkillAccess(id, req.user.id))){
    return res.sendStatus(403)
  }
  pool.query(`
    SELECT s.created, s.diagram, s.google_publish_info, s.privacy_policy, s.terms_and_cond, pm.dialogflow_token
    FROM skills s
    LEFT JOIN (SELECT * FROM project_members WHERE creator_id = $2) pm ON pm.project_id = s.project_id
    WHERE skill_id = $1
    LIMIT 1`, 
  [id, req.user.id], async (err, data) => {
    if (err) {
      console.trace(err);
      res.sendStatus(500);
    } else if (data.rows.length === 0) {
      res.sendStatus(404);
    } else {
      let publish_info = data.rows[0].google_publish_info

      let google_id
      let private_key
      let client_email

      let defaultLanguageCode, supportedLanguageCodes
      if (data.rows[0].dialogflow_token) {
        try {
          let dialogflow_token = data.rows[0].dialogflow_token
          google_id = dialogflow_token.project_id
          private_key = dialogflow_token.private_key
          client_email = dialogflow_token.client_email

        } catch (e) {
          // JSON parse failed
          console.trace('Parsing dialogflow_token failed', e)
        }

        const client = new DialogflowClient(google_id, private_key, client_email)
        const agents = await client.getAgent();

        ({
          defaultLanguageCode,
          supportedLanguageCodes
        } = agents[0])
      }

      let {
        created,
        diagram,
        privacy_policy,
        terms_and_cond
      } = data.rows[0]

      const skillResp = {
        publish_info,
        created,
        diagram,
        google_id,
        defaultLanguageCode,
        supportedLanguageCodes,
        privacy_policy,
        terms_and_cond
      }

      // Rehash the skill id
      if (!google_id) {
        res.send(skillResp)
      } else {
        // Sync up with google
        // Check Current google Status
        const token = await _getGoogleAccessToken(req.user.id)
        if (token === null) {
          return res.send(skillResp);
        }

        try {
          // TODO Check status, in review/live/etc
          // Using gactions CLI
          skillResp.google_id = google_id
          res.send(skillResp)
        } catch (err) {
          console.log(err);
          res.send(skillResp);
        }
      }
    }
  });
}

const { getLogsProject } = require('./logs')

exports.getVersionInfo = async (req, res) => {
  let version = {}
  if(req.query.encoded){
    version.version_id = hashids.decode(req.params.version_id)[0]
    version.encoded = req.params.version_id
  }else{
    version.encoded = hashids.encode(req.params.version_id)
    version.version_id = req.params.version_id
  }

  try {
    version.project = (await pool.query(`
      SELECT p.* FROM projects p
      INNER JOIN skills s ON s.project_id = p.project_id
      WHERE s.skill_id = $1 LIMIT 1
    `, [version.version_id])).rows[0]

    version.versions = (await pool.query(`
      SELECT * FROM skills s
      LEFT JOIN project_members pm ON pm.project_id = s.project_id AND pm.creator_id = s.creator_id
      WHERE s.project_id = $1
    `, [version.project.project_id])).rows

    try{
      version.logs = await getLogsProject(version.project.project_id)
    }catch(err) {
      version.logs = []
    }

    version.versions = version.versions.map(v => {
      v.version_id = v.skill_id
      v.encoded = hashids.encode(v.version_id)
      delete v.skill_id
      return v
    })

    res.send(version)
  }catch(e){
    console.error(e)
    res.status(500).send(e)
  }
}