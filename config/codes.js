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
				
				console.log(data.Item);
				data.Item.used = true;
				console.log(data.Item);
				params = {
					TableName: 'com.getstoryflow.creator.codes',
					Item: data.Item
				}
				console.log('params:');
				docClient.put(params, err => {
					if(err){
						console.log(err);
						resolve(false);
					}else{
						resolve(true);
					}
				});
		} else {
			console.log(accessCode);
			console.log(data.Item);
			console.log('Invalid Item');
			resolve(false)
		};
	});
});


const generateCode = (user_id) => new Promise(resolve => {
	
	let item = {
		code : crypto.randomBytes(4).toString('hex'),
		userId : user_id,
		used : false
	};

	
	let params = {
		TableName: 'com.getstoryflow.creator.codes',
		Item: item
	}
	console.log(params);

	docClient.put(params, err => {
		if (err) {
			console.error(err);
			resolve(null);
		} else {
			resolve(item.code)
		}
	});
});

const generateCodesArr = async (user_id) => {
	
	// let numCodes = 3;
	// let numStart = 1
	// let codesArr = Array(numCodes - numStart +1)
	// 	.fill()
	// 	.map(() => (await generateCode(user_id)));

	let codes = [];
	for(var i = 0; i < 3; i++){
		let code = await generateCode(user_id);
		codes.push(code)
	}

	return codes;
}

module.exports = {
	checkCodes: checkCodes,	
	generateCode: generateCode,
	generateCodesArr: generateCodesArr
}
