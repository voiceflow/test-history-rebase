const axios = require('axios')

const addUser = async (req, res) => {
  if (!req.body) return res.status(401).send('Missing Body')
  try {
    const resp = await axios.post(`${process.env.INTEGRATIONS_LAMBDA_ENDPOINT}/add_user`, req.body)
    return res.send(resp.data)
  } catch (e) {
    return res.status(500).send((e && e.message) || e)
  }
}

const deleteUser = async (req, res) => {
  if (!req.body) return res.status(401).send('Missing Body')
  try {
    const resp = await axios.post(`${process.env.INTEGRATIONS_LAMBDA_ENDPOINT}/delete_user`, req.body)
    return res.send(resp.data)
  } catch (e) {
    return res.status(500).send((e && e.message) || e)
  }
}

const getAllUsers = async (req, res) => {
  const creator_id = req.user && req.user.id
  if (!creator_id) return res.status(401).send('Missing Body')
  try {
    const resp = await axios.post(`${process.env.INTEGRATIONS_LAMBDA_ENDPOINT}/get_users`, { creator_id })
    return res.send(resp.data)
  } catch (e) {
    console.log("error", e)
    return res.status(500).send((e && e.message) || e)
  }
}

module.exports = {
  addUser,
  deleteUser,
  getAllUsers
}