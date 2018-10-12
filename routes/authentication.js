const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const randomstring = require("randomstring");
const crypto = require('crypto');
const codes = require('./../config/codes');
const config = require('./../config/config');
const uuidv1 = require('uuid/v1');

module.exports = (router, docClient, pool, redisClient) => {

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

	router.get('/session', (req, res) => {
	    req.user ? res.send(req.user) : res.sendStatus(403);
	});

	router.put('/session', (req, res) => {
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
	});

	router.delete('/session', (req, res) => {
		if(req.cookies.auth){
			let userHash = req.cookies.auth.substring(0, 16);
	    	redisClient.del(userHash);
		}
	    res.sendStatus(200);
	});

	router.put('/user', (req, res) => {
	    let name = req.body.name;
	    let email = req.body.email;
		let password = req.body.password;
		let code = req.body.code;

	    if (!name || !email || !password) {
	        res.status(400).send("Form not filled");
	     } else if(!codes.includes(code)) {
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
							    	createLogin({id: insert_result.rows[0].creator_id, email: email, name: name, admin: false }, (credentials) => {
		                            	res.status(200).send({
		                            		token: credentials.userHash + credentials.token,
		                            		user: credentials.user
		                            	});
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
