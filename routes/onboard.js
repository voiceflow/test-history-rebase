const { pool, intercom, writeToLogs, analytics } = require('./../services');

const checkIfOnboarded = (req, res) => {
  pool.query('SELECT * FROM user_info WHERE creator_id = $1', [req.user.id], (err, data) => {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', { err });
      res.sendStatus(500);
    } else if (data.rows.length > 0) {
      res.send(true);
    } else {
      res.send(false);
    }
  });
};

const PROG_XP = (xp) => {
  switch (xp) {
    case 'intermediate':
      return 'OKAY';
    case 'expert':
      return 'GOD';
    default:
      return 'NOOB';
  }
};

const convertToOld = (xp) => {
  switch (xp) {
    case 'intermediate':
      return 1;
    case 'expert':
      return 2;
    default:
      return 0;
  }
};

const submitOnboardSurvey = async (req, res) => {
  if (!req.body.usage_type) {
    req.body.usage_type = 'PERSONAL';
  }

  analytics.identify(
    {
      userId: req.user.id,
      traits: {
        email: req.user.email,
        name: req.user.name,
        usage: req.body.usage_type,
        company: req.body.company_name,
        company_role: req.body.company_role,
        company_size: req.body.company_size,
        design: req.body.design,
        build: req.body.build,
        purpose: req.body.purpose,
        programming_experience: PROG_XP(req.body.programming),
      },
    },
    () => {
      analytics.track({
        userId: req.user.id,
        event: 'Completed onboarding survey',
        properties: {
          hasIdea: req.body.purpose === 'IDEA',
          qualified: req.body.company_role !== 'others',
        },
      });
    }
  );

  try {
    await pool.query(
      'INSERT INTO user_info (creator_id, usage_type, company_name, xp, design, build, company_size, role, purpose) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [
        req.user.id,
        req.body.usage_type,
        req.body.company_name,
        convertToOld(req.body.programming),
        req.body.design,
        req.body.build,
        req.body.company_size,
        req.body.company_role,
        req.body.purpose,
      ]
    );

    // Business users get a trial
    if (req.body.usage_type === 'WORK' && req.body.company_name) {
      // set expiry date 14 days ahead
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 14);

      await pool.query('UPDATE teams SET expiry=$1, name=$2 WHERE creator_id=$3', [expiry, req.body.company_name, req.user.id]);
    }

    res.sendStatus(200);
    intercom.users.create({
      user_id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      custom_attributes: {
        usage: req.body.usage_type,
        company: req.body.company_name,
        company_size: req.body.company_size,
        design: req.body.design,
        build: req.body.build,
        purpose: req.body.purpose,
        programming_experience: PROG_XP(req.body.programming),
      },
    });
  } catch (err) {
    writeToLogs('ONBOARDING ERROR', { err });
    res.sendStatus(500);
  }
};

module.exports = {
  checkIfOnboarded,
  submitOnboardSurvey,
};
