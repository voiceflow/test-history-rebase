const Hashids = require("hashids");
exports.team_hash = new Hashids("QsWyflBIuXsD2cBYBg35qq0JcdfQbYHg", 10);

const { pool } = require('./../services')

// Check that this team member can access this skill
exports.checkSkillAccess = async (skill_id, user_id) => {
  if(skill_id) {
    try {
      const result = await pool.query(`
        SELECT 1 FROM skills s
        INNER JOIN projects p ON p.project_id = s.project_id
        INNER JOIN team_members tm ON tm.team_id = p.team_id
        WHERE s.skill_id = $1 AND tm.creator_id = $2 LIMIT 1
      `, [skill_id, user_id])
      if(result.rowCount !== 0) return true
    } catch(err) {
    }
  }
  return false
}

// create a new team
exports.createTeam = async (name, image, creator, seats=false) => {
  let result
  if(seats) {
    result = await pool.query(
      "INSERT INTO teams (name, image, creator_id, seats) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, image, creator.id, seats]
    );
  } else {
    result = await pool.query(
      "INSERT INTO teams (name, image, creator_id) VALUES ($1, $2, $3) RETURNING *",
      [name, image, creator.id]
    );
  }
  return result.rows[0];
};

exports.createPersonalTeam = async (user) => {
  const team = await createTeam("Personal", null, user, 1);
  await populateTeam(team.team_id, user, []);
}