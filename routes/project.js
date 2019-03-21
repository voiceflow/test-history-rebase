const {
  pool,
  hashids,
  writeToLogs
} = require('./../services')

const {
  _getGoogleAccessToken
} = require('./../routes/authentication')

const {
  copySkill,
  deleteProjectPromise
} = require('./skill_util')

const {
  checkGactionsVersionChanged
} = require('./../config/ga_actions')

exports.getProjectFromSkill = async (req, res, next) => {
  try{
    let project_id = (await pool.query('SELECT project_id FROM project_versions WHERE version_id = $1 LIMIT 1', [req.params.skill_id])).rows[0].project_id
    req.params.project_id = hashids.encode(project_id)
    next()
  }catch(e){
    res.sendStatus(404)
  }
}

// Get all of a users project - used in dashboard
exports.getProjects = async (req, res) => {
  if (!req.user) {
    res.sendStatus(401)
    return
  }

  if (req.query.user && req.user.admin < 100) {
    res.sendStatus(401)
    return
  }
  
  let userId = req.query.user || req.user.id

  let query = `
    SELECT s.*, p.project_id
    FROM projects p
    INNER JOIN skills s
    ON p.dev_version = s.skill_id
    WHERE p.creator_id = $1`

  try{
    let projects = (await pool.query(query, [userId])).rows
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

exports.getProjectVersions = (req, res) => {
  let project_id = hashids.decode(req.params.project_id)[0]
  pool.query(`
      SELECT s.* FROM skills s
      INNER JOIN project_versions pv ON pv.version_id = s.skill_id
      INNER JOIN projects p ON p.project_id = pv.project_id
      WHERE pv.project_id = $1 AND p.dev_version != s.skill_id
      ORDER BY pv.created DESC`, [project_id],
    (err, data) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', {
          err: err
        })
        res.sendStatus(500)
      } else {
        for (let i = 0; i < data.rows.length; i++) {
          data.rows[i].skill_id = hashids.encode(data.rows[i].skill_id)
        }
        res.send(data.rows)
      }
    }
  )
}

exports.getLiveVersion = async (req, res) => {
  let project_id = hashids.decode(req.params.project_id)[0]
  try {
    // TODO ENFORCE THIS TEAM/CREATOR
    let live_version_data = await pool.query(`
      SELECT s.skill_id AS sid, s.diagram AS sdia
      FROM skills s 
      INNER JOIN project_versions pv ON pv.version_id = s.skill_id 
      WHERE 
        pv.project_id = $1
        AND s.live = TRUE
      LIMIT 1
    `, [project_id])

    let live_version = null
    if (live_version_data.rows.length > 0) {
        live_version = hashids.encode(live_version_data.rows[0].sid)
    } 
    res.send({live_version: live_version})

  } catch (err) {
    console.trace(err)
    res.sendStatus(500)
  }
}

exports.getDevVersion = async (req, res) => {
  let project_id = hashids.decode(req.params.project_id)[0]
  try {
    // TODO ENFORCE THIS TEAM/CREATOR
    let dev_version_data = await pool.query(`
      SELECT s.* FROM skills s INNER JOIN projects p ON p.dev_version = s.skill_id WHERE project_id = $1 LIMIT 1
    `, [project_id])
    if (dev_version_data.rows.length > 0) {
      dev_version_data.rows[0].skill_id = hashids.encode(dev_version_data.rows[0].skill_id)
      res.send(dev_version_data.rows[0])
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.trace(err)
    res.sendStatus(500)
  }
}

exports.publish = async (req, res) => {
  // check that the owner actually owns this project
  let project_id = hashids.decode(req.params.project_id)[0]
  try {
    project_query = (await pool.query('SELECT project_id, dev_version FROM projects WHERE project_id = $1 LIMIT 1', [project_id]))
    if (project_query.rows.length === 0) throw new Error('Invalid Project')

    skill_id = project_query.rows[0].dev_version
  } catch (err) {
    return res.sendStatus(401)
  }

  let platform = req.body.platform || 'alexa'
  let google_project_id

  if (platform === 'google') {
    google_project_id = req.body.project_id
    if (!google_project_id) return res.sendStatus(401)
  }

  // Copy the skill, making sure it points to the same canonical skill point
  const updateVersion = async (new_skill_id_decoded, skill_id, new_skill_row) => {

    let google_versions_to_update
    if (platform === 'google') {
      try {
        const token = await _getGoogleAccessToken(req.user.id)
        google_versions_to_update = await checkGactionsVersionChanged(token, google_project_id, skill_id)
        if (Object.keys(google_versions_to_update).length === 0) google_versions_to_update = null

        const versions = await pool.query(`
          SELECT version_id FROM project_versions
          WHERE project_id = $1
            AND platform = $2
          ORDER BY
            created DESC
          LIMIT 1`,
        [skill_id, new_skill_id_decoded, platform])

        if (versions.rows.length > 0) {
          let latest_version_skill_id = versions.rows[0].version_id
          await pool.query('UPDATE project_versions SET google_versions = $2 where version_id = $1', [latest_version_skill_id, google_versions_to_update])
        }
      } catch (e) {
        console.error(e)
        return res.status(400).send(e)
      }
    }

    let version_query = `INSERT INTO project_versions (project_id, version_id, platform) VALUES ( $1, $2, $3 )`

    pool.query(version_query, [project_id, new_skill_id_decoded, platform], async (err, data) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', {
          err: err
        })
        res.sendStatus(500)
      } else {
        new_skill_row.project_id = project_id
        res.send({
          new_skill: new_skill_row
        })
      }
    })
  }

  // Spoof the request cause we don't use it anymore
  req.params.id = hashids.encode(skill_id)
  req.params.target_creator = req.user.id
  copySkill(req, res, {
    renderDiagram: true
  }, (new_skill_row) => {
    let new_skill_id_decoded = hashids.decode(new_skill_row.skill_id)[0]
    updateVersion(new_skill_id_decoded, skill_id, new_skill_row)
  })
}
