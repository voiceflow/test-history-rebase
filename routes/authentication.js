const bcrypt = require('bcrypt');
const randomstring = require("randomstring");
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');
const axios = require('axios');
const {jwt, docClient, pool, redisClient, config} = require('./../services');
const Codes = require('./../config/codes');
const Mail = require('./mail.js');

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

function createLogin(data, cb) {
	generateUserHash(function(userHash){
        let secret = crypto.randomBytes(256).toString('hex');

        let user = {
        	id: data.id,
            email: data.email,
            name: data.name,
            admin: !!data.admin
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
		    		client_id: config.client_id,
    				client_secret: config.client_secret,
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
    		client_id: config.client_id,
			client_secret: config.client_secret
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
	                if (success) {
	                	createLogin({
	                		id: row.creator_id,
	                		email: row.email,
	                		name: row.name,
	                		admin: row.admin
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

const putUser = async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
	let password = req.body.password;
	let code = req.body.code;

    if (!name || !email || !password) {
        res.status(400).send("Form not filled");
     } else if(!(await Codes.checkCodes(code))) {
        res.status(400).send("Invalid Access Code");
	 } else {
        email = email.trim().toLowerCase();
        pool.query('SELECT 1 FROM creators WHERE email = $1 LIMIT 1', [email], (err, result) => {
        	if(err){
        		console.log(err);
        		res.status(500).send("Unable to Access Database");
        	}else if(result.rows.length !== 0){
        		res.status(409).send("This Email Already Exists");
        	}else{
                bcrypt.hash(password, 10, (err, hash) => {
	                if (err) {
	                    console.log(err);
	                    res.status(500).send('Password Error');
	                } else {
	                	pool.query('INSERT INTO creators (name, email, password) VALUES ($1, $2, $3) RETURNING creator_id', 
	                		[name, email, hash], (err, insert_result) => {
	                        if (err) {
	                            console.log(err);
	                            res.status(500).send('Something Went Wrong');
	                        } else {
								
	                        	// console.log(insert_result);
						    	createLogin({id: insert_result.rows[0].creator_id, email: email, name: name, admin: false }, async (credentials) => {
	                            	res.status(200).send({
	                            		token: credentials.userHash + credentials.token,
										user: credentials.user
										
									});
									
									let codesArr = await Codes.generateCodesArr(credentials.user);
									let template = 'd-9ba04cdf70894f489147057e71d2c5c9';
									Mail.send(email, name, codesArr, template, (err) => {
										console.log(err);
									});
								});
								
								
	                        }
                		});
	                }
	            });
        	}
        });
    }
};

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

module.exports = {
	AccessToken: AccessToken,
	hasAccessToken: hasAccessToken,
	getAmazonCode: getAmazonCode,
	getSession: getSession,
	putSession: putSession,
	deleteSession: deleteSession,
	putUser: putUser,
	getVendor: getVendor
}
