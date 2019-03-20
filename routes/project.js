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
    let projects = (await pool.query(query, [req.user.id])).rows
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

exports.deleteProject = async (req, res) => {
  if (!req.user || !req.params.project_id) {
    res.sendStatus(401)
    return
  }
  let project_id = hashids.decode(req.params.project_id)[0]

  try {
    await deleteProjectPromise(req.user.id, project_id, {
      delete_all_versions: true,
      diagram_updated: false
    })
    res.sendStatus(200)
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', {
      err: err
    })
    res.sendStatus(500)
  }
}