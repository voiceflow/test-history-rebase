const { pool, writeToLogs } = require('./../services')

exports.getUpdates = async (req, res) => {
  let ts = parseInt(parseInt(req.params.ts) / 1000)

  try{
    let update_data = (await pool.query('SELECT * FROM product_updates WHERE created > to_timestamp($1)', [ts])).rows
    res.status(200).send(update_data)
  } catch (err) {
    res.sendStatus(500)
    writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
  }
}

exports.createUpdate = async (req, res) => {
  try{
    await pool.query('INSERT INTO product_updates (type, details, created) VALUES ($1, $2, to_timestamp($3))', [req.body.type, req.body.details, parseInt(req.body.ts)])
    res.sendStatus(200)
  } catch (err){
    res.sendStatus(500)
    writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
  }
}