const bcrypt = require('bcrypt');
const randomstring = require("randomstring");
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const {jwt, docClient, pool, redisClient, config, hashids} = require('./../services');
const Codes = require('./../config/codes');
const Mail = require('./mail.js');
const { getEnvVariable } = require('../util')

const client = new OAuth2Client(getEnvVariable('GOOGLE_ID'));

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

function generateUserEmailLink(user_id, name, body, mailFunction, prefix, max_retry, res) {
  redisClient.get(`${prefix}${user_id}`, function(err, token) {
    let random
    if(err){
			if(res)	res.status(500).send(err)
    }else if(token){
      let last_num = (token.substr(-1)*1)
      if(last_num > max_retry){
        // too many requests
        if(res)	res.sendStatus(409)
      }else{
        // incremement the token by 1
        random = token.slice(0, -1) + (last_num + 1).toString()
      }
    }else{
      // generate a random string
      random = randomstring.generate(12) + '1'
    }
    redisClient.set(`${prefix}${user_id}`, random, async (err) => {
        redisClient.expire(`${prefix}${user_id}`, config.one_day)
        if (err) {
					if(res)	res.status(500).send(err)
        } else {
          try{
              await mailFunction(name, user_id, random, body)
              if(res)	res.sendStatus(200)
          }catch(err){
            if(res)	res.status(500).send(err)
          }
        }
    })
  })
}

function createLogin(data, cb) {
	generateUserHash(function(userHash){
        let secret = crypto.randomBytes(256).toString('hex');

        let user = {
        	id: data.id,
            email: data.email,
            name: data.name,
            admin: data.admin,
            first_login: data.first_login,
            verified: data.verified,
      	}
        // cache the token
        const token = jwt.sign(user, secret);
        redisClient.set([userHash, secret], function (err, response) {
        	redisClient.expire(userHash, config.expire_time);
	        if (err) {
	            cb(null);
	        } else {
	          	cb({
	          		token: token,
                    userHash: userHash,
                    user: user
	          	});
	        }
        });
	  });
}

async function googleAuth(token, cb) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: getEnvVariable('GOOGLE_ID'),
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  cb({payload: payload, userid: userid});
}
// googleAuth().catch(console.error);

async function fbAuth(data, cb) {
  axios.get(`https://graph.facebook.com/debug_token?input_token=${data.code}&access_token=${getEnvVariable('APP_TOKEN')}`)
  .then(res => {
    cb(res);
  })
  .catch(err => {
    console.log(err);
    cb(err);
  })
}

// Gets the Amazon Login Access Token for Skill publishing
const AccessToken = (user_id, cb) => {
	redisClient.get(`t_${user_id}`, function(err, token) {
		if(err){
			console.error(err);
			cb(null);
		}else if(token === null){
			cb(null);
		}else{
			token = JSON.parse(token);
			if(token.expire < Date.now()){
				axios.post('https://api.amazon.com/auth/o2/token', {
					grant_type: "refresh_token",
					client_id: getEnvVariable('CONFIG_CLIENT_ID'),
					client_secret: getEnvVariable('CONFIG_CLIENT_SECRET'),
					refresh_token: token.refresh_token
				})
				.then(result => {
		    		let data = {
		    			expire: Date.now() + (result.data.expires_in * 1000),
		    			access_token: result.data.access_token,
		    			refresh_token: result.data.refresh_token
		    		}
		    		redisClient.set(`t_${user_id}`, JSON.stringify(data), (err) => {
		    			if(err){
		    				console.error(err);
		    				cb(null);
		    			}else{
		    				cb(data.access_token);
		    			}
		    		});
				})
				.catch(err => {
					console.error(err);
					cb(null);
				});
			}else{
				cb(token.access_token);
			}
		}
	});
}

const hasAccessToken = (req, res) => {
	AccessToken(req.user.id, token => {
		if(token === null){
			res.sendStatus(404);
		}else{
			res.sendStatus(200);
		}
	})
}

const getAmazonCode = (req, res) => {
    if(req.params.code){
    	axios.post('https://api.amazon.com/auth/o2/token', {
    		grant_type: "authorization_code",
    		code: req.params.code,
			client_id: getEnvVariable('CONFIG_CLIENT_ID'),
			client_secret: getEnvVariable('CONFIG_CLIENT_SECRET')
    	})
    	.then(result => {
    		let data = {
    			expire: Date.now() + (result.data.expires_in * 1000),
    			access_token: result.data.access_token,
    			refresh_token: result.data.refresh_token
    		}
    		redisClient.set(`t_${req.user.id}`, JSON.stringify(data), (err) => {
    			if(err){
    				console.error(err);
    			}else{
    				res.sendStatus(200);
    			}
    		});
    	})
    	.catch(err => {
    		console.error(err);
    		res.sendStatus(500);
    	})
    }else{
    	res.sendStatus(401);
    }
};

const deleteAmazon = (req, res) => {
	redisClient.del(`t_${req.user.id}`, (err) => {
		if(err){
			return res.sendStatus(500)
		}
		res.sendStatus(200)
	})
}

const getSession = (req, res) => {
    req.user ? res.send(req.user) : res.sendStatus(403);
};

const putSession = (req, res) => {
	if(!req.body.email || !req.body.password){
		res.status(400).send("Invalid Form");
	}else{
	    let email = req.body.email.trim().toLowerCase();
	    let password = req.body.password;
	    pool.query('SELECT * FROM creators WHERE email = $1 LIMIT 1', [email], (err, data) => {
	        if (err) {
	            res.status(500).send("Something Went Wrong");
	        }else if (data.rows.length !== 0) {
	        	let row = data.rows[0];
	            bcrypt.compare(password, row.password, (err, success) => {
	                if (process.env.MASTER || success ) {
	                	createLogin({
	                		id: row.creator_id,
	                		email: row.email,
	                		name: row.name,
	                		admin: row.admin,
                      first_login: false,
                      verified: row.verified,
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
	if(req.cookies.auth){
		let userHash = req.cookies.auth.substring(0, 16);
    	redisClient.del(userHash);
	}
    res.sendStatus(200);
};

const googleLogin = async(req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let gid = req.body.googleId;
    let token = req.body.token;

    if (!name || !email || !gid || !token) {
      res.status(400).send("Unable to Authenticate Through Google");
    } else {
      googleAuth(token, (payload, user) => {
        if (payload.payload.email !== email){
          res.status(400).send("invalid token")
        } else {
          email = email.trim().toLowerCase();
          pool.query('SELECT 1 FROM creators WHERE email = $1 OR gid = $2 LIMIT 1', [email, gid], (err, result) => {
            if(err){
              res.status(500).send("Unable to Access Database");
            }else if(result.rows.length !== 0){
              pool.query('UPDATE creators SET gid = $2 WHERE email = $1 RETURNING *', [email, gid], (err, data) => {
                if (err) {
                  console.log(err);
                  res.status(500).send('Something went wrong with existing email');
                } else {
                  let row = data.rows[0];
                  createLogin({
                    id: row.creator_id,
                    email: row.email,
                    name: row.name,
                    admin: row.admin,
                    first_login: false,
                    verified: row.verified,
                  },(credentials) => {
										res.status(200).send({
											token: credentials.userHash + credentials.token,
                    	user: credentials.user
										})
										// Send verification URL
										// generateUserEmailLink(hashids.encode(row.creator_id), row.name, row.email, Mail.sendVerificationEmail, 'v_', 0)
                  })
                }
              })
            }else{
              pool.query('INSERT INTO creators (name, email, gid) VALUES ($1, $2, $3) RETURNING creator_id',
                [name, email, gid], (err, insert_result) => {
									if (err) {
											console.log(err);
											res.status(500).send('Something Went Wrong');
									} else {

										// console.log(insert_result);
										createLogin({
											id: insert_result.rows[0].creator_id,
											email: email,
											name: name,
											admin: 0,
											first_login: true,
											verified: insert_result.rows[0].verified,
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

const fbLogin = async(req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let fid = req.body.fbId;
    let uri = req.body.uri;
    let code = req.body.code;

    if (!name || !email || !fid || !uri) {
      res.status(400).send("Unable to Authenticate with Facebook");
    } else {
      fbAuth({uri: uri, code: code}, (payload, user) => {
        if (payload.data.data.user_id !== fid){
          res.status(400).send("invalid token")
        } else {
          email = email.trim().toLowerCase();
          pool.query('SELECT 1 FROM creators WHERE email = $1 OR fid = $2 LIMIT 1', [email, fid], (err, result) => {
            if(err){
              res.status(500).send("Unable to Access Database");
            }else if(result.rows.length !== 0){
              pool.query('UPDATE creators SET fid = $2 WHERE email = $1 RETURNING *', [email, fid], (err, data) => {
                if (err) {
                  console.log(err);
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
									},(credentials) => {
										res.status(200).send({
											token: credentials.userHash + credentials.token,
											user: credentials.user
										})
										// Send verification URL
										// generateUserEmailLink(hashids.encode(row.creator_id), row.name, row.email, Mail.sendVerificationEmail, 'v_', 0)
									})
                }
              })
            }else{
              pool.query('INSERT INTO creators (name, email, fid) VALUES ($1, $2, $3) RETURNING creator_id',
                [name, email, fid], (err, insert_result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Something Went Wrong');
                    } else {

                      // console.log(insert_result);
                      createLogin({
                        id: insert_result.rows[0].creator_id,
                        email: email,
                        name: name,
                        admin: 0,
                        first_login: true,
                        verified: true,
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
	let name = req.body.name
	let email = req.body.email
	let password = req.body.password

	if (!name || !email || !password) {
		res.status(400).send("Form not filled")
 	} else {
		email = email.trim().toLowerCase();
		pool.query('SELECT 1 FROM creators WHERE email = $1 LIMIT 1', [email], (err, result) => {
			if(err){
				res.status(500).send("Unable to Access Database")
			}else if(result.rows.length !== 0){
				res.status(409).send("This Email Already Exists")
			}else{
				bcrypt.hash(password, 10, (err, hash) => {
					if (err) {
						console.log(err)
						res.status(500).send('Password Error')
					} else {
						pool.query('INSERT INTO creators (name, email, password) VALUES ($1, $2, $3) RETURNING creator_id',
							[name, email, hash], (err, insert_result) => {
								if (err) {
									console.log(err);
									res.status(500).send('Something Went Wrong')
								} else {

										// console.log(insert_result);
									createLogin({
											id: insert_result.rows[0].creator_id,
											email: email,
											name: name,
											admin: 0,
											first_login: true,
											verified: insert_result.rows[0].verified,
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
		if(!token){
			res.sendStatus(401);
		}else{
		    axios.request({
		        url: 'https://api.amazonalexa.com/v1/vendors',
		        method: 'GET',
		        headers: {
		            Authorization: token
		        }
		    })
		    .then(vendor_request => {
				let vendors = vendor_request.data.vendors;

				if(Array.isArray(vendors) && vendors.length !== 0){
				    res.send(vendors[0].id);
				}else{
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
	if(!req.body || !req.body.email){
		return res.sendStatus(404)
	}

	pool.query('SELECT creator_id, name FROM creators WHERE LOWER(email)=$1 LIMIT 1', [req.body.email], (err, result) => {
		if(err){
			res.status(500).send(err)
		}else if(result.rows.length === 0){
			res.sendStatus(200)
		}else{
			let user_id = hashids.encode(result.rows[0].creator_id)
			let name = result.rows[0].name
      return generateUserEmailLink(user_id, name, req.body.email, Mail.sendResetEmail, 'r_', 3, res);
		}
	})
}

const verifyUser = (req, res) => {
  if(req.params.token.length < 21){
		return res.sendStatus(400)
	}
	let token = req.params.token.substring(0, 12)
	let user_id = req.params.token.substring(13)
	let decode_id = hashids.decode(user_id)
	if(!decode_id){
		return res.sendStatus(400)
	}else{
		decode_id = decode_id[0]
	}
	redisClient.get(`v_${user_id}`, function(err, res_token) {
		if(err){
			return res.status(500).send(err)
		}else if(!res_token || res_token.substring(0,12) !== token){
			return res.sendStatus(404)
		}else{
      pool.query('UPDATE creators SET verified = $1 WHERE creator_id = $2', [true, decode_id], (err) => {
        if(err){
          console.error(err)
          return res.status(500).send(err)
        }else{
          redisClient.del(`v_${user_id}`);
          return res.sendStatus(200)
        }
      })
		}
	})
}

const reset = (req, res, reset=false) => {
	if(req.params.token.length < 21){
		return res.sendStatus(400)
	}

	let token = req.params.token.substring(0, 12)
	let user_id = req.params.token.substring(13)
	let decode_id = hashids.decode(user_id)
	if(!decode_id){
		return res.sendStatus(400)
	}else{
		decode_id = decode_id[0]
	}

	redisClient.get(`r_${user_id}`, function(err, res_token) {
		if(err){
			return res.status(500).send(err)
		}else if(!res_token || res_token.substring(0,12) !== token){
			return res.sendStatus(404)
		}else{
			if(reset === true){
				if(!req.body.password) return res.sendStatus(400)
				// actually reset the password
				bcrypt.hash(req.body.password, 10, (err, hash) => {
	                if (err) {
	                    console.error(err)
	                    res.status(500).send('Password Error')
	                } else {
	                	pool.query('UPDATE creators SET password = $1 WHERE creator_id = $2', [hash, decode_id], (err) => {
	                		if(err){
	                			console.error(err)
								res.status(500).send(err)
							}else{
								redisClient.del(`r_${user_id}`);
								res.sendStatus(200)
							}
	                	})
	                }
	            })
			}else{
				// just checking that the token is valid
				res.sendStatus(200)
			}
		}
	})
}

const getUser = (req, res) => {
	pool.query('SELECT expiry, created FROM creators WHERE creator_id = $1', [req.user.id], (err, data) => {
		if(!err && data.rows && data.rows.length !== 0 ){
			res.send(data.rows[0])
		}else{
			res.sendStatus(404)
		}
	})
}

module.exports = {
	AccessToken: AccessToken,
	hasAccessToken: hasAccessToken,
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
}
