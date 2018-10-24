const crypto = require('crypto');
const {docClient} = require('./../services');  

const checkCodes = (code) => new Promise(resolve => {
	let params = {
		TableName: 'com.getstoryflow.creator.codes',
		Key: {"code": code.toUpperCase()}
	};

	// if (!req.user.admin) {
	// 	params.ExpressionArributeValues = {''}
	// }

	let accessCode = code;
	
	docClient.get(params, (err, data) => {
		if (err) {
			console.log(err);
			resolve(false);
		} else if (data.Item)  {

			data.Item.used = true;

			params = {
				TableName: 'com.getstoryflow.creator.codes',
				Item: data.Item
			}

			docClient.put(params, err => {
				if(err){
					console.error(err);
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
		code : crypto.randomBytes(4).toString('hex').toUpperCase(),
		userId : user_id,
		used : false
	};

	let params = {
		TableName: 'com.getstoryflow.creator.codes',
		Item: item
	}
	// console.log(params);

	docClient.put(params, err => {
		if (err) {
			console.error(err);
			resolve(null);
		} else {
			resolve(item.code)
		}
	});
});

const generateCodesArr = async (user_id, num=3) => {

	let codes = [];
	for(var i = 0; i < num; i++){
		let code = await generateCode(user_id);
		codes.push(code)
	}

	return codes;
}

const endpoint = async (req, res) => {
	try{
		let codes = generateCodesArr(req.params.num);
		res.send(codes);
	}catch{
		res.sendStatus(500);
	}
}

module.exports = {
	endpoint: endpoint,
	checkCodes: checkCodes,	
	generateCode: generateCode,
	generateCodesArr: generateCodesArr
}
