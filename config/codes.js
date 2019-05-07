const crypto = require('crypto');
const { docClient } = require('./../services');

const checkCodes = (code) => new Promise((resolve) => {
  let params = {
    TableName: 'com.getstoryflow.creator.codes',
    Key: { code: code.toUpperCase() },
  };

  // if (!req.user.admin) {
  // 	params.ExpressionArributeValues = {''}
  // }

  const accessCode = code;

  docClient.get(params, (err, data) => {
    if (err) {
      console.log(err);
      resolve(false);
    } else if (data.Item) {
      if (data.Item.used) {
        resolve(false);
      } else {
        data.Item.used = true;

        params = {
          TableName: 'com.getstoryflow.creator.codes',
          Item: data.Item,
        };

        docClient.put(params, (err) => {
          if (err) {
            console.error(err);
            resolve(false);
          } else {
            resolve(true);
          }
        });
      }
    } else {
      console.log(accessCode);
      console.log(data.Item);
      console.log('Invalid Item');
      resolve(false);
    }
  });
});


const generateCode = (user_id) => new Promise((resolve) => {
  const item = {
    code: crypto.randomBytes(4).toString('hex').toUpperCase(),
    userId: user_id,
    used: false,
  };

  const params = {
    TableName: 'com.getstoryflow.creator.codes',
    Item: item,
  };
  // console.log(params);

  docClient.put(params, (err) => {
    if (err) {
      console.error(err);
      resolve(null);
    } else {
      resolve(item.code);
    }
  });
});

const generateCodesArr = async (user_id, num = 3) => {
  if (num > 100) num = 100;

  const codes = [];
  for (let i = 0; i < num; i++) {
    const code = await generateCode(user_id);
    codes.push(code);
  }

  return codes;
};

const endpoint = async (req, res) => {
  try {
    const codes = await generateCodesArr(req.user.id, req.params.num);
    res.send(codes.join('<br/>'));
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

module.exports = {
  endpoint,
  checkCodes,
  generateCode,
  generateCodesArr,
};
