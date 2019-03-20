const {
  pool,
  hashids,
  writeToLogs
} = require('./../services')

// Get all of a users project - used in dashboard
exports.getProjects = async (req, res) => {
  if (!req.user) {
    res.sendStatus(401)
    return
  }

  let query = `
    SELECT s.*, p.project_id
    FROM projects p
    INNER JOIN skills s
    ON p.dev_version = s.skill_id
    WHERE p.creator_id = $1`

  try{
    let projects = (await pool.query(query, [req.user_id])).rows
    res.send(projects.map(project => {
      project.skill_id = hashids.encode(project.skill_id)
      project.project_id = hashids.encode(project.project_id)
      return project
    }))
  } catch(err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {
      err: err
    })
    res.sendStatus(500)
  }
}