const crypto = require('crypto');
const {docClient} = require('./../services');  

const checkCodes = (code) => new Promise(resolve => {
	let params = {
		TableName: 'com.getstoryflow.creator.codes',
		Key: {"code": code}
	};

	// if (!req.user.admin) {
	// 	params.ExpressionArributeValues = {''}
	// }

	let accessCode = code;
	
	docClient.get(params, (err, data) => {
		if (err) {
			console.log(err);
			resolve(false);
		} else if (data.Item && ((data.Item.code).toUpperCase() === (accessCode).toUpperCase()))  {
				resolve(true);

				data.Item.used = true;
				params = {
					TableName: 'com.getstoryflow.creator.codes',
					Item: data.Item
				}
				docClient.put(params);
		} else {
			console.log('Invalid Item');
			resolve(false)
		};
	});
});

const generateCode = (req,res) => {

	let item = {
		code : crypto.randomBytes(8).toString('hex'),
		userId : req.user.id,
		used : false
	};
	
	let params = {
		TableName: 'com.getstoryflow.creator.codes',
		Item: item
	}

	docClient.put(params, err => {
		if (err) {
			console.log(err);
			res.sendStatus(500);
		} else {
			res.send(item);
		}
	});
}


module.exports = {
	checkCodes: checkCodes,	
	generateCode: generateCode
}
