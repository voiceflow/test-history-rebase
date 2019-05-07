const {
  pool, logging_pool, hashids, writeToLogs,
} = require('./../services');

exports.getLogsUser = async (req, res) => {
  try {
    const version_id = hashids.decode(req.params.skill_id)[0];

    const base = (await pool.query(`
      SELECT pm.amzn_id FROM project_members pm
      INNER JOIN skills s ON s.project_id = pm.project_id
      WHERE pm.creator_id = $1 AND skill_id = $2 AND pm.amzn_id IS NOT NULL
    `, [req.user.id, version_id])).rows[0];

    if (!base) throw { status: 404 };

    const logs = (await logging_pool.query(
      'SELECT timestamp, user_id, request FROM logs WHERE amzn_id = $1 ORDER BY timestamp DESC',
      [base.amzn_id],
    )).rows;

    res.send(logs.map((l) => {
      l.request = JSON.stringify(l.request);
      return l;
    }));
  } catch (err) {
    writeToLogs('FETCH LOGS ERROR', err);
    if (err.status) return res.status(err.status).send(err.message);
    res.sendStatus(500);
  }
};

exports.getLogsProject = async (project_id) => {
  const bases = (await pool.query(`
    SELECT amzn_id FROM project_members
    WHERE project_id = $1 AND amzn_id IS NOT NULL
  `, [project_id])).rows;

  if (bases.length === 0) throw { status: 404 };

  const amzn_ids = bases.map((b) => b.amzn_id);
  const params = [];
  for (let i = 1; i <= amzn_ids.length; i++) {
    params.push(`$${i}`);
  }

  const logs = (await logging_pool.query(
    `SELECT timestamp, user_id, request FROM logs WHERE amzn_id IN (${params.join(',')}) ORDER BY timestamp DESC`,
    amzn_ids,
  )).rows;

  return logs.map((l) => {
    l.request = JSON.stringify(l.request);
    return l;
  });
};
