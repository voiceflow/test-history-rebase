const { pool, writeToLogs } = require('./../services')

const milliToUnix = (milli) => {
  return parseInt(parseInt(milli) / 1000)
}

exports.getUpdates = async (req, res) => {
  let ts = milliToUnix(req.params.ts)

  try{
    let update_data = (await pool.query('SELECT * FROM product_updates WHERE created > to_timestamp($1) AND created < NOW()', [ts])).rows
    res.status(200).send(update_data)
  } catch (err) {
    res.sendStatus(500)
    writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
  }
}

exports.createUpdate = async (req, res) => {
  let ts = req.body.ts ? parseInt(req.body.ts) : milliToUnix(Date.now())
  
  try{
    await pool.query('INSERT INTO product_updates (type, details, created) VALUES ($1, $2, to_timestamp($3))', [req.body.type, req.body.details, ts])
    res.sendStatus(200)
  } catch (err){
    res.sendStatus(500)
    writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
  }
}