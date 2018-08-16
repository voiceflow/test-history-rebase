const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const randomstring = require("randomstring");
const crypto = require('crypto');
const codes = require('./../config/codes');
const config = require('./../config/config');
const uuidv1 = require('uuid/v1');

module.exports = (router, docClient, redisClient) => {

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

	function createLogin(user, cb) {
		generateUserHash(function(userHash){
	        let secret = crypto.randomBytes(256).toString('hex');
	        // cache the token
	        const token = jwt.sign({
	            user: user
          	}, secret);
	        redisClient.set([userHash, secret], function (err, response) {
	        	redisClient.expire(userHash, config.expireTime, (err, reply) => {});
		        if (err) {
		            cb(null);
		        } else {
		          	cb({
		          		token: token,
	                    userHash: userHash
		          	});
		        }
	        });
      	});
	}

	router.get('/session', (req, res) => {
	    req.user ? res.send(req.user.email) : res.sendStatus(403);
	});

	router.put('/session', (req, res) => {
		if(!req.body.email || !req.body.password){
			res.status(400).send("Invalid Form");
		}else{
		    let email = req.body.email.trim().toLowerCase();
		    let password = req.body.password;
		    let params = {
		        TableName: 'com.getstoryflow.users.production',
		        Key: {'email': email}
		    };
		    docClient.get(params, (err, data) => {
		        if (err) {
		            res.status(500).send("Something Went Wrong");
		        }
		        if (data.Item) {
		            bcrypt.compare(password, data.Item.password, (err, success) => {
		                if (success) {
		                	createLogin(data.Item.email, (credentials) => {
		                		res.status(200).send(credentials.userHash + credentials.token);
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
	});

	router.delete('/session', (req, res) => {
	    const userHash = req.cookies.auth.substring(0, 16);
	    redisClient.del(userHash);
	    res.sendStatus(200);
	});

	router.put('/user', (req, res) => {
	    let name = req.body.name;
	    let email = req.body.email;
	    let password = req.body.password;
	    let code = req.body.code;

	    if (!name || !email || !password || !code) {
	        res.status(400).send("Form not filled");
	    }else if(!codes.includes(code)) {
	        res.status(400).send("Invalid Access Code");
	    }else{
	        email = email.trim().toLowerCase();
	        let params = {
	            TableName: 'com.getstoryflow.users.production',
	            Key: {'email': email}
	        };
	        docClient.get(params, (err, data) => {
	            if (err) {
	                res.status(500).send("Unable to Access Database");
	            } else if (data.Item) {
	                res.status(409).send("This Email Already Exists");
	            } else {
	                bcrypt.hash(password, 10, (err, hash) => {
		                if (err) {
		                    console.log(err);
		                    res.status(500).send('Password Error');
		                } else {
		                    let params = {
		                        TableName: 'com.getstoryflow.users.production',
		                        Item: {
		                            email: email,
		                            password: hash,
		                            id: uuidv1(),
		                            name: name,
		                            createdAt: new Date().toISOString()
		                        }
		                    };
		                    docClient.put(params, err => {
		                        if (err) {
		                            console.log(err);
		                            res.status(500).send('Something Went Wrong');
		                        } else {
		                            createLogin(email, (credentials) => {
		                            	res.status(200).send(credentials.userHash + credentials.token);
		                            });
		                        }
		                    });
		                }
	                });
	            }
	        });
	    }
	});

	return router;
}