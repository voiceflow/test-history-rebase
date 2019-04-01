const { ESclient } = require('./services')

const setupIndices = () => {
  try{
    let res = await ESclient.indices.create({
      index: 'flows'
    })
    console.log('Flows index', res)
  } catch (err) {
    console.log(err)
  }
}

setupIndices()