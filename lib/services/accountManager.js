'use strict';

const _ = require('lodash');
const VError = require('@voiceflow/verror');
const { check, getProcessEnv } = require('@voiceflow/common').utils;
const Promise = require('bluebird');
const DialogflowClient = require('../../clients/Dialogflow/Dialogflow');

const profileColors = [
  'F86683|FEF2F4',
  '5891FB|EFF5FF',
  'E29C42|FCF5EC',
  '36B4D2|ECF8FA',
  '42B761|EDF8F0',
  'E760D4|FCEFFB',
  '26A69A|EBF7F5',
  '8DA2B5|F2F5F7',
  'D58B5F|FAF2ED',
  '697986|EEF0F1',
];

const MAX_DEPTH = 100;
const EXPIRE_TIME = 60 * 60 * 24 * 7;

module.exports = (services) => {
  check(services, '', 'object');
  check(services, '_jwt', 'object');
  check(services, 'pool', 'object');
  check(services, 'axios', 'object');
  check(services, 'redis', 'object');
  check(services, 'crypto', 'object');
  check(services, 'bcrypt', 'object');
  check(services, 'hashids', 'object');
  check(services, 'teamManager', 'object');
  check(services, 'randomstring', 'object');
  check(services, 'googleClient', 'object');

  const { _jwt, axios, pool, redis, randomstring, googleClient, teamManager, bcrypt } = services;

  // generate an unique login hash for user that doesn't exist in the database
  const generateUserHash = async (i = 0) => {
    if (i > MAX_DEPTH) throw new Error('userHash generation depth exceeded');

    let userHash = randomstring.generate({
      length: 16,
      charset: 'alphanumeric',
    });

    const exists = await Promise.fromCallback((cb) => redis.exists(userHash, cb));
    if (exists === 1) {
      userHash = await generateUserHash(i + 1);
    }

    return userHash;
  };

  const createLogin = async (data) => {
    const userHash = await generateUserHash();
    const secret = crypto.randomBytes(256).toString('hex');

    // relevant user details to save to redis
    const user = {
      id: data.id,
      email: data.email,
      name: data.name,
      admin: data.admin,
      verified: data.verified,
    };

    // convert user object to token string
    const token = _jwt.sign(user, secret);

    await Promise.fromCallback((cb) => redis.set(userHash, secret, 'EX', EXPIRE_TIME, cb));

    return {
      token,
      userHash,
      user: data,
    };
  };

  const googleAuth = async (token) => {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: getProcessEnv('GOOGLE_ID'),
    });

    const payload = ticket.getPayload();
    const userid = payload.sub;

    return {
      payload,
      userid,
    };
  };

  const facebookAuth = async (data) => {
    const result = await axios.get(`https://graph.facebook.com/debug_token?input_token=${data.code}&access_token=${getProcessEnv('APP_TOKEN')}`);
    return result;
  };

  const AmazonAccessToken = async (userId) => {
    // fetch user amazon token from redis
    let token = await Promise.fromCallback((cb) => redis.get(`t_${userId}`, cb));
    if (!token) return null;

    token = JSON.parse(token);

    // if token is expired, use the refresh token to generate new token and update redis
    if (token.expire < Date.now()) {
      const result = await axios.post('https://api.amazon.com/auth/o2/token', {
        grant_type: 'refresh_token',
        client_id: getProcessEnv('CONFIG_CLIENT_ID'),
        client_secret: getProcessEnv('CONFIG_CLIENT_SECRET'),
        refresh_token: token.refresh_token,
      });

      const data = {
        expire: Date.now() + result.data.expires_in * 1000,
        access_token: result.data.access_token,
        refresh_token: result.data.refresh_token,
      };

      await Promise.fromCallback((cb) => redis.set(`t_${userId}`, JSON.stringify(data), cb));

      return data.access_token;
    }

    return token.access_token;
  };

  const DeleteAmazonAccessToken = async (userId) => {
    await Promise.fromCallback((cb) => redis.del(`t_${userId}`, cb));
  };

  const putSession = async ({ email, password }) => {
    if (!_.isString(email)) throw new VError('email must be a string', VError.HTTP_STATUS.BAD_REQUEST);
    if (!password) throw new VError('password must be defined', VError.HTTP_STATUS.BAD_REQUEST);

    email = email.trim().toLowerCase();
    if (email === '') throw new VError('email must be defined', VError.HTTP_STATUS.BAD_REQUEST);

    const accounts = await pool.query('SELECT * FROM creators WHERE email = $1 LIMIT 1', [email]);
    if (accounts.rowCount === 0) {
      throw new VError('Username or Password Incorrect', VError.HTTP_STATUS.NOT_ACCEPTABLE);
    }

    const [account] = accounts.rows;

    // check if the password is correct
    if (!['local', 'development_prod', 'development'].includes(getProcessEnv('NODE_ENV'))) {
      try {
        await Promise.fromCallback((cb) => bcrypt.compare(password, account.password, cb));
      } catch (err) {
        throw new VError('Username or Password Incorrect', VError.HTTP_STATUS.NOT_ACCEPTABLE);
      }
    }

    return account;
  };

  const deleteSession = async (userId, cookies) => {
    if (userId) {
      if (cookies.auth) {
        const userHash = cookies.auth.substring(0, 16);
        redis.del(userHash);
      }
      redis.del(`s_${userId}`);
    }
  };

  const googleLogin = async ({ name, email, googleId, token }) => {
    if (!name || !email || !googleId || !token) {
      throw new VError('Unable to Authenticate Through Google', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const { payload } = await googleAuth(token);

    if (payload.email !== email) {
      throw new VError('Invalid Token', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const accounts = await pool.query('SELECT * FROM creators WHERE email = $1 OR gid = $2 LIMIT 1', [email, googleId]);
    let account = null;

    email = email.trim().toLowerCase();

    // If Account Exists
    if (accounts.rowCount === 1) {
      [account] = accounts.rows;

      // If Google ID hasn't been declared update the existing account
      if (account.gid !== googleId) {
        await pool.query('UPDATE creators SET gid = $2 WHERE email = $1', [email, googleId]);
        account.gid = googleId;
      }
    } else {
      const image = _.sample(profileColors);
      const insertAccount = await pool.query('INSERT INTO creators (name, email, gid, image) VALUES ($1, $2, $3, $4) RETURNING *', [
        name,
        email,
        googleId,
        image,
      ]);

      [account] = insertAccount.rows;

      await teamManager.createPersonalTeam({
        id: account.creator_id,
        email: account.email,
      });
    }

    return account;
  };

  const facebookLogin = async ({ name, email, fbId, uri, code }) => {
    if (!name || !email || !fbId || !uri) {
      throw new VError('Unable to Authenticate Through Facebook', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const { payload } = await facebookAuth({ uri, code });

    if (payload.data.data.user_id !== fbId) {
      throw new VError('Invalid Token', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const accounts = await pool.query('SELECT * FROM creators WHERE email = $1 OR fid = $2 LIMIT 1', [email, fbId]);
    let account = null;

    email = email.trim().toLowerCase();

    if (accounts.rowCount === 1) {
      [account] = accounts.rows;

      if (account.fid !== fbId) {
        await pool.query('UPDATE creators SET fid = $2 WHERE email = $1', [email, fbId]);
        account.fid = fbId;
      }
    } else {
      const image = _.sample(profileColors);
      const insertAccount = await pool.query('INSERT INTO creators (name, email, fid, image) VALUES ($1, $2, $3, $4) RETURNING *', [
        name,
        email,
        fbId,
        image,
      ]);

      [account] = insertAccount.rows;

      await teamManager.createPersonalTeam({
        id: account.creator_id,
        email: account.email,
      });
    }

    return account;
  };

  const createUser = async ({ name, email, password }) => {
    if (!name || !email || !password) {
      throw new VError('invalid sign up parameters', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const accounts = await pool.query('SELECT 1 FROM creators WHERE email = $1 LIMIT 1', [email]);

    if (accounts.rowCount > 0) {
      throw new VError('this email already exists', VError.HTTP_STATUS.CONFLICT);
    }

    const hash = await Promise.promisify((cb) => bcrypt.hash(password, 10, cb));
    const image = _.sample(profileColors);

    const insertAccount = await pool.query('INSERT INTO creators (name, email, password, image) VALUES ($1, $2, $3, $4) RETURNING *', [
      name,
      email,
      hash,
      image,
    ]);

    const [account] = insertAccount.rows;
    await teamManager.createPersonalTeam({
      id: account.creator_id,
      email: account.email,
    });

    return account;
  };

  const hasGoogleAccessToken = async (creatorId) => {
    if (!creatorId) {
      throw new VError('missing creatorId', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const accounts = await pool.query('SELECT gactions_token FROM creators WHERE creator_id = $1', [creatorId]);
    const [account] = accounts.rows;

    if (account && !_.isNil(account.gactions_token)) {
      return true;
    }

    return false;
  };

  const hasDialogflowToken = async (creatorId, projectId) => {
    if (!projectId) {
      throw new VError('missing project id', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const members = await pool.query(
      `
      SELECT dialogflow_token 
      FROM project_members
      WHERE creator_id = $1 AND project_id = $2
    `,
      [creatorId, projectId]
    );
    ß;

    const [member] = members.rows;

    if (member && !_.isNil(member.dialogflow_token)) {
      return true;
    }

    return false;
  };

  const verifyDialogflowToken = async (creatorId, projectId, token) => {
    if (!token || !projectId) {
      throw new VError('missing parameters', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const parsed = JSON.parse(token);
    if (!(parsed.type === 'service_account')) {
      throw new VError('Invalid credential type, should be type "service_account"', VError.HTTP_STATUS.BAD_REQUEST);
    }
    if (!parsed.project_id) {
      throw new VError('Missing project ID in credentials', VError.HTTP_STATUS.BAD_REQUEST);
    }
    if (!parsed.private_key) {
      throw new VError('Missing private key in credentials', VError.HTTP_STATUS.BAD_REQUEST);
    }
    if (!parsed.client_email === 'service_account') {
      throw new VError('Missing client email in credentials', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const googleId = parsed.project_id;

    const client = new DialogflowClient(googleId, parsed.private_key, parsed.client_email);
    const agents = await client.getAgent();

    const UPDATE = await pool.query(
      `
        UPDATE project_members 
        SET dialogflow_token = $1, google_id = $2 
        WHERE project_id = $3 AND creator_id = $4`,
      [token, googleId, projectId, creatorId]
    );

    // If nothing was updated create new row
    if (UPDATE.rowCount === 0) {
      await pool.query(
        `
          INSERT INTO project_members (project_id, creator_id, dialogflow_token, google_id) 
          VALUES ($1, $2, $3, $4)
        `,
        [projectId, creatorId, token, googleId]
      );
    }

    const { defaultLanguageCode, supportedLanguageCodes } = agents[0];

    return {
      google_id: googleId,
      defaultLanguageCode,
      supportedLanguageCodes,
    };
  };

  return {
    createUser,
    putSession,
    googleAuth,
    createLogin,
    googleLogin,
    facebookAuth,
    deleteSession,
    facebookLogin,
    generateUserHash,
    AmazonAccessToken,
    hasDialogflowToken,
    hasGoogleAccessToken,
    verifyDialogflowToken,
    DeleteAmazonAccessToken,
  };
};
