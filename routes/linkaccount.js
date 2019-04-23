const { pool, hashids, jwt, writeToLogs } = require("./../services");
const { checkSkillAccess } = require("./team_util");

exports.getTemplate = async (req, res) => {
  let skill_id = hashids.decode(req.params.skill_id)[0];
  if (!(await checkSkillAccess(skill_id, req.user.id))) {
    return res.sendStatus(403);
  }

  try {
    const result = await pool.query(
      "SELECT * FROM skills WHERE skill_id = $1 LIMIT 1",
      [skill_id]
    );
    if (result.rows.length === 0) return res.sendStatus(404);

    if (result.rows[0].account_linking) {
      try {
        if (!result.rows[0].account_linking.clientSecret) throw new Error();
        result.rows[0].account_linking.clientSecret = jwt.verify(
          result.rows[0].account_linking.clientSecret,
          process.env.JWT_SECRET
        );
      } catch (err) {
        result.rows[0].account_linking.clientSecret = "";
      }
    }
    result.rows[0].skill_id = hashids.encode(result.rows[0].skill_id);
    res.send(result.rows[0]);
  } catch (err) {
    writeToLogs("CREATOR_BACKEND_ERRORS", { err: err });
    res.sendStatus(500);
    console.trace();
  }
};

exports.setTemplate = async (req, res) => {
  let skill_id = hashids.decode(req.params.skill_id)[0];
  if (!(await checkSkillAccess(skill_id, req.user.id))) {
    return res.sendStatus(403);
  }

  try {
    let account_linking = req.body;
    if (account_linking.clientSecret) {
      account_linking.clientSecret = jwt.sign(
        account_linking.clientSecret,
        process.env.JWT_SECRET
      );
    }
    const skill = await pool.query(
      "UPDATE skills SET account_linking = $1 WHERE skill_id = $2 RETURNING *",
      [account_linking, skill_id]
    );

    if (skill.rowCount === 0) return res.sendStatus(404);

    skill.rows[0].skill_id = hashids.encode(skill.rows[0].skill_id);
    res.send(skill.rows[0]);
  } catch (err) {
    writeToLogs("SET ACCOUNT LINK ERROR", { err: err });
    res.sendStatus(500);
    console.trace();
  }
};
