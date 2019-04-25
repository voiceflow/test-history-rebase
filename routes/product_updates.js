const { pool, writeToLogs } = require('./../services')

exports.getUpdates = async (req, res) => {
  try{
    let update_data = (await pool.query('SELECT * FROM product_updates ORDER BY created DESC LIMIT 10')).rows
    res.status(200).send(update_data)
  } catch (err) {
    res.sendStatus(500)
    writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
  }
}

exports.createUpdate = async (req, res) => {
  try{
    await pool.query('INSERT INTO product_updates (type, details, created) VALUES ($1, $2, NOW())', [req.body.type, req.body.details])
    res.sendStatus(200)
  } catch (err){
    res.sendStatus(500)
    writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
  }
}