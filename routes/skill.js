const axios = require('axios')
const _ = require('lodash')
const { docClient, pool, hashids, intercom, jwt } = require('./../services')
const { AccessToken } = require('./authentication')
const JSONs = require('./../config/amazon_json')
const { getEnvVariable } = require('../util')
const analytics = new (require('analytics-node'))(getEnvVariable('SEGMENT_WRITE_KEY'))
const { renderDiagram } = require('./render_diagram')

const logAxiosError = (err, context='') => {
  if(err && err.response){
    console.log(context, err.response.data && err.response.data.message, 'STATUS', err.response.status)    
  }else{
    console.log(context, err)
  }
}

const generateID = () => {
  return "xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const latestSkillToIntercom = (id, name) => {
  intercom.users.create({
    user_id: id,
    custom_attributes: {
      latest_skill: name
    }
  })
}

const incrementSkillsCreatedIntercom = (id) => {
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

exports.getSkills = (req, res) => {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  if (req.query.user && req.user.admin < 100) {
    res.sendStatus(401);
    return;
  }
  let userId = req.query.user ? req.query.user : req.user.id;
  pool.query(`
    SELECT * 
    FROM skills
    INNER JOIN skill_versions
    ON skills.skill_id = skill_versions.skill_id
    WHERE version IS NULL AND creator_id = $1`,
    [userId], (err, data) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.send(data.rows.map(skill => {
          skill.skill_id = hashids.encode(skill.skill_id);
          return skill;
        }));
      }
    })
}

exports.getSkill = (req, res) => {
  if (!req.params.id) {
    res.sendStatus(401);
    return;
  }

  let id = hashids.decode(req.params.id)[0];
  let sql;
  let params;
  if (req.query.preview) {
    // expose as little information as possible if previewing
    sql = `
          SELECT
              name,
              preview,
              diagram
          FROM
              skills
          WHERE
              skill_id = $1 LIMIT 1`;
    params = [id];
  } else if (req.query.simple) {
    sql = `
          SELECT
              name, amzn_id, review, live, diagram, locales, restart, global, intents, slots, inv_name, preview, account_linking, resume_prompt, error_prompt, fulfillment
          FROM
              skills
          WHERE
              skill_id = $1 AND
              creator_id = $2 LIMIT 1`;
    params = [id, req.user.id];
  } else {
    sql = `
          SELECT
              *
          FROM
              skills
          WHERE
              skill_id = $1 AND
              creator_id = $2 LIMIT 1`;
    params = [id, req.user.id];
  }

  pool.query(sql, params, (err, data) => {
    if (err) {
      console.trace(err);
      res.sendStatus(500);
    } else if (data.rows.length === 0) {
      res.sendStatus(404);
    } else {
      let skill = data.rows[0];

      // Rehash the skill id
      skill.skill_id = req.params.id;

      if (req.query.preview || !skill.amzn_id) {
        res.send(skill)
      } else {
        // Sync up with AMAZON
        // Check Current Amazon Status
        AccessToken(req.user.id, async (token) => {
          if (token === null) {
            // throw('INVALID TOKEN');
            return res.send(skill);
          }

          try {
            // get the vendorID
            let vendor_response = await axios.request({
              url: 'https://api.amazonalexa.com/v1/vendors',
              method: 'get',
              headers: {
                authorization: token
              }
            });

            let vendors = vendor_response.data.vendors;
            let vendorId;
            if (Array.isArray(vendors) && vendors.length !== 0) {
              vendorId = vendors[0].id;
              // literal storyflow id amzn1.ask.skill.b8413998-5296-4cca-8a0f-6c04103cc3eb
              let skill_status = await axios.request({
                url: `https://api.amazonalexa.com/v1/skills?vendorId=${vendorId}&skillId=${skill.amzn_id}`,
                method: 'GET',
                headers: {
                  Authorization: token
                }
              });

              if (Array.isArray(skill_status.data.skills)) {
                if (skill_status.data.skills.length === 0) {
                  // If 0 reset
                  skill.review = false;
                  skill.live = false;
                  skill.amzn_id = null;
                  res.send(skill);
                  pool.query('UPDATE skills SET review=FALSE, live=FALSE, amzn_id=NULL WHERE skill_id = $1', [id]);
                  return;
                }

                let still_review = false;
                let has_live = false;

                for (instance of skill_status.data.skills) {
                  if (instance.publicationStatus === 'PUBLISHED') {
                    has_live = true;
                  }
                  if (instance.publicationStatus === 'CERTIFICATION') {
                    still_review = true;
                  }
                }

                let update = false;
                if (skill.live !== has_live) {
                  skill.live = has_live;
                  update = true;
                }
                if (skill.review !== still_review) {
                  skill.review = still_review;
                  update = true;
                }

                if (update) {
                  pool.query('UPDATE skills SET review=$1, live=$2 WHERE skill_id=$3 AND creator_id=$4', [skill.review, skill.live, id, req.user.id]);
                }

                res.send(skill);

              } else {
                throw ('NO SKILLS FOUND skill.js > 120');
              }
            }

          } catch (err) {
            logAxiosError(err, 'GET SKILL')
            res.send(skill);
          }
        });
      }
    }
  });
};

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
      console.trace(err);
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
      console.trace(err);
      res.sendStatus(500);
    } else {
      res.send(data.rows);
    }
  });
}

exports.getProduct = (req, res) => {
  if (!req.params.sid || !req.params.pid) {
    res.sendStatus(401);
    return;
  }

  let sql = `SELECT id, name, data FROM products WHERE skill_id = $1 AND id = $2`;

  let sid = hashids.decode(req.params.sid)[0];
  let pid = req.params.pid;

  pool.query(sql, [sid, pid], (err, data) => {
    if (err) {
      console.trace(err);
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
    console.trace(err);
    return res.sendStatus(500)
  }

  product.last_save = Date.now()
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
    console.trace(err);
    res.sendStatus(500);
  }
}

exports.deleteProduct = async (req, res) => {
  if (!req.params.sid || !req.params.pid) {
    res.sendStatus(401);
    return;
  }

  let sid = hashids.decode(req.params.id)[0];
  let pid = req.params.pid;

  try {
    let result = await pool.query('SELECT creator_id FROM skills WHERE skill_id = $1 LIMIT 1', [sid])

    if (result.rows.length > 0 && result.rows[0].creator_id !== req.user.id && req.user.admin !== 10) {
      return res.sendStatus(403)
    }
  } catch (err) {
    console.trace(err);
    return res.sendStatus(500)
  }

  try {
    pool.query('DELETE FROM products WHERE id = $1', [pid], (err, results) => {
      if (err) {
        console.trace(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    })
  } catch (e) {
    console.error(e);
    console.trace();
    res.sendStatus(500);
  }
}

exports.deleteSkill = (req, res, delete_all_versions = true, cb = false) => {
  if (!req.user || !req.params.id) {
    res.sendStatus(401);
    return;
  }

  const deleteDiagrams = (diagram_id) => {
    pool.query('SELECT * FROM diagrams WHERE id = $1', [diagram_id], (err, results) => {
      let sub_diagrams;
      try {
        sub_diagrams = JSON.parse(results.rows[0].sub_diagrams)
      } catch (err) {
        sub_diagrams = []
      }

      if (sub_diagrams.length > 0) {
        for (let i = 0; i < sub_diagrams.length; i++) {
          deleteDiagrams(sub_diagrams[i])
        }
      }

      // Delete diagram from dynamo
      let params = {
        TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
        Key: {
          'id': diagram_id
        }
      }

      docClient.delete(params, async (err) => {
        if (err) {
          console.trace(err)
        } else {
          // Delete diagram from our tables
          pool.query('DELETE FROM diagrams WHERE id = $1', [diagram_id], (err) => {
            if (err) {
              console.trace(err)
            }
          })
        }
      })
    })
  }

  let id = hashids.decode(req.params.id)[0];
  let select_query
  if (delete_all_versions) {
    select_query = `
    SELECT * FROM skills INNER JOIN skill_versions ON skills.skill_id = skill_versions.skill_id 
    WHERE creator_id = $1 AND skill_versions.canonical_skill_id = 
      (SELECT min(canonical_skill_id) FROM skill_versions WHERE skill_versions.skill_id = $2)
    `
  } else {
    select_query = `SELECT * FROM skills WHERE creator_id = $1 AND skill_id = $2`
  }

  pool.query(select_query, [req.user.id, id], (err, results) => {
    // Delete skill off Amazon
    if (results.rows[0].amzn_id) {
      AccessToken(req.user.id, token => {
        if (token === null) {
          return;
        }

        axios.request({
            url: `https://api.amazonalexa.com/v1/skills/${results.rows[0].amzn_id}`,
            method: 'DELETE',
            headers: {
              Authorization: token
            }
          })
          .then(res => {
            // Sugoi!
          })
          .catch(err => {
            console.trace(err)
          })
      })
    }

    // Delete skill off our servers
    let delete_query
    if (delete_all_versions) {
      delete_query = `
        DELETE FROM skills WHERE creator_id = $1 AND skill_id IN 
        (SELECT skill_id FROM skill_versions WHERE canonical_skill_id = 
          (SELECT min(canonical_skill_id) FROM skill_versions WHERE skill_versions.skill_id = $2))`
    } else {
      delete_query = `DELETE FROM skills WHERE creator_id = $1 AND skill_id = $2`
    }
    pool.query(delete_query, [req.user.id, id],
      (err) => {
        if (err) {
          res.sendStatus(500)
        } else {
          // Default name of cb when no callback provided is 'next'
          if (cb && cb.name !== 'next') {
            cb()
          } else {
            res.sendStatus(200)
          }
        }
      })

    // Delete diagrams recursively and asyncly
    for (let i = 0; i < results.rows.length; i++) {
      deleteDiagrams(results.rows[i].diagram)
    }
  });
}

exports.patchSkill = (req, res) => {
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

  if (!b.fulfillment) {
    b.fulfillment = '{}'
  }

  if (req.query.fulfillment){
    pool.query(`UPDATE skills SET fulfillment = $3 WHERE skill_id = $1 AND creator_id = $2`, [id, req.user.id, b.fulfillment])
  }else if (req.query.settings) {
    pool.query(`UPDATE skills SET name = $3, restart = $4, resume_prompt = $5, error_prompt = $6  WHERE skill_id = $1 AND creator_id = $2`,
      [id, req.user.id, b.name, b.restart, b.resume_prompt, b.error_prompt], (err) => {
        if (err) {
          console.trace(err)
          res.sendStatus(500)
        } else {
          latestSkillToIntercom(req.user.id, b.name)
          res.sendStatus(200)
        }
    })
  } else if (req.query.intents) {
    pool.query(`
            UPDATE skills
            SET
            intents = $3,
            slots = $4,
            fulfillment = $5,
            account_linking = $6
            WHERE skill_id = $1 AND creator_id = $2`,
      [id, req.user.id, b.intents, b.slots, b.fulfillment, b.account_linking], (err) => {
        if (err) {
          console.trace(err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      })
  } else if (req.query.publish) {
    pool.query(`
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
      [id, b.name, b.inv_name, b.summary, b.description, b.keywords,
        {
          value: b.invocations
        },
        b.small_icon, b.large_icon, b.category,
        b.purchase, b.personal, b.copa, b.ads, b.export, b.instructions, b.locales,
        b.privacy_policy, b.terms_and_cond, req.user.id
      ], (err) => {
        if (err) {
          console.trace(err);
          res.sendStatus(500)
        } else {
          latestSkillToIntercom(req.user.id, b.name)
          res.sendStatus(200)
        }
      })
  } else if (req.query.preview) {
    pool.query(`
        UPDATE
          skills
        SET
          preview = $2
        WHERE
          skill_id = $1 AND creator_id = $3`,
      [id, b.isPreview, req.user.id], (err) => {
        if (err) {
          console.trace(err);
          res.sendStatus(500)
        } else {
          res.sendStatus(200)
        }
      })
  } else {
    pool.query(`
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
      [id, b.name, b.inv_name, b.summary, b.description, b.keywords,
        {
          value: b.invocations
        },
        b.small_icon, b.large_icon, b.category, b.locales,
        b.privacy_policy, b.terms_and_cond, req.user.id
      ], (err) => {
        if (err) {
          console.trace(err);
          res.sendStatus(500);
        } else {
          latestSkillToIntercom(req.user.id, b.name)
          res.sendStatus(200);
        }
      })
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

const checkVersions = (req, id, token) => {
  pool.query(`
    SELECT * FROM skill_versions INNER JOIN skills ON skill_versions.skill_id = skills.skill_id 
    WHERE canonical_skill_id = (SELECT canonical_skill_id FROM skill_versions WHERE skill_id = $1) 
      AND version IS NOT NULL ORDER BY version ASC`,
    [id],
    async (err, data) => {
      if (err) {
        console.trace(err)
      } else {
        // Check whether user has more versions than they should
        if ((req.user.admin >= 100 && data.rows.length > 50) || data.rows.length > 5) {
          try {
            // If so, we wanna know what version the live skill is pointing to rn
            let request = await axios.request({
              // url: `https://api.amazonalexa.com/v1/skills/${encodeURI(data.rows[0].amzn_id)}/stages/development/manifest`
              url: `https://api.amazonalexa.com/v1/skills/${encodeURI(data.rows[0].amzn_id)}/stages/live/manifest`,
              method: 'GET',
              headers: {
                Authorization: token
              }
            })

            // Delete the oldest version that isn't live
            let split_uri = request.data.manifest.apis.custom.endpoint.uri.split('/')
            let live_id = hashids.decode(split_uri[split_uri.length - 1])[0]
            let i = 0

            while (data.rows[i].skill_id === live_id && i < data.rows.length) {
              i += 1
            }

            if (i < data.rows.length) {
              pool.query('DELETE FROM skills WHERE skill_id = $1', [data.rows[i].skill_id], (err) => {
                if (err) {
                  console.trace(err)
                }
              })
            }
          } catch (err) {
            if(!(err && err.response && err.response.status === 404)){
              console.trace(err)
            }
          }
        }
      }
    })
}

exports.buildSkill = async (req, res) => {
  if (!req.params.id) {
    res.sendStatus(401)
  }
  try{
    incrementTimesPublishedIntercom(req.user.id);
  } catch (err) {
    console.trace(err)
  }
  

  let id = hashids.decode(req.params.id)[0];
  let original_id = req.params.id

  AccessToken(req.user.id, token => {
    if (token === null) {
      res.status(401).send({
        message: "Invalid Amazon Login Token"
      });
      return;
    }

    // Asynchronously check version logic, doesn't affect publishing
    checkVersions(req, id, token)

    pool.query('SELECT * FROM skills WHERE skills.skill_id = $1 LIMIT 1', [id], async (err, data) => {
      if (err) {
        console.trace(err)
        res.sendStatus(500)
      } else {

        let r = data.rows[0]

        let amzn_id = r.amzn_id
        let manifest = JSONs.manifest(r, original_id, req.user.name)

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
              // console.log(JSON.stringify(request.data.manifest));
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
            });
          }

          let account_linking = r.account_linking;

          if (!_.isNull(account_linking)) {
            account_linking.domains = _.flattenDeep(account_linking.domains)
            account_linking.scopes = _.flattenDeep(account_linking.scopes)
            account_linking.clientSecret = jwt.verify(account_linking.clientSecret, getEnvVariable('ACCOUNT_SECRET_SIGNATURE'));
            axios.request({
                url: `https://api.amazonalexa.com/v1/skills/${amzn_id}/stages/development/accountLinkingClient`,
                method: 'PUT',
                headers: {
                  Authorization: token
                },
                data: {
                  accountLinkingRequest: account_linking
                }
              })
              .catch(err => {
                logAxiosError(err, 'ACCOUNT LINKING')
                res.status(500).send(err.response.data)
              });
          }

          if (Array.isArray(r.locales) && r.locales.includes('en-US')) {
            let products = await pool.query("SELECT * FROM products WHERE skill_id = $1", [r.skill_id]);

            if (Array.isArray(products.rows) && products.rows.length !== 0) {
              for (row of products.rows) {
                let product = row.data;
                let productId = row.amzn_prod_id;

                try {
                  // Try to update the product if it exists
                  if (!productId) throw null
                  await axios.request({
                    url: `https://api.amazonalexa.com/v1/inSkillProducts/${productId}/stages/development`,
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

                  productId = product_response.data.productId

                  await pool.query("UPDATE products SET amzn_prod_id = $1 WHERE skill_id = $2", [productId, r.skill_id])

                  await axios.request({
                    url: `https://api.amazonalexa.com/v1/inSkillProducts/${productId}/skills/${amzn_id}`,
                    method: 'PUT',
                    headers: {
                      Authorization: token
                    }
                  })
                }
              }
            }
          }

          let model = JSONs.interactionModel(r)
          // console.log(JSON.stringify(model))

          const iterate = (depth) => {
            if (depth === 3) {
              res.status(500).send({
                message: "Skill is taking too long to be initialized"
              });
              return;
            } else {
              setTimeout(() => {

                const interactionModels = []
                r.locales.forEach(locale => {
                  interactionModels.push(axios.request({
                    url: `https://api.amazonalexa.com/v1/skills/${encodeURI(amzn_id)}/stages/development/interactionModel/locales/${locale}`,
                    method: 'PUT',
                    headers: {
                      Authorization: token
                    },
                    data: model
                  }))
                })

                Promise.all(interactionModels)
                  .then((promise_res) => {
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
                          .then(response => {
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

                              // Update canonical skill id's amzn id
                              pool.query(`
                                UPDATE skills SET amzn_id = $1 WHERE skills.skill_id = (SELECT canonical_skill_id FROM skill_versions WHERE skill_versions.skill_id = $2)`,
                                [amzn_id, id],
                                (err) => {
                                  if (err) {
                                    console.trace(err)
                                    res.sendStatus(500)
                                  } else {
                                    res.send(amzn_id)
                                  }
                                })
                            }
                          })
                          .catch(err => {
                            logAxiosError(err, 'GETTING SKILL MANIFEST')
                            res.status(500).send(err.response.data)
                          });
                      }, 10000)
                    }
                    getSkillStatus(0)
                  })
                  .catch(err => {
                    logAxiosError(err, 'INTERACTION MODEL UPLOAD')
                    if (err.response) {
                      if (err.response.status === 404) {
                        iterate(depth + 1)
                      } else {
                        res.status(500).send(err.response.data)
                      }
                    } else {
                      res.sendStatus(500)
                    }
                  })
              }, 5000)
            }
          }

          iterate(0);

        } catch (err) {
          logAxiosError(err, err.url)
          if (err.type === "VendorIdError") {
            // console.trace(err);
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
              Status(depth + 1);
            } else {
              axios.request({
                  url: `https://api.amazonalexa.com/v1/skills/${req.params.amzn_id}/submit`,
                  method: 'POST',
                  headers: {
                    Authorization: token
                  }
                })
                .then(response => {
                  pool.query(`
                                UPDATE skills
                                SET
                                review = TRUE
                                WHERE amzn_id = $1`,
                    [req.params.amzn_id],
                    (err) => {
                      if (err) {
                        console.trace(err);
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
                  console.trace(err);
                  res.sendStatus(500);
                });
            }
          })
          .catch(err => {
            console.log(err.response.status);
            res.status(500).send(err.response.data);
          });
      }, 10000);
    }
    getSkillStatus(0);
  });
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
              console.trace(err);
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          }
        );
      })
      .catch(err => {
        console.log(err.response.status);
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
      console.trace(err);
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
            account_linking, fulfillment, alexa_permissions, alexa_interfaces
          )
          SELECT ` +
      copy_str + `
              $1 AS diagram, $2 AS creator_id, amzn_id, summary, description, keywords, invocations, small_icon, large_icon, category,
              purchase, personal, copa, ads, export, instructions, inv_name, stage, review, live, locales, restart, global,
              privacy_policy, terms_and_cond, intents, slots, used_intents, used_choices, preview, resume_prompt, error_prompt,
              account_linking, fulfillment, alexa_permissions, alexa_interfaces
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

exports.getSkillVersions = (req, res) => {
  let id = hashids.decode(req.params.id)[0]
  pool.query(`
        SELECT skills.skill_id, created, version, diagram, canonical_skill_id, name, amzn_id, review, live, diagram, locales, restart, global, intents, slots, inv_name, preview, resume_prompt, error_prompt, fulfillment
        FROM skills 
        INNER JOIN skill_versions 
        ON skills.skill_id = skill_versions.skill_id 
        WHERE skill_versions.canonical_skill_id = 
            (SELECT canonical_skill_id FROM skill_versions WHERE skill_id = $1)
            AND version IS NOT NULL
        ORDER BY version DESC`, [id],
    (err, data) => {
      if (err) {
        console.trace(err)
        res.sendStatus(500)
      } else {
        for (let i = 0; i < data.rows.length; i++) {
          data.rows[i].skill_id = hashids.encode(data.rows[i].skill_id)
          data.rows[i].canonical_skill_id = hashids.encode(data.rows[i].canonical_skill_id)
        }
        res.send(data.rows)
      }
    }
  )
}

exports.restoreSkillVersion = (req, res) => {
  let canonical_skill_id = hashids.decode(req.params.canonical_skill_id)[0]
  req.params.id = req.params.restore_id
  req.params.target_creator = req.user.id
  exports.copySkill(req, res, {complete_copy: true}, (row) => {
    req.params.id = req.params.canonical_skill_id
    exports.deleteSkill(req, res, false, () => {
      let new_skill_id = hashids.decode(row.skill_id)[0]
      pool.query(
        `UPDATE skills SET skill_id = $1 WHERE skill_id = $2`,
        [canonical_skill_id, new_skill_id],
        (err, data) => {
          if (err) {
            console.trace(err)
            res.sendStatus(500)
          } else {
            pool.query(
              `INSERT INTO skill_versions (canonical_skill_id, skill_id) VALUES ($1, $2)`,
              [canonical_skill_id, canonical_skill_id],
              (err) => {
                if (err) {
                  console.trace(err)
                  res.sendStatus(500)
                }
                row.skill_id = req.params.canonical_skill_id
                res.send(row)
              }
            )
          }
        })
    })
  })
}