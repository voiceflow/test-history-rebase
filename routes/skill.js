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
  AccessToken(req.user.id, async (token) => {
    if (token !== null) {
      try {
        await checkVersions(req.user, project_id, 'alexa', {token: token, check_only: true})
      } catch (err) {
        logAxiosError(err, 'GET SKILL')
      }
    }
  })

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
        s.*,
        pv.project_id
      FROM
        skills s
        INNER JOIN project_versions pv ON pv.version_id = s.skill_id
        WHERE
          skill_id = $1
          AND creator_id = $2
        LIMIT 1`;
    params = [id, req.user.id]
  }

  try{
    let skill_data = (await pool.query(sql, params)).rows[0]
    if(skill_data === undefined){
      res.sendStatus(404)
    } else {
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

  try {
    let result = await pool.query('SELECT creator_id FROM skills WHERE skill_id = $1 LIMIT 1', [product.skill])

    if (result.rows.length > 0 && result.rows[0].creator_id !== req.user.id && req.user.admin !== 10) {
      return res.sendStatus(403)
    } else {
      product.creator = req.user.id
    }
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {
      err: err
    });
    return res.sendStatus(500)
  }

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

const deleteProductSQL = async (pid, res) => {
  pool.query('DELETE FROM products WHERE id = $1', [pid], (err, results) => {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', {
        err: err
      })
      res.sendStatus(500)
    } else {
      res.sendStatus(200)
    }
  })
}

exports.deleteProduct = async (req, res) => {
  if (!req.params.id || !req.params.pid) {
    res.sendStatus(401);
    return;
  }

  let pid = req.params.pid;
  let result
  try {
    result = await pool.query('SELECT p.amzn_prod_id FROM products p INNER JOIN skills s ON s.skill_id = p.skill_id WHERE s.creator_id = $1 AND p.id = $2 LIMIT 1', [req.user.id, pid])

    if (result.rows.length === 0) {
      return res.sendStatus(412)
    } else {
      result = result.rows[0]
    }
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {
      err: err
    });
    return res.sendStatus(500)
  }

  if (result.amzn_prod_id) {
    AccessToken(req.user.id, async (token) => {
      if (token === null) {
        return res.status(401).send({
          message: "Invalid Amazon Login Token"
        })
      }
      try {
        await axios.request({
          url: `https://api.amazonalexa.com/v1/inSkillProducts/${result.amzn_prod_id}/stages/development`,
          method: 'DELETE',
          headers: {
            Authorization: token
          }
        })
      } catch (err) {}
      deleteProductSQL(pid, res)
    })
  } else {
    deleteProductSQL(pid, res)
  }
}

exports.patchSkill = async (req, res) => {
  if (!req.user || !req.params.id || !req.body) {
    res.sendStatus(401)
    return
  }

  let id = hashids.decode(req.params.id)[0]
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
      await pool.query(`UPDATE skills SET fulfillment = $3 WHERE skill_id = $1 AND creator_id = $2`, [id, req.user.id, b.fulfillment])
    } else if (req.query.inv_name) {
      await pool.query(`UPDATE skills SET inv_name = $3 WHERE skill_id = $1 AND creator_id = $2`, [id, req.user.id, b.inv_name])
    } else if (req.query.settings) {
      if (typeof b.repeat !== 'number') {
        b.repeat = 100
      }
      // UPDATE COLUMNS RELATED TO SETTINGS
      await pool.query(`UPDATE skills SET name = $3, restart = $4, resume_prompt = $5, error_prompt = $6, alexa_events = $7, repeat = $8  WHERE skill_id = $1 AND creator_id = $2`,
        [id, req.user.id, b.name, b.restart, b.resume_prompt, b.error_prompt, b.alexa_events, b.repeat])
    } else if (req.query.intents) {
      // UPDATE INTENTS COLUMN
      await pool.query(`UPDATE skills SET intents = $3, slots = $4, fulfillment = $5, account_linking = $6, platform = $7 WHERE skill_id = $1 AND creator_id = $2`,
        [id, req.user.id, b.intents, b.slots, b.fulfillment, b.account_linking, b.platform])
    } else if (req.query.preview) {
      // UPDATE PREVIEW COLUMN
      await pool.query(`UPDATE skills SET preview = $2 WHERE skill_id = $1 AND creator_id = $3`, [id, b.isPreview, req.user.id])
    } else if (req.query.publish) {
      // UPDATE EVERYTHING RELATED TO PUBLISHING THE SKILL
      if (req.query.platform === 'google') {
        await pool.query(`
          UPDATE skills
          SET
          google_publish_info = $3
          WHERE skill_id = $1 AND creator_id = $2`,
          [id, req.user.id, JSON.stringify(b.google_publish_info)])
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
              WHERE skill_id = $1 AND creator_id = $20`,
          [id, b.name, b.inv_name, b.summary, b.description, b.keywords, {
              value: b.invocations
            }, b.small_icon, b.large_icon, b.category,
            b.purchase, b.personal, b.copa, b.ads, b.export, b.instructions, b.locales, b.privacy_policy, b.terms_and_cond, req.user.id
          ])
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
              WHERE skill_id = $1 AND creator_id = $14`,
        [id, b.name, b.inv_name, b.summary, b.description, b.keywords, {
            value: b.invocations
          },
          b.small_icon, b.large_icon, b.category, b.locales, b.privacy_policy, b.terms_and_cond, req.user.id
        ])
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

const checkVersions = (user, project_id, platform, options) => {
  if(!options) options = {}

  return new Promise(async (resolve, reject) => {

    // get the project id and dev version from this skill
    let dev_version
    try{
      const project = await pool.query(`
        SELECT project_id, dev_version FROM projects WHERE project_id = $1 LIMIT 1`, [project_id])
      dev_version = project.rows[0].dev_version
    }catch(err){
      return reject(err)
    }

    pool.query(`
      SELECT s.amzn_id, s.live, pv.* FROM skills s 
      INNER JOIN project_versions pv ON pv.version_id = s.skill_id
      WHERE pv.project_id = $1 
        AND ( pv.platform = $2 OR pv.platform IS NULL OR pv.version_id = $3)
        ORDER BY pv.created ASC`,
      [project_id, platform, dev_version],
      async (err, data) => {
        if (err) {
          writeToLogs('CREATOR_BACKEND_ERRORS', {
            err: err
          })
          reject(err)
        } else if (data.rows.length > 0){
          // Check for live version
          let current_live = data.rows.filter(v => !!v.live).map(v => v.version_id)
          let live_ids = []
          let dev_version_row = data.rows.find(version => version.version_id === dev_version)

          try {
            // If so, we wanna know what version the live skill is pointing to rn
            if (platform === 'alexa' && dev_version_row.amzn_id) {
              if(!options.token) throw new Error('No Token')

              let request = await axios.request({
                url: `https://api.amazonalexa.com/v1/skills/${encodeURI(dev_version_row.amzn_id)}/stages/live/manifest`,
                method: 'GET',
                headers: {
                  Authorization: options.token
                }
              })
              // Delete the oldest version that isn't live
              let split_uri = request.data.manifest.apis.custom.endpoint.uri.split('/')
              live_ids.push(hashids.decode(split_uri[split_uri.length - 1])[0])

              try {
                // RESET LIVE IF THERE IS A LIVE
                if(live_ids[0] && !current_live.includes(live_ids[0])) {
                  await pool.query(`
                    UPDATE skills s SET live = FALSE
                    FROM project_versions pv
                    WHERE pv.version_id = s.skill_id
                      AND pv.project_id = $1
                      AND pv.platform = $2
                  `, [project_id, platform])

                  await pool.query(`UPDATE skills s SET live = TRUE WHERE skill_id = $1`, [live_ids[0]])
                }
              } catch (err) {
                writeToLogs('CREATOR_BACKEND_ERRORS', {
                  err: err
                })
                reject(err)
              }
            } else if (platform === 'google') {
              // Get the latest list of versions from skill_versions table
              // Compare with each skill's attached versions
              // If no matches, then it is ok to delete

              const all_google_versions = dev_version_row.google_versions
              for (const row of data.rows) {
                if (row.version_id !== dev_version && row.google_versions) {
                  const approvals = Object.keys(row.google_versions).map(key => all_google_versions[key].approval)
                  if (approvals.length > 0 && approvals.filter(e => e !== 'DENIED').length > 0) {
                    live_ids.push(row.version_id)
                  }
                }
              }
            }
          } catch (err) {
            if(Array.isArray(current_live)){
              live_ids = live_ids.concat(current_live)
            }
          }
          // No need to delete on just the check
          if(options.check_only) return resolve()

          let i = 0
          let num_versions_to_delete = user.admin >= 100 ? data.rows.length - 10 : data.rows.length - 5
          let deletion_promises = []
          if (live_ids) {
            num_versions_to_delete -= live_ids.length
          }

          while (i < data.rows.length && num_versions_to_delete > 0) {
            if (!live_ids.includes(data.rows[i].version_id) && data.rows[i].version_id !== dev_version && data.rows[i].platform === platform) {
              deletion_promises.push(deleteVersionPromise(user.id, data.rows[i].version_id))
              num_versions_to_delete -= 1
            }
            i += 1
          }

          Promise.all(deletion_promises)
            .then(() => {
              resolve()
            })
            .catch((err) => {
              writeToLogs('DELETE_CHECK_VERSION_ERRORS', {err})
              reject(err)
            })
        }
      })
  })
}

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
    checkVersions(req.user, project_id, 'alexa', {token: token})

    pool.query('SELECT * FROM skills WHERE skills.skill_id = $1 LIMIT 1', [id], async (err, data) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', {
          err: err
        })
        res.sendStatus(500)
      } else {

        let r = data.rows[0]

        let amzn_id = r.amzn_id
        let manifest = createManifest(r, original_id, req.user.name)

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

              await pool.query("UPDATE skills SET amzn_id = $1 WHERE skill_id = $2", [amzn_id, r.skill_id]);
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

          // Don't even bother with products if not in US
          if (Array.isArray(r.locales) && r.locales.includes('en-US')) {
            let products = await pool.query("SELECT * FROM products WHERE skill_id = $1", [r.skill_id]);

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
                  await pool.query("UPDATE products SET amzn_prod_id = $1 WHERE id = $2", [AmazonProductId, productId])

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
                    account_linking.clientSecret = jwt.verify(account_linking.clientSecret, process.env.ACCOUNT_SECRET_SIGNATURE)
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
                              await pool.query(`
                              UPDATE skills SET amzn_id = $2 WHERE skill_id = (
                                SELECT dev_version FROM projects p
                                INNER JOIN project_versions pv ON p.project_id = pv.project_id
                                WHERE version_id = $1 LIMIT 1)`, 
                              [id, amzn_id])
                            }catch(err){
                              writeToLogs('CREATOR_BACKEND_ERRORS', {err})
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

exports.restoreSkillVersion = async (req, res) => {
  // Get dev version
  let dev_version
  let restore_id = hashids.decode(req.params.restore_id)[0]
  try {
    let data = (await pool.query(`
      SELECT dev_version FROM projects p 
      INNER JOIN project_versions pv ON p.project_id = pv.project_id
      WHERE pv.version_id = $1`, 
      [restore_id])
    ).rows[0]
    dev_version = data.dev_version
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {
      err: err
    })
    res.sendStatus(500)
  }

  if (dev_version === restore_id){
    return res.sendStatus(409)
  }

  // important to set it to the undecoded version
  req.params.id = req.params.restore_id
  req.params.target_creator = req.user.id
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

  let vf_project_id = hashids.decode(req.params.project_id)[0];
  let id = hashids.decode(req.params.version_id)[0];
  let original_id = req.params.version_id

  try {
    const skill_info = await new Promise((resolve, reject) => {
      pool.query('SELECT * FROM skills WHERE skills.skill_id = $1 LIMIT 1', [id], async (err, data) => {
        if (err) {
          console.trace(err)
          reject()
        } else {
          let r = data.rows[0]
          resolve(r)
        }
      })
    })

    const publish_info = skill_info.google_publish_info
    if (!publish_info) {
      throw ('No publish info found')
    }

    const project_id = publish_info.project_id

    let {
      locales,
      main_locale
    } = publish_info

    locales = [] // We only support one locale for now

    if (!main_locale) {
      main_locale = 'en'
    }

    if (_.isNil(project_id)) {
      throw ('Project ID not found')
    }

    skill_info.skill_id = original_id

    let dialogflow_creds
    try {
      dialogflow_creds = JSON.parse(skill_info.dialogflow_token)
    } catch (e) {
      throw ('Credentials not found')
    }

    checkVersions(req.user, vf_project_id, 'google')

    const main_client = new DialogflowClient(project_id, dialogflow_creds.private_key, dialogflow_creds.client_email)

    let agent = await main_client.getAgent()
    if (agent && agent.length > 0) {
      agent = agent[0]
    }

    // Have to update the agent. TODO: Use canonical skill id in endpoint so this doesn't have to happen every time
    await main_client.updateAgentFulfillment(original_id, main_locale, locales)

    const updates = []
    const _package = generateDialogflowPackage(skill_info)

    if (!locales.includes(main_locale)) {
      locales.push(main_locale)
    }

    locales.forEach(locale => {
      updates.push(updateDialogflowPackage(dialogflow_creds, project_id, _package, skill_info, locale))
    })
    await Promise.all(updates)
    publish_info.uploaded = true

    await new Promise((resolve, reject) => {
      pool.query('UPDATE skills set google_publish_info = $2 WHERE skills.skill_id = $1', [id, publish_info], async (err) => {
        if (err) {
          console.trace(err)
          reject()
        } else {
          resolve()
        }
      })
    })

    res.status(200).send({
      project_id: project_id
    })
  } catch (e) {
    console.trace(e)
    res.status(400).send(`Error while building skill: ${e}`)
  }
}

const updateDialogflowPackage = ({
  private_key,
  client_email
}, project_id, {
  intents,
  slots
}, {
  skill_id
}, locale) => new Promise(async (resolve, reject) => {
  try {
    const client = new DialogflowClient(project_id, private_key, client_email)
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
  let sql;
  let params;

  sql = `
        SELECT
            created, diagram, google_publish_info, dialogflow_token, privacy_policy, terms_and_cond
        FROM
            skills
        WHERE
            skill_id = $1 AND
            creator_id = $2 LIMIT 1`;
  params = [id, req.user.id];

  pool.query(sql, params, async (err, data) => {
    if (err) {
      console.trace(err);
      res.sendStatus(500);
    } else if (data.rows.length === 0) {
      res.sendStatus(404);
    } else {
      let publish_info = data.rows[0].google_publish_info

      let project_id
      let private_key
      let client_email

      let defaultLanguageCode, supportedLanguageCodes
      if (data.rows[0].dialogflow_token) {
        try {
          let dialogflow_token = JSON.parse(data.rows[0].dialogflow_token)
          project_id = dialogflow_token.project_id
          private_key = dialogflow_token.private_key
          client_email = dialogflow_token.client_email

        } catch (e) {
          // JSON parse failed
          console.trace('Parsing dialogflow_token failed', e)
        }

        const client = new DialogflowClient(project_id, private_key, client_email)
        const agents = await client.getAgent();

        ({
          defaultLanguageCode,
          supportedLanguageCodes
        } = agents[0])
      }

      let {
        google_id,
        created,
        diagram,
        privacy_policy,
        terms_and_cond
      } = data.rows[0]

      const skillResp = {
        publish_info,
        created,
        diagram,
        project_id,
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
