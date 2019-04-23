const { docClient, writeToLogs } = require('../services')
const { stripSample } = require('../app/src/util')
const _ = require('lodash')

// secondary pass through the entire project to upgrade choice blocks to interaction blocks
const secondPass = async (diagram_id, parameters, visited = new Set(), depth = 0) => {
  if(visited.has(diagram_id)) return
  visited.add(diagram_id)

  const { samples, product_map } = parameters

  let params = {
    TableName: `${process.env.SKILLS_DYNAMO_TABLE_BASE_NAME}.live`,
    Key: {
      'id': diagram_id
    }
  }

  let data
  try{
    data = await docClient.get(params).promise()
    if(!data.Item || !data.Item.lines) throw new Error('Diagram Not Found')
  }catch(err){
    console.log(err)
    writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
    return
  }

  for(key in data.Item.lines){
    if(!data.Item.lines.hasOwnProperty(key)) continue
    let line = data.Item.lines[key]

    // check that this is a choice block - time to turn this MF into an interaction block lul
    if(Array.isArray(line.inputs)){
      line.interactions = []
      let intent_set = new Set()
      line.inputs.forEach((input_group, i) => {
        for(input of input_group){
          let stripped = stripSample(input)
          if(stripped in samples){
            let name = samples[stripped].name
            if(!intent_set.has(name)){
              intent_set.add(name)
              line.interactions.push({
                intent: name,
                mappings: [],
                nextIdIndex: i
              })
            }
          }
        }
      })

      if(line.interactions && line.interactions.length > 0){
        delete line.inputs
        delete line.choices
      }
    } else if(line.product_id || line.cancel_product_id) {
      // overwrite product IDs with Amazon Product Ids
      if(line.product_id in product_map){
        line.product_id = product_map[line.product_id]
      }else if(line.cancel_product_id in product_map){
        line.cancel_product_id = product_map[line.cancel_product_id]
      } else{
        line.nextId = line.fail_id
        delete line.product_id
        delete line.fail_id
        delete line.success_id
      }
    } else if(Array.isArray(line.permissions)) {
      // Update Permissions Block with product ids
      // Iterate backwards to splice entries
      for (var i = line.permissions.length - 1; i >= 0; i--) {
        const permission = line.permissions[i]
        if (permission && permission.product) { 
          if(permission.product.value in product_map){
            line.permissions[i].product.value = product_map[permission.product.value]
          }else{
            // this user info block is guarenteed to fail
            line.nextId = line.fail_id
            delete line.permissions
            delete line.fail_id
            delete line.start_id
            break;
          }
        }
      }
    } else if(line.diagram_id) {
      await secondPass(line.diagram_id, parameters, visited, depth + 1)
    }
  }

  // iterate through the commands first
  for(command of data.Item.commands){
    if(command.diagram_id) await secondPass(command.diagram_id, parameters, visited, depth + 1)
  }

  params = {
    TableName: `${process.env.SKILLS_DYNAMO_TABLE_BASE_NAME}.live`,
    Item: data.Item
  }
  await docClient.put(params).promise()
}

module.exports = secondPass