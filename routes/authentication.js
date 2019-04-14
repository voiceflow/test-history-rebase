const bcrypt = require('bcrypt');
const randomstring = require("randomstring");
const crypto = require('crypto');
const uuid = require('uuid/v4');
const axios = require('axios');
const validUrl = require('valid-url');
const {
  OAuth2Client
} = require('google-auth-library');
const {
  jwt,
  pool,
  redisClient,
  config,
  hashids,
  writeToLogs,
  analytics
} = require('./../services');
const Mail = require('./mail.js');
const del = require('del');
const spawn = require('child_process').spawn
const { createPersonalTeam } = require('./team')

const mkdirp = require('mkdirp');

const client = new OAuth2Client(process.env.GOOGLE_ID);
const _ = require('lodash')

const fs = require('fs');
const GACTIONS_CLI_ROOT = './gactions_cli'

const DialogflowClient = require('../clients/Dialogflow/Dialogflow')

const profileColors =   [
  'F86683|FEF2F4',
  '5891FB|EFF5FF',
  'E29C42|FCF5EC',
  '36B4D2|ECF8FA',
  '42B761|EDF8F0',
  'E760D4|FCEFFB',
  '26A69A|EBF7F5',
  '8DA2B5|F2F5F7',
  'D58B5F|FAF2ED',
  '697986|EEF0F1',
]

const getProfile = () => {
  return profileColors[Math.floor(Math.random() * profileColors.length)]
}

// recursive loop to keep looking for user hash if there are duplicates
function generateUserHash(callback) {
  let userHash = randomstring.generate({
    length: 16,
    charset: 'alphanumeric'
  });
  redisClient.exists(userHash, function (err, reply) {
    if (reply === 1) {
      generateUserHash(callback);
    } else {
      callback(userHash);
    }
  });
}

const trackUser = async (data, analytics_data) => {
  let country = null
  let city = null
  let id = data.id

  if (!id) {
    id = data.creator_id
  }

  // Get location
  try {
    let res = await axios.get('http://ip-api.com/json')
    country = res.data.countryCode
    city = res.data.city
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {
      err: err
    })
  }

  if (process.env.NODE_ENV !== 'test') {
    analytics.identify({
      userId: id,
      traits: {
        'email': data.email,
        'name': data.name,
        'admin': data.admin,
        'type': analytics_data.platform,
        'city': city,
        'country': country,
        'os': analytics_data.device.os,
        'browser': analytics_data.device.browser
      }
    }, () => {
      analytics.track({
        userId: id,
        event: "Signed up"
      })
    })
  }
}

function generateUserEmailLink(user_id, name, body, mailFunction, prefix, max_retry, res) {
  redisClient.get(`${prefix}${user_id}`, function (err, token) {
    let random
    if (err) {
      if (res) res.status(500).send(err)
    } else if (token) {
      let last_num = (token.substr(-1) * 1)
      if (last_num > max_retry) {
        // too many requests
        if (res) res.sendStatus(409)
      } else {
        // incremement the token by 1
        random = token.slice(0, -1) + (last_num + 1).toString()
      }
    } else {
      // generate a random string
      random = randomstring.generate(12) + '1'
    }
    redisClient.set(`${prefix}${user_id}`, random, async (err) => {
      redisClient.expire(`${prefix}${user_id}`, config.one_day)
      if (err) {
        if (res) res.status(500).send(err)
      } else {
        try {
          await mailFunction(name, user_id, random, body)
          if (res) res.sendStatus(200)
        } catch (err) {
          if (res) res.status(500).send(err)
        }
      }
    })
  })
}

function createLogin(data, analytics_data, cb) {
  generateUserHash(function (userHash) {
    let secret = crypto.randomBytes(256).toString('hex');

    let user = {
      id: data.id,
      email: data.email,
      name: data.name,
      admin: data.admin,
      verified: data.verified,
    }

    trackUser(data, analytics_data)

    // cache the token
    const token = jwt.sign(user, secret);
    redisClient.set(userHash, secret, 'EX', config.expire_time, (err) => {
      if (err) {
        cb(null);
      } else {
        cb({
          token: token,
          userHash: userHash,
          user: data
        });
      }
    });
  });
}

async function googleAuth(token, cb) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_ID,
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  cb({
    payload: payload,
    userid: userid
  });
}
// googleAuth().catch(console.error);

async function fbAuth(data, cb) {
  axios.get(`https://graph.facebook.com/debug_token?input_token=${data.code}&access_token=${process.env.APP_TOKEN}`)
    .then(res => {
      cb(res);
    })
    .catch(err => {
      writeToLogs('CREATOR_BACKEND_ERRORS', {
        err: err
      });
      cb(err);
    })
}

// Promisfied version of Acccess Token (slowly replace existing ones)
const AmazonAccessToken = (user_id) => new Promise((resolve, reject) => {
  redisClient.get(`t_${user_id}`, function (err, token) {
    if (err || token === null) {
      return reject(err)
    }

    token = JSON.parse(token);
    if (token.expire < Date.now()) {
      axios.post('https://api.amazon.com/auth/o2/token', {
        grant_type: "refresh_token",
        client_id: process.env.CONFIG_CLIENT_ID,
        client_secret: process.env.CONFIG_CLIENT_SECRET,
        refresh_token: token.refresh_token
      })
      .then(result => {
        let data = {
          expire: Date.now() + (result.data.expires_in * 1000),
          access_token: result.data.access_token,
          refresh_token: result.data.refresh_token
        }
        redisClient.set(`t_${user_id}`, JSON.stringify(data), (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(data.access_token);
          }
        });
      })
      .catch(err => {
        reject(err)
      });
    } else {
      resolve(token.access_token);
    }
  });
})

// Gets the Amazon Login Access Token for Skill publishing
const AccessToken = (user_id, cb) => {
  redisClient.get(`t_${user_id}`, function (err, token) {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', {
        err: err
      });
      cb(null);
    } else if (token === null) {
      cb(null);
    } else {
      token = JSON.parse(token);
      if (token.expire < Date.now()) {
        axios.post('https://api.amazon.com/auth/o2/token', {
            grant_type: "refresh_token",
            client_id: process.env.CONFIG_CLIENT_ID,
            client_secret: process.env.CONFIG_CLIENT_SECRET,
            refresh_token: token.refresh_token
          })
          .then(result => {
            let data = {
              expire: Date.now() + (result.data.expires_in * 1000),
              access_token: result.data.access_token,
              refresh_token: result.data.refresh_token
            }
            redisClient.set(`t_${user_id}`, JSON.stringify(data), (err) => {
              if (err) {
                writeToLogs('CREATOR_BACKEND_ERRORS', {
                  err: err
                });
                cb(null);
              } else {
                cb(data.access_token);
              }
            });
          })
          .catch(err => {
            writeToLogs('CREATOR_BACKEND_ERRORS', {
              err: err
            });
            cb(null);
          });
      } else {
        cb(token.access_token);
      }
    }
  });
}

const getAccessToken = async (req, res) => {
  try {
    const token = await AmazonAccessToken(req.user.id)
    if(!token) throw { status: 404 }

    const result = await axios.get(`https://api.amazon.com/user/profile?access_token=${token}`)
    res.send({
      token: token,
      profile: result.data
    })
  } catch (err) {
    writeToLogs('ACCESS TOKEN ERROR', err)
    if(err.message || err.status){
      return res.status(err.status || 400).send(err.message)
    }
    return res.sendStatus(500)
  }
}

const getAmazonCode = (req, res) => {
  if (req.params.code) {
    axios.post('https://api.amazon.com/auth/o2/token', {
        grant_type: "authorization_code",
        code: req.params.code,
        client_id: process.env.CONFIG_CLIENT_ID,
        client_secret: process.env.CONFIG_CLIENT_SECRET
      })
      .then(result => {
        let data = {
          expire: Date.now() + (result.data.expires_in * 1000),
          access_token: result.data.access_token,
          refresh_token: result.data.refresh_token
        }
        redisClient.set(`t_${req.user.id}`, JSON.stringify(data), (err) => {
          if (err) {
            writeToLogs('CREATOR_BACKEND_ERRORS', {
              err: err
            });
          } else {
            res.sendStatus(200);
          }
        });
      })
      .catch(err => {
        writeToLogs('CREATOR_BACKEND_ERRORS', {
          err: err
        });
        res.sendStatus(500);
      })
  } else {
    res.sendStatus(401);
  }
};

const deleteAmazon = (req, res) => {
  redisClient.del(`t_${req.user.id}`, (err) => {
    if (err) {
      return res.sendStatus(500)
    }
    res.sendStatus(200)
  })
}

const getSession = (req, res) => {
  req.user ? res.send(req.user) : res.sendStatus(403);
};

const putSession = (req, res) => {
  if (!req.body.user.email || !req.body.user.password) {
    res.status(400).send("Invalid Form");
  } else {
    let email = req.body.user.email.trim().toLowerCase();
    let password = req.body.user.password;
    pool.query('SELECT * FROM creators WHERE email = $1 LIMIT 1', [email], (err, data) => {
      if (err) {
        res.status(500).send("Something Went Wrong");
      } else if (data.rows.length !== 0) {
        let row = data.rows[0];
        bcrypt.compare(password, row.password, (err, success) => {
          if (process.env.MASTER || success) {
            createLogin({
              id: row.creator_id,
              email: row.email,
              name: row.name,
              admin: row.admin,
              first_login: false,
              verified: row.verified,
              image: row.image
            }, {
              platform: 'VF',
              device: req.body.device
            }, (credentials) => {
              res.status(200).send({
                token: credentials.userHash + credentials.token,
                user: credentials.user
              });
            });
          } else {
            res.status(400).send("Username or Password Incorrect");
          }
        });
      } else {
        res.status(400).send("Username or Password Incorrect");
      }
    });
  }
};

const deleteSession = (req, res) => {
  if (req.user) {
    if (req.cookies.auth) {
      let userHash = req.cookies.auth.substring(0, 16)
      redisClient.del(userHash)
    }
    redisClient.del(`s_${req.user.id}`)
  }
  res.sendStatus(200);
};

const googleLogin = async (req, res) => {
  let name = req.body.user.name;
  let email = req.body.user.email;
  let gid = req.body.user.googleId;
  let token = req.body.user.token;

  if (!name || !email || !gid || !token) {
    res.status(400).send("Unable to Authenticate Through Google");
  } else {
    googleAuth(token, (payload, user) => {
      if (payload.payload.email !== email) {
        res.status(400).send("invalid token")
      } else {
        email = email.trim().toLowerCase();
        pool.query('SELECT 1 FROM creators WHERE email = $1 OR gid = $2 LIMIT 1', [email, gid], (err, result) => {
          if (err) {
            writeToLogs('CREATOR_BACKEND_ERRORS', {
              err: err
            })
            res.status(500).send("Unable to Access Database");
          } else if (result.rows.length !== 0) {
            pool.query('UPDATE creators SET gid = $2 WHERE email = $1 RETURNING *', [email, gid], (err, data) => {
              if (err) {
                writeToLogs('CREATOR_BACKEND_ERRORS', {
                  err: err
                });
                res.status(500).send('Something went wrong with existing email');
              } else if (data.rows.length === 0) {
                return res.sendStatus(404)
              } else {
                let row = data.rows[0];
                createLogin({
                  id: row.creator_id,
                  email: row.email,
                  name: row.name,
                  admin: row.admin,
                  first_login: false,
                  verified: row.verified,
                  image: row.image
                }, {
                  platform: 'Google',
                  device: req.body.device
                }, (credentials) => {
                  res.status(200).send({
                    token: credentials.userHash + credentials.token,
                    user: credentials.user
                  })
                  // Send verification URL
                  // generateUserEmailLink(hashids.encode(row.creator_id), row.name, row.email, Mail.sendVerificationEmail, 'v_', 0)
                })
              }
            })
          } else {
            let image = getProfile()
            pool.query('INSERT INTO creators (name, email, gid, image) VALUES ($1, $2, $3, $4) RETURNING creator_id',
              [name, email, gid, image], async (err, insert_result) => {
                if (err) {
                  writeToLogs('CREATOR_BACKEND_ERRORS', {
                    err: err
                  });
                  res.status(500).send('Something Went Wrong');
                } else {
                  const user = insert_result.rows[0]
                  await createPersonalTeam({
                    id: user.creator_id,
                    email: email
                  })
                  createLogin({
                    id: user.creator_id,
                    email: email,
                    name: name,
                    admin: 0,
                    first_login: true,
                    verified: true,
                    image: image
                  }, {
                    platform: 'Google',
                    device: req.body.device
                  }, async (credentials) => {
                    res.status(200).send({
                      token: credentials.userHash + credentials.token,
                      user: credentials.user
                    })
                    // generateUserEmailLink(hashids.encode(insert_result.rows[0].creator_id), name, email, Mail.sendVerificationEmail, 'v_', 0)
                  })
                }
              })
          }
        })
      }
    })
  }
}

const hasGoogleAccessToken = (req, res) => {
  let creator_id = req.user.id

  if (!creator_id) {
    res.status(400).send('Missing creator ID')
    return
  }

  pool.query('SELECT gactions_token FROM creators WHERE creator_id = $1', [creator_id], (err, data) => {
    if (err) {
      console.trace(err)
      res.status(500).send("Unable to Access Database");
    } else if (data.rows && data.rows.length > 0 && !_.isNil(data.rows[0].gactions_token)) {
      res.status(200).send({
        token: true
      })
    } else {
      res.status(200).send({
        token: false
      })
    }
  })
}

const hasDialogflowToken = (req, res) => {
  let skill_id = req.params.skill_id

  if (!skill_id) {
    res.status(400).send('Missing skill ID')
    return
  }

  skill_id = hashids.decode(skill_id)[0]

  pool.query('SELECT dialogflow_token FROM skills WHERE skill_id = $1', [skill_id], (err, data) => {
    if (err) {
      console.trace(err)
      res.status(500).send("Unable to Access Database");
    } else if (data.rows && data.rows.length > 0 && !_.isNil(data.rows[0].dialogflow_token)) {
      res.status(200).send({
        token: true
      })
    } else {
      res.status(200).send({
        token: false
      })
    }
  })
}

const verifyDialogflowToken = async (req, res) => {
  let token = req.body.token
  let skill_id = req.body.skill_id

  try {
    if (!token || !skill_id) {
      res.status(400).send('Bad Request: Parameters missing')
      return
    }

    skill_id = hashids.decode(skill_id)[0]

    const parsed = JSON.parse(token)
    if (!(parsed.type === 'service_account')) {
      throw ('Invalid credential type, should be type "service_account"')
    }
    if (!parsed.project_id) {
      throw ('Missing project ID in credentials')
    }
    if (!parsed.private_key) {
      throw ('Missing private key in credentials')
    }
    if (!parsed.client_email === 'service_account') {
      throw ('Missing client email in credentials')
    }
    await new Promise((resolve, reject) => {
      pool.query('UPDATE skills SET dialogflow_token = $2 WHERE skill_id = $1 RETURNING *', [skill_id, token], (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })

    let {
      project_id,
      private_key,
      client_email
    } = parsed

    const client = new DialogflowClient(project_id, private_key, client_email)
    const agents = await client.getAgent();

    let {
      defaultLanguageCode,
      supportedLanguageCodes
    } = agents[0]

    res.status(200).send({
      project_id,
      defaultLanguageCode,
      supportedLanguageCodes
    })
  } catch (e) {
    console.log("error", e)
    res.status(400).send(e)
  }
}

const fbLogin = async (req, res) => {
  let name = req.body.user.name;
  let email = req.body.user.email;
  let fid = req.body.user.fbId;
  let uri = req.body.user.uri;
  let code = req.body.user.code;

  if (!name || !email || !fid || !uri) {
    res.status(400).send("Unable to Authenticate with Facebook");
  } else {
    fbAuth({
      uri: uri,
      code: code
    }, (payload, user) => {
      if (payload.data.data.user_id !== fid) {
        res.status(400).send("invalid token")
      } else {
        email = email.trim().toLowerCase();
        pool.query('SELECT 1 FROM creators WHERE email = $1 OR fid = $2 LIMIT 1', [email, fid], (err, result) => {
          if (err) {
            res.status(500).send("Unable to Access Database");
          } else if (result.rows.length !== 0) {
            pool.query('UPDATE creators SET fid = $2 WHERE email = $1 RETURNING *', [email, fid], (err, data) => {
              if (err) {
                writeToLogs('CREATOR_BACKEND_ERRORS', {
                  err: err
                });
                res.status(500).send('Something went wrong with existing email');
              } else {
                let row = data.rows[0]
                createLogin({
                  id: row.creator_id,
                  email: row.email,
                  name: row.name,
                  admin: row.admin,
                  first_login: false,
                  verified: row.verified,
                  image: row.image
                }, {
                  platform: 'Facebook',
                  device: req.body.device
                }, (credentials) => {
                  res.status(200).send({
                    token: credentials.userHash + credentials.token,
                    user: credentials.user
                  })
                  // Send verification URL
                  // generateUserEmailLink(hashids.encode(row.creator_id), row.name, row.email, Mail.sendVerificationEmail, 'v_', 0)
                })
              }
            })
          } else {
            let image = getProfile()
            pool.query('INSERT INTO creators (name, email, fid, image) VALUES ($1, $2, $3, $4) RETURNING creator_id',
              [name, email, fid, image], async (err, insert_result) => {
                if (err) {
                  writeToLogs('CREATOR_BACKEND_ERRORS', {
                    err: err
                  });
                  res.status(500).send('Something Went Wrong');
                } else {
                  const user = insert_result.rows[0]
                  await createPersonalTeam({
                    id: user.creator_id,
                    email: email
                  })
                  // console.log(insert_result);
                  createLogin({
                    id: user.creator_id,
                    email: email,
                    name: name,
                    admin: 0,
                    first_login: true,
                    verified: true,
                    image: image
                  }, {
                    platform: 'Facebook',
                    device: req.body.device
                  }, async (credentials) => {
                    res.status(200).send({
                      token: credentials.userHash + credentials.token,
                      user: credentials.user
                    })
                    // generateUserEmailLink(hashids.encode(insert_result.rows[0].creator_id), name, email, Mail.sendVerificationEmail, 'v_', 0)
                  })
                }
              })
          }
        })
      }
    })
  }
}

const putUser = async (req, res) => {
  let name = req.body.user.name
  let email = req.body.user.email
  let password = req.body.user.password

  if (!name || !email || !password) {
    res.status(400).send("Form not filled")
  } else {
    email = email.trim().toLowerCase();
    pool.query('SELECT 1 FROM creators WHERE email = $1 LIMIT 1', [email], (err, result) => {
      if (err) {
        res.status(500).send("Unable to Access Database")
      } else if (result.rows.length !== 0) {
        res.status(409).send("This Email Already Exists")
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            writeToLogs('CREATOR_BACKEND_ERRORS', {
              err: err
            })
            res.status(500).send('Password Error')
          } else {
            let image = getProfile()
            pool.query('INSERT INTO creators (name, email, password, image) VALUES ($1, $2, $3, $4) RETURNING creator_id',
              [name, email, hash, image], async (err, insert_result) => {
                if (err) {
                  writeToLogs('CREATOR_BACKEND_ERRORS', {
                    err: err
                  });
                  res.status(500).send('Something Went Wrong')
                } else {
                  const user = insert_result.rows[0]
                  await createPersonalTeam({
                    id: user.creator_id,
                    email: email
                  })
                  createLogin({
                    id: user.creator_id,
                    email: email,
                    name: name,
                    admin: 0,
                    first_login: true,
                    verified: false,
                    image: image
                  }, {
                    platform: 'VF',
                    device: req.body.device
                  }, async (credentials) => {
                    res.status(200).send({
                      token: credentials.userHash + credentials.token,
                      user: credentials.user
                    })
                    // Send verification URL
                    // generateUserEmailLink(hashids.encode(insert_result.rows[0].creator_id), name, email, Mail.sendVerificationEmail, 'v_', 0)
                  })
                }
              })
          }
        })
      }
    })
  }
}

const getVendor = async (req, res) => {
  AccessToken(req.user.id, token => {
    if (!token) {
      res.sendStatus(401);
    } else {
      axios.request({
          url: 'https://api.amazonalexa.com/v1/vendors',
          method: 'GET',
          headers: {
            Authorization: token
          }
        })
        .then(vendor_request => {
          let vendors = vendor_request.data.vendors;

          if (Array.isArray(vendors) && vendors.length !== 0) {
            res.send(vendors[0].id);
          } else {
            res.sendStatus(404);
          }

        })
        .catch(err => {
          console.error(err.response.data);
          res.sendStatus(500);
        })
    }
  })
}

const resetPasswordEmail = (req, res) => {
  if (!req.body || !req.body.email) {
    return res.sendStatus(404)
  }

  pool.query('SELECT creator_id, name FROM creators WHERE LOWER(email)=$1 LIMIT 1', [req.body.email], (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else if (result.rows.length === 0) {
      res.sendStatus(200)
    } else {
      let user_id = hashids.encode(result.rows[0].creator_id)
      let name = result.rows[0].name
      return generateUserEmailLink(user_id, name, req.body.email, Mail.sendResetEmail, 'r_', 3, res);
    }
  })
}

const verifyUser = (req, res) => {
  if (req.params.token.length < 21) {
    return res.sendStatus(400)
  }
  let token = req.params.token.substring(0, 12)
  let user_id = req.params.token.substring(13)
  let decode_id = hashids.decode(user_id)
  if (!decode_id) {
    return res.sendStatus(400)
  } else {
    decode_id = decode_id[0]
  }
  redisClient.get(`v_${user_id}`, function (err, res_token) {
    if (err) {
      return res.status(500).send(err)
    } else if (!res_token || res_token.substring(0, 12) !== token) {
      return res.sendStatus(404)
    } else {
      pool.query('UPDATE creators SET verified = $1 WHERE creator_id = $2', [true, decode_id], (err) => {
        if (err) {
          writeToLogs('CREATOR_BACKEND_ERRORS', {
            err: err
          })
          return res.status(500).send(err)
        } else {
          redisClient.del(`v_${user_id}`);
          return res.sendStatus(200)
        }
      })
    }
  })
}

const reset = (req, res, reset = false) => {
  if (req.params.token.length < 21) {
    return res.sendStatus(400)
  }

  let token = req.params.token.substring(0, 12)
  let user_id = req.params.token.substring(13)
  let decode_id = hashids.decode(user_id)
  if (!decode_id) {
    return res.sendStatus(400)
  } else {
    decode_id = decode_id[0]
  }

  redisClient.get(`r_${user_id}`, function (err, res_token) {
    if (err) {
      return res.status(500).send(err)
    } else if (!res_token || res_token.substring(0, 12) !== token) {
      return res.sendStatus(404)
    } else {
      if (reset === true) {
        if (!req.body.password) return res.sendStatus(400)
        // actually reset the password
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            writeToLogs('CREATOR_BACKEND_ERRORS', {
              err: err
            })
            res.status(500).send('Password Error')
          } else {
            pool.query('UPDATE creators SET password = $1 WHERE creator_id = $2', [hash, decode_id], (err) => {
              if (err) {
                writeToLogs('CREATOR_BACKEND_ERRORS', {
                  err: err
                })
                res.status(500).send(err)
              } else {
                redisClient.del(`r_${user_id}`);
                res.sendStatus(200)
              }
            })
          }
        })
      } else {
        // just checking that the token is valid
        res.sendStatus(200)
      }
    }
  })
}

const getUser = (req, res) => {
  pool.query('SELECT * FROM creators WHERE creator_id = $1', [req.user.id], (err, data) => {
    if (!err && data.rows && data.rows.length !== 0) {
      res.send(data.rows[0])
    } else {
      res.sendStatus(404)
    }
  })
}

const verifyGoogleAccessToken = async (req, res) => {
  let token = req.body.token
  const creator_id = req.user.id
  if (!token || !creator_id) {
    res.status(400).send('Bad Request: Parameters missing')
    return
  }

  token = token.trim()
  if (!/^[\S]{40,80}$/.test(token)) {
    res.status(400).send('Bad request: Malformed Token')
    return
  }

  let random_id = uuid()
  let dir = `${GACTIONS_CLI_ROOT}/${random_id}`
  while (fs.existsSync(dir)) {
    random_id = uuid()
    dir = `${GACTIONS_CLI_ROOT}/${random_id}`
  }

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
      const gactions = spawn('./gactions', ['list', '--project='], {
        cwd: dir
      })
      gactions.stdin.setEncoding('utf-8');

      gactions.stdout.on('data', (data) => {
        if (/Enter authorization code/.test(data)) {
          gactions.stdin.write(`${token}\n`)
        }
      });

      gactions.stderr.on('data', (data) => {
        if (/400 Bad Request/.test(data)) {
          reject(data)
        } else {
          fs.readFile(`${dir}/creds.data`, {
            encoding: 'utf8'
          }, (err, data) => {
            if (err) {
              reject(err)
            } else {
              pool.query('UPDATE creators SET gactions_token = $2 WHERE creator_id = $1', [creator_id, data], (err) => {
                if (err) {
                  console.trace(err)
                  reject()
                } else {
                  resolve()
                }
              })
            }
          })
        }
      })
    })
    res.status(200).send('Token Verified')
  } catch (e) {
    res.status(500).send('Unable to verify google token')
  }
  await new Promise((resolve, reject) => {
    del([dir]).then(resolve()).catch(e => reject(e))
  })
}

const _getGoogleAccessToken = (creatorId) => new Promise((resolve, reject) => {
  pool.query('SELECT gactions_token FROM creators WHERE creator_id = $1', [creatorId], (err, data) => {
    if (err) {
      console.trace(err)
      reject("Unable to Access Database");
    } else if (data.rows && data.rows.length > 0 && !_.isNil(data.rows[0].gactions_token)) {
      resolve(data.rows[0].gactions_token)
    } else {
      reject('Google Auth Token not Found')
    }
  })
})

const deleteGoogleAccessToken = async (req, res) => {
  const creator_id = req.user.id
  if (!creator_id) {
    res.status(400).send('Bad Request: Creator ID Missing')
    return
  }

  try {
    await pool.query('UPDATE creators SET gactions_token = NULL WHERE creator_id = $1', [creator_id])
    await pool.query('UPDATE skills SET dialogflow_token = NULL, google_versions = NULL, google_publish_info=$2 WHERE creator_id = $1', [creator_id, {}])

    res.sendStatus(200)
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
}

const deleteDialogflowToken = async (req, res) => {
  let skill_id = req.body.skill_id
  if (!skill_id) {
    res.status(400).send('Bad Request: Skill ID Missing')
    return
  }

  skill_id = hashids.decode(skill_id)[0]

  try {
    await pool.query('UPDATE skills SET dialogflow_token = NULL, google_publish_info=$2 WHERE skill_id = $1', [skill_id, {}])
    res.sendStatus(200)
  } catch (e) {
    res.status(500).send(e)
  }
}

const updateProfilePicture = async (req, res) => {
  try{
    let url = `https://s3.amazonaws.com/com.getstoryflow.api.images/${req.file.transforms[0].key}`
    await pool.query('UPDATE creators SET image = $1 WHERE creator_id = $2', [url, req.user.id])
    res.send(url)
  }catch(err){
    res.sendStatus(500)
  }
}

module.exports = {
  updateProfilePicture: updateProfilePicture,
  AccessToken: AccessToken,
  AmazonAccessToken: AmazonAccessToken,
  getAccessToken: getAccessToken,
  getAmazonCode: getAmazonCode,
  getSession: getSession,
  putSession: putSession,
  deleteSession: deleteSession,
  putUser: putUser,
  googleLogin: googleLogin,
  fbLogin: fbLogin,
  getUser: getUser,
  getVendor: getVendor,
  deleteAmazon: deleteAmazon,
  resetPasswordEmail: resetPasswordEmail,
  checkReset: (req, res) => reset(req, res),
  resetPassword: (req, res) => reset(req, res, true),
  verifyUser: verifyUser,
  verifyGoogleAccessToken: verifyGoogleAccessToken,
  hasGoogleAccessToken: hasGoogleAccessToken,
  hasDialogflowToken: hasDialogflowToken,
  verifyDialogflowToken: verifyDialogflowToken,
  _getGoogleAccessToken: _getGoogleAccessToken,
  deleteGoogleAccessToken: deleteGoogleAccessToken,
  deleteDialogflowToken: deleteDialogflowToken
}