const { pool, hashids, jwt, writeToLogs } = require("./../services");
const { checkSkillAccess } = require("./team_util");
const randomstring = require("randomstring");
const _ = require('lodash')

exports.getTemplate = async (req, res) => {
  let skill_id = hashids.decode(req.params.skill_id)[0];
  if (!(await checkSkillAccess(skill_id, req.user.id))) {
    return res.sendStatus(403);
  }

  try {
    const result = await pool.query(
      "SELECT account_linking, skill_id FROM skills WHERE skill_id = $1 LIMIT 1",
      [skill_id]
    );
    if (result.rows.length === 0) return res.sendStatus(404);

    if (result.rows[0].account_linking) {
      try {
        if (!result.rows[0].account_linking.clientSecret) throw new Error();
        const clientSecret = jwt.verify(
          result.rows[0].account_linking.clientSecret,
          process.env.JWT_SECRET
        );

        // give back a dummy string of the same length (dangerous to pass back raw strings)
        result.rows[0].account_linking.clientSecret = randomstring.generate(clientSecret.length)
        
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
    const payload = req.body;
    if(!payload || _.isEmpty(payload)) throw { status: 400 }

    const account_linking = {
      skipOnEnablement: payload.skipOnEnablement || false,
      type: payload.type || "AUTH_CODE",
      authorizationUrl: payload.authorizationUrl || "",
      domains: payload.domains || [],
      clientId: payload.clientId || "",
      scopes: payload.scopes || [],
      accessTokenUrl: payload.accessTokenUrl || "",
      clientSecret: payload.clientSecret || "",
      accessTokenScheme: payload.accessTokenScheme || "HTTP_BASIC",
      defaultTokenExpirationInSeconds: payload.defaultTokenExpirationInSeconds || 3600
    }

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

    if (err && err.status) return res.status(err.status).send(message)
    res.sendStatus(500);
    console.trace();
  }
};
