
const AWS = require('aws-sdk')
const dm = require("dynamodb-migrations")

const options = {
  region: 'localhost',
  endpoint: "http://localhost:8000"
}
const dynamodb = {
  raw: new AWS.DynamoDB(options),
  doc: new AWS.DynamoDB.DocumentClient(options)
}

/* Note: To configure AWS Credentials refer https://aws.amazon.com/sdk-for-node-js/ */

const path = require('path');
const relPath = '../migrations/dynamo';
const absolutePath = path.dirname(__filename) + '/' + relPath;

try {
  dynamodb.raw.listTables({}, (err, data) => {
    if (err) console.error(err, err.stack)
    const deletes = []
    for (tableName of data.TableNames) {
      const del = new Promise(resolve => {
        const name = tableName
        dynamodb.raw.deleteTable({
          TableName: name
        }, (err) => {
          if (err) console.error(err, err.stack)
          else console.log('Deleted', name)
          resolve()
        })
      })
      deletes.push(del)
    }
    Promise.all(deletes).then(() => {
      dm.init(dynamodb, absolutePath)
      dm.executeAll({}).then(_ => {
        setTimeout(() => { process.exit() }, 1000)
      })
    })
  })
} catch (e) {
  console.error("Dynamo Migration Failed with Error", e)
  process.exit(1)
}