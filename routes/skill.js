const axios = require('axios')
const { docClient, pool, hashids, intercom } = require('./../services')
const { AccessToken } = require('./authentication')
const JSONs = require('./../config/amazon_json')
const { getEnvVariable } = require('../util')

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
  intercom.users.find({ user_id: id }, async (res) => {
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
  intercom.users.find({ user_id: id }, async (res) => {
    if (!res.body) {
      return
    }
    let n = res.body.custom_attributes.times_published
      ? res.body.custom_attributes.times_published : 0
    intercom.users.create({
      user_id: id,
      custom_attributes: {
        times_published: n + 1
      }
    })
  })
}

const incrementTimesPublishedSuccessfulIntercom = (id) => {
  intercom.users.find({ user_id: id }, async (res) => {
    if (!res.body) {
      return
    }
    let n = res.body.custom_attributes.times_published_successful
      ? res.body.custom_attributes.times_published_successful : 0
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
        SELECT
            *
        FROM
            skills
        WHERE
            creator_id = $1`,
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
                name, amzn_id, review, live, diagram, locales, restart, global, intents, slots, inv_name, preview, resume_prompt, error_prompt
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
      console.error(err);
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
            console.log(err);
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
      console.error(err);
      console.trace();
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
      console.error(err);
      console.trace();
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
      console.error(err);
      console.trace();
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
    console.error(err);
    return res.sendStatus(500)
  }

  product.last_save = Date.now();
  try {
    if (req.query.new) {
      console.log(product);
      if (!product.name) {
        product.name = 'New Product';
      }
      pool.query('INSERT INTO products (name, skill_id, data) VALUES ($1, $2, $3) RETURNING id', [product.name, product.skill, product.data], (err, results) => {
        res.status(200).send({ id: results.rows[0].id });
      });
    } else {
      pool.query('UPDATE products SET data = $1 WHERE id = $2', [product.data, product.id], (err, results) => {
        res.sendStatus(200);
      });
    }
  } catch (e) {
    console.error(e);
    console.trace();
    res.sendStatus(500);
  }
}

exports.deleteProduct = async (req, res) => {
  if (!req.params.sid || !req.params.pid) {
    res.sendStatus(401);
    return;
  }

  let sid = hashids.decode(req.params.sid)[0];
  let pid = req.params.pid;

  try {
    let result = await pool.query('SELECT creator_id FROM skills WHERE skill_id = $1 LIMIT 1', [sid])

    if (result.rows.length > 0 && result.rows[0].creator_id !== req.user.id && req.user.admin !== 10) {
      return res.sendStatus(403)
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(500)
  }

  try {
    pool.query('DELETE FROM products WHERE id = $1', [pid], (err, results) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  } catch (e) {
    console.error(e);
    console.trace();
    res.sendStatus(500);
  }
}

exports.deleteSkill = (req, res) => {
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
        Key: { 'id': diagram_id }
      }

      docClient.delete(params, async (err) => {
        if (err) {
          console.log(err)
        } else {
          // Delete diagram from our tables
          pool.query('DELETE FROM diagrams WHERE id = $1', [diagram_id], (err) => {
            if (err) {
              console.log(err)
            }
          })
        }
      })
    })
  }

  let id = hashids.decode(req.params.id)[0];
  pool.query("SELECT * FROM skills WHERE creator_id = $1 AND skill_id = $2", [req.user.id, id], (err, results) => {
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
          .then(response => {
            // Successfully deleted
          })
          .catch(err => {
            console.log(err)
          })
      })
    }

    // Delete skill off our servers
    pool.query('DELETE FROM skills WHERE creator_id = $1 AND skill_id = $2', [req.user.id, id], (err) => {
      if (err) {
        res.sendStatus(500)
      } else {
        res.sendStatus(200)
      }
    })

    // Delete diagrams recursively
    deleteDiagrams(results.rows[0].diagram)
  });
}

exports.patchSkill = (req, res) => {
  if (!req.user || !req.params.id || !req.body) {
    res.sendStatus(401);
    return;
  }

  let id = hashids.decode(req.params.id)[0];
  let b = req.body;

  if (!b.locales) {
    b.locales = '["en-US"]';
  } else if (Array.isArray(b.locales)) {
    b.locales = JSON.stringify(b.locales)
  }

  if (req.query.settings) {
    pool.query(`UPDATE skills SET name = $3, restart = $4, resume_prompt = $5, error_prompt = $6 WHERE skill_id = $1 AND creator_id = $2`,
      [id, req.user.id, b.name, b.restart, b.resume_prompt, b.error_prompt], (err) => {
        if (err) {
          res.sendStatus(500)
        } else {
          latestSkillToIntercom(req.user.id, b.name)
          res.sendStatus(200)
        }
      })
    return
  } else if (req.query.intents) {
    pool.query(`
            UPDATE skills
            SET
            intents = $2,
            slots = $3
            WHERE skill_id = $1 AND creator_id = $4`,
      [id, b.intents, b.slots, req.user.id], (err) => {
        if (err) {
          console.log(err);
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
        { value: b.invocations }, b.small_icon, b.large_icon, b.category,
        b.purchase, b.personal, b.copa, b.ads, b.export, b.instructions, b.locales,
        b.privacy_policy, b.terms_and_cond, req.user.id], (err) => {
          if (err) {
            console.log(err);
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
          console.error(err);
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
        { value: b.invocations }, b.small_icon, b.large_icon, b.category, b.locales,
        b.privacy_policy, b.terms_and_cond, req.user.id], (err) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            latestSkillToIntercom(req.user.id, b.name)
            res.sendStatus(200);
          }
        })
  }
}

// Helper Function
const getSkillPermissions = (skill_id) => new Promise((resolve, reject) => {
  let sql = `SELECT d.permissions FROM diagrams d WHERE d.skill_id = $1`
  pool.query(sql, [skill_id], (err, data) => {
    if (err) {
      console.error(err);
      console.trace();
      reject(new Error(err))
    } else {
      resolve(data.rows);
    }
  });
})

exports.buildSkill = async (req, res) => {
  if (!req.params.id) {
    res.sendStatus(401)
  }
  incrementTimesPublishedIntercom(req.user.id);

  let id = hashids.decode(req.params.id)[0];
  let original_id = req.params.id

  // Get permissions
  const permissions_arr = await getSkillPermissions(id)
  let permissions = new Set()

  permissions_arr.forEach(r => {
    r.permissions.forEach((perm => {
      if (perm !== 'payments:autopay_consent') {
        // lmao amazon engineering
        permissions.add(perm)
      }
    }))
  })

  permissions = Array.from(permissions).map(perm => { return { name: perm } })

  AccessToken(req.user.id, token => {
    if (token === null) {
      res.status(401).send({
        message: "Invalid Amazon Login Token"
      });
      return;
    }

    pool.query('SELECT * FROM skills WHERE skills.skill_id = $1 LIMIT 1', [id], async (err, data) => {
      if (err) {
        console.error(err)
        res.sendStatus(500)
      } else {

        let r = data.rows[0]

        let amzn_id = r.amzn_id
        r.permissions = permissions
        let manifest = JSONs.manifest(r, original_id, req.user.name)

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

          let vendor_request = await axios.request({
            url: 'https://api.amazonalexa.com/v1/vendors',
            method: 'GET',
            headers: {
              Authorization: token
            }
          });

          let vendors = vendor_request.data.vendors;
          let vendorId = null
          if (Array.isArray(vendors) && vendors.length !== 0) {
            vendorId = vendors[0].id;
          } else {
            throw ({
              type: "VendorIdError",
              data: JSON.stringify(vendor_request.data)
            });
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

            let request = await axios.request({
              url: `https://api.amazonalexa.com/v1/skills/${encodeURI(amzn_id)}/stages/development/manifest`,
              method: 'PUT',
              headers: {
                Authorization: token
              },
              data: manifest
            });
          }

          let results = await pool.query("SELECT * FROM products WHERE skill_id = $1", [r.skill_id]);

          results.rows.forEach(row => {
            let product = row.data;
            let productId = row.amzn_prod_id;

            if (productId) {
              axios.request({
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
                .catch(err => {
                  res.status(500).send(err.response.data)
                });
            } else {
              axios.request({
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
                .then(response => {
                  pool.query("UPDATE products SET amzn_prod_id = $1 WHERE skill_id = $2", [response.data.productId, r.skill_id]);
                  axios.request({
                    url: `https://api.amazonalexa.com/v1/inSkillProducts/${productId}/skills/${amzn_id}`,
                    method: 'PUT',
                    headers: {
                      Authorization: token
                    }
                  })
                    .catch(err => {
                      res.status(500).send(err.response.data)
                    });
                })
                .catch(err => {
                  res.status(500).send(err.response.data)
                });
            }
          });

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
                  .then(() => {
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
                              res.send(amzn_id)
                            }
                          })
                          .catch(err => {
                            console.log(err.response.status)
                            res.status(500).send(err.response.data)
                          });
                      }, 10000)
                    }
                    getSkillStatus(0)
                  })
                  .catch(err => {
                    console.log(err.response)
                    if (err.response) {
                      if (err.response.status === 404) {
                        iterate(depth + 1)
                      } else {
                        console.error(err.response.data)
                        res.status(500).send(err.response.data)
                      }
                    } else {
                      console.log(err)
                      res.sendStatus(500)
                    }
                  })
              }, 5000)
            }
          }

          iterate(0);

        } catch (err) {
          if (err.type === "VendorIdError") {
            // console.error(err);
            res.sendStatus(403);
          } else {
            if (err.response) {
              // console.error(err.response.status);
              console.error(JSON.stringify(err.response.data));
              res.status(500).send(err.response.data);
            } else {
              console.error(err);
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
                .then(response => {
                  pool.query(`
                                UPDATE skills
                                SET
                                review = TRUE
                                WHERE amzn_id = $1`,
                    [req.params.amzn_id],
                    (err) => {
                      if (err) {
                        console.log(err);
                        res.sendStatus(500);
                      } else {
                        res.sendStatus(200);
                      }
                    }
                  );
                })
                .catch(err => {
                  console.log(err);
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
          [req.params.amzn_id, 0],
          (err) => {
            if (err) {
              console.log(err);
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
      console.log(err);
      res.sendStatus(500)
    } else {
      // let new_product_id = data.rows[0].id
      data.rows[0].skill_id = hashids.encode(data.rows[0].skill_id)
      res.send(data.rows[0])
    }
  })
}

exports.copySkill = async (req, res, append_copy_str=true, copying_default_template=false, complete_copy=false, cb=false) => {
  let id = hashids.decode(req.params.id)[0]
  let new_creator_id = req.params.target_creator
  let diagram_mapping = {}
  let diagram_names = {}
  let sub_diagrams = {}

  if (new_creator_id === 'me') {
    new_creator_id = req.user.id
  }

  const remapDiagramIds = (diagram, new_skill_id) => {
    diagram.id = diagram_mapping[diagram.id]
    diagram.skill = new_skill_id
    sub_diagrams[diagram.id] = []

    let JSON_diagram_data = JSON.parse(diagram.data)
    let nodes = JSON_diagram_data.nodes
    if (!!nodes) {
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        if (node.extras.diagram_id && node.extras.diagram_id !== null) {
          // If this diagram id hasn't been seen yet, create a new mapping for it and recursively call remapping
          if (!diagram_mapping[node.extras.diagram_id]) {
            diagram_mapping[node.extras.diagram_id] = generateID()
            retrieveDiagram(node.extras.diagram_id, new_skill_id)
          }
          node.extras.diagram_id = diagram_mapping[node.extras.diagram_id]
          sub_diagrams[diagram.id].push(node.extras.diagram_id)
        }
      }
    }
    diagram.data = JSON.stringify(JSON_diagram_data)
    return diagram
  }

  const uploadNewDiagram = (remapped_diagram, old_diagram_id, new_skill_id) => {
    let params = {
      TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
      Item: {
        id: remapped_diagram.id,
        variables: remapped_diagram.variables,
        data: remapped_diagram.data,
        skill: remapped_diagram.skill,
        creator: new_creator_id
      }
    }

    // Called if SQL insert fails
    const cleanUpDynamo = (new_diagram_id) => {
      let clean_up_params = {
        TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
        Key: { 'id': new_diagram_id }
      };
      docClient.delete(clean_up_params, err => {
        if (err) {
          console.log(err)
          res.sendStatus(err.statusCode)
        }
      });
    }

    const insertDiagramRow = (new_diagram_id, old_diagram_id) => {
      let diagram_name = diagram_names[old_diagram_id]

      pool.query(
        `INSERT INTO diagrams (id, name, skill_id, sub_diagrams, permissions, used_intents)
                (SELECT $1, $2, $3, $4, permissions, used_intents FROM diagrams WHERE id = $5)`,
        [new_diagram_id, diagram_name, new_skill_id, JSON.stringify(sub_diagrams[new_diagram_id]), old_diagram_id],
        (err) => {
          if (err) {
            console.log(err)
            cleanUpDynamo(new_diagram_id)
            res.sendStatus(500)
          }
        }
      )
    }

    docClient.put(params, async (err) => {
      if (err) {
        console.log(err)
        res.sendStatus(err.statusCode)
      } else {
        insertDiagramRow(remapped_diagram.id, old_diagram_id)
      }
    });
  }

  const retrieveDiagram = (diagram_id, new_skill_id) => {
    let get_params = {
      TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
      Key: { 'id': diagram_id }
    }

    docClient.get(get_params, (err, data) => {
      if (err) {
        console.log(err)
        res.sendStatus(err.statusCode)
      } else if (data.Item) {
        let remapped_diagram = remapDiagramIds(data.Item, new_skill_id)
        uploadNewDiagram(remapped_diagram, diagram_id, new_skill_id)
      }
    })
  }

  // Starts here: verify that the skill is under the current creator
  if (!copying_default_template) {
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

  pool.query('SELECT * FROM diagrams WHERE skill_id = $1', [id], (err, data) => {
    let root_diagram_id
    for (let i = 0; i < data.rows.length; i++) {
      diagram_names[data.rows[i].id] = data.rows[i].name

      if (data.rows[i].name === 'ROOT') {
        root_diagram_id = data.rows[i].id
        diagram_mapping[root_diagram_id] = generateID()
      }
    }

    // Create copy of the skill (monkeyBananas code incoming ;)
    let copy_str = (append_copy_str ? `coalesce(name, '') || ' Copy' AS name, ` : 'name, ')
    let copy_query
    if (complete_copy) {
      copy_query = `
            INSERT INTO skills (
                name,
                diagram,
                creator_id,
                created,
                amzn_id,
                summary,
                description,
                keywords,
                invocations,
                small_icon,
                large_icon,
                category,
                purchase,
                personal,
                copa,
                ads,
                export,
                instructions,
                inv_name,
                stage,
                review,
                live,
                locales,
                restart,
                global,
                privacy_policy,
                terms_and_cond,
                intents,
                slots,
                used_intents,
                used_choices,
                preview,
                resume_prompt,
                error_prompt,
                account_linking,
                access_token_variable,
                fulfillment
            )
            SELECT `
        + copy_str + `
                $1 AS diagram,
                $2 AS creator_id,
                created,
                amzn_id,
                summary,
                description,
                keywords,
                invocations,
                small_icon,
                large_icon,
                category,
                purchase,
                personal,
                copa,
                ads,
                export,
                instructions,
                inv_name,
                stage,
                review,
                live,
                locales,
                restart,
                global,
                privacy_policy,
                terms_and_cond,
                intents,
                slots,
                used_intents,
                used_choices,
                preview,
                resume_prompt,
                error_prompt,
                account_linking,
                access_token_variable,
                fulfillment
            FROM skills WHERE skill_id = $3 RETURNING *`
    } else {
      copy_query = `
            INSERT INTO skills (
                name,
                diagram,
                creator_id,
                summary,
                description,
                keywords,
                invocations,
                small_icon,
                large_icon,
                category,
                purchase,
                personal,
                copa,
                ads,
                export,
                instructions,
                inv_name,
                locales,
                restart,
                global,
                privacy_policy,
                terms_and_cond,
                intents,
                slots,
                used_intents,
                used_choices,
                resume_prompt,
                error_prompt
            )
            SELECT `
        + copy_str + `
                $1 AS diagram,
                $2 AS creator_id,
                summary,
                description,
                keywords,
                invocations,
                small_icon,
                large_icon,
                category,
                purchase,
                personal,
                copa,
                ads,
                export,
                instructions,
                inv_name,
                locales,
                restart,
                global,
                privacy_policy,
                terms_and_cond,
                intents,
                slots,
                used_intents,
                used_choices,
                resume_prompt,
                error_prompt
            FROM skills WHERE skill_id = $3 RETURNING *`
    }
    pool.query(
      copy_query, [diagram_mapping[root_diagram_id], new_creator_id, id],
      (err, data) => {
        if (err) {
          console.log(err)
          res.sendStatus(500)
        } else {
          let new_skill_id = data.rows[0].skill_id
          retrieveDiagram(root_diagram_id, new_skill_id)
          data.rows[0].skill_id = hashids.encode(data.rows[0].skill_id)

          // Default name of cb when no callback provided is 'next'
          if (cb && cb.name !== 'next') {
            cb(data.rows[0])
          } else {
            res.send(data.rows[0])
          }
        }
      }
    )
  })
}