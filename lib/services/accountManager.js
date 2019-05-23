'use strict';

const _ = require('lodash');
const VError = require('@voiceflow/verror');
const { check, getProcessEnv } = require('@voiceflow/common').utils;
const Promise = require('bluebird');

// low level stuff required for Google Verifications
const uuid = require('uuid/v4');
const mkdirp = require('mkdirp');
const fs = require('fs');
const del = require('del');
const { spawn } = require('child_process');
const DialogflowClient = require('../../clients/Dialogflow/Dialogflow');

// temporary until mail client imported
const Mail = require('./../../routes/mail');

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

// Temporary Constants
const MAX_DEPTH = 100;
const ONE_DAY_SEC = 60 * 60 * 27;
const ONE_WEEK_SEC = ONE_DAY_SEC * 7;
const GACTIONS_CLI_ROOT = './gactions_cli';

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

  const { _jwt, pool, axios, redis, crypto, bcrypt, hashids, teamManager, randomstring, googleClient } = services;

  /**
   * generate an unique login hash for user that doesn't exist in the database
   * @param {number} count number of times it will keep generating in case of hash collision
   */
  const generateUserHash = async (count = 0) => {
    if (count > MAX_DEPTH) throw new Error('userHash generation depth exceeded');

    let userHash = randomstring.generate({
      length: 16,
      charset: 'alphanumeric',
    });

    const exists = await redis.exists(userHash);
    if (exists === 1) {
      userHash = await generateUserHash(count + 1);
    }

    return userHash;
  };

  /**
   * creates a login by signing user info with random key and mapping the key to a hash
   * @param {object} data
   * @param {number} data.id
   * @param {string} data.name
   * @param {string} data.email
   * @param {number} data.admin
   * @returns {{token, userHash, user}}
   */
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

    await redis.set(userHash, secret, 'EX', ONE_WEEK_SEC);

    return {
      token,
      userHash,
      user: data,
    };
  };

  /**
   * gets the user's current amazon token and gets new token if expired
   * returns null if no token
   * @param {*} creatorId
   * @returns {string} amazon token
   */
  const AmazonAccessToken = async (creatorId) => {
    // fetch user amazon token from redis
    let token = await redis.get(`t_${creatorId}`);
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

      await redis.set(`t_${creatorId}`, JSON.stringify(data));
      return data.access_token;
    }
    return token.access_token;
  };

  /**
   * deletes user's amazon login token
   * @param {number} creatorId
   */
  const deleteAmazonAccessToken = async (creatorId) => {
    await redis.del(`t_${creatorId}`);
  };

  /**
   * checks that a user's email/password is correct and returns their account credentials
   * @param {object} param0
   * @param {string} param0.email
   * @param {string} param0.password
   * @returns {object}
   */
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
        await bcrypt.compare(password, account.password);
      } catch (err) {
        throw new VError('Username or Password Incorrect', VError.HTTP_STATUS.NOT_ACCEPTABLE);
      }
    }

    return account;
  };

  /**
   * clears the user's session attributes out of redis
   * @param {number} creatorId
   * @param {object} cookies
   */
  const deleteSession = async (creatorId, cookies) => {
    if (creatorId) {
      if (cookies.auth) {
        const userHash = cookies.auth.substring(0, 16);
        redis.del(userHash);
      }
      redis.del(`s_${creatorId}`);
    }
  };

  /**
   * checks google auth token and retrieves metadata
   * @param {string} token
   * @returns {object}
   */
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

  /**
   * checks to see if there is an existing account and logs them in
   * otherwise create a new account with associated google login
   * @param {object} param0
   * @param {string} param0.name
   * @param {string} param0.email
   * @param {number} param0.googleId
   * @param {number} param0.token
   * @returns {object} user row
   */
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

  /**
   * get facebook authentication metadata with keys
   * @param {string} code
   * @returns {object}
   */
  const facebookAuth = async (code) => {
    const result = await axios.get(`https://graph.facebook.com/debug_token?input_token=${code}&access_token=${getProcessEnv('APP_TOKEN')}`);
    return result.data;
  };

  /**
   * checks to see if there is an existing account and logs them in
   * otherwise create a new account with associated facebook login
   * @param {object} param0
   * @param {string} param0.name
   * @param {string} param0.email
   * @param {number} param0.fbId
   * @param {number} param0.uri
   * @param {number} param0.code
   * @returns {object} user row
   */
  const facebookLogin = async ({ name, email, fbId, uri, code }) => {
    if (!name || !email || !fbId || !uri) {
      throw new VError('Unable to Authenticate Through Facebook', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const { data } = await facebookAuth(code);

    if (data.user_id !== fbId) {
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

  /**
   * creates a new user if email doesn't exist and creates a new team/board for them
   * @param {object} param0
   * @param {string} param0.name
   * @param {string} param0.email
   * @param {string} param0.password
   * @returns {object} new user row
   */
  const createUser = async ({ name, email, password }) => {
    if (!name || !email || !password) {
      throw new VError('invalid sign up parameters', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const accounts = await pool.query('SELECT 1 FROM creators WHERE email = $1 LIMIT 1', [email]);

    if (accounts.rowCount > 0) {
      throw new VError('this email already exists', VError.HTTP_STATUS.CONFLICT);
    }

    const hash = await bcrypt.hash(password, 10);
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

  /**
   * checks if the user has a google access token associated with the account
   * @param {number} creatorId
   * @returns {boolean}
   */
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

  /**
   * checks that the user has a valid dialogflowtoken for this project
   * @param {number} creatorId
   * @param {string} projectId
   * @returns {boolean}
   */
  const hasDialogflowToken = async (creatorId, projectId) => {
    const [_projectId] = hashids.decode(projectId);
    if (!_projectId) {
      throw new VError('missing project id', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const members = await pool.query(
      `
      SELECT dialogflow_token 
      FROM project_members
      WHERE creator_id = $1 AND project_id = $2
    `,
      [creatorId, _projectId]
    );

    const [member] = members.rows;

    if (member && !_.isNil(member.dialogflow_token)) {
      return true;
    }

    return false;
  };

  /**
   * verifies that the creator's dialogflow token is valid and returns metadata about it
   * @param {number} creatorId
   * @param {string} projectId
   * @param {string} token
   * @returns {{google_id, defaultLanguageCode, supportedLanguageCodes}}
   */
  const verifyDialogflowToken = async (creatorId, projectId, token) => {
    const [_projectId] = hashids.decode(projectId);
    if (!token || !_projectId) {
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
      [token, googleId, _projectId, creatorId]
    );

    // If nothing was updated create new row
    if (UPDATE.rowCount === 0) {
      await pool.query(
        `
          INSERT INTO project_members (project_id, creator_id, dialogflow_token, google_id) 
          VALUES ($1, $2, $3, $4)
        `,
        [_projectId, creatorId, token, googleId]
      );
    }

    const { defaultLanguageCode, supportedLanguageCodes } = agents[0];

    return {
      google_id: googleId,
      defaultLanguageCode,
      supportedLanguageCodes,
    };
  };

  /**
   * fetches vendor associated with creatorId
   * TODO: update for multivendor
   * @param {number} creatorId
   */
  const getVendor = async (creatorId) => {
    const token = await AmazonAccessToken(creatorId);

    const vendorRequest = await axios.request({
      url: 'https://api.amazonalexa.com/v1/vendors',
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const { vendors } = vendorRequest.data;

    if (Array.isArray(vendors) && vendors.length !== 0) {
      return vendors[0].id;
    }
    return null;
  };

  /**
   * generates unique token with prefix saved to redis with number of tries at the end
   * if token already exists, increment number of attempts
   * @param {number} creatorId
   * @param {string} prefix
   * @param {number} maxRetry (max 9)
   */
  const generateLimitToken = async (creatorId, prefix, maxRetry) => {
    creatorId = hashids.encode(creatorId);

    const token = await redis.get(`${prefix}${creatorId}`);
    let newToken;

    if (token) {
      const attempts = token.substr(-1) * 1;
      if (attempts > maxRetry) {
        // too many requests
        throw new VError('too many email attempts', VError.HTTP_STATUS.TOO_MANY_REQUESTS);
      } else {
        // incremement the token by 1
        newToken = token.slice(0, -1) + (attempts + 1).toString();
      }

      await redis.set(`${prefix}${creatorId}`, newToken, 'EX', ONE_DAY_SEC);
    }

    return token;
  };

  /**
   * sends a password reset email, no errors thrown if email doesn't exist
   * the link token consists of a hash to check against and the creator id appended at the end
   * to look for the given hash (ensures can't have more than 1 active email as well)
   * @param {string} email
   */
  const resetPasswordEmail = async (email) => {
    if (!email) {
      throw new VError('undefined password reset email', VError.HTTP_STATUS.BAD_REQUEST);
    }
    email = email.trim().toLowerCase();
    const accounts = await pool.query('SELECT creator_id, name FROM creators WHERE LOWER(email)=$1 LIMIT 1', [email]);

    if (accounts.rowCount !== 0) {
      const [account] = accounts.rows;
      const token = await generateLimitToken(account.creatorId, 'r_', 3);

      if (token) {
        await Mail.sendResetEmail(account.name, `${token}${account.creator_id}`, email);
      }
    }
  };

  /**
   * resets a user's password based on their password reset token
   * @param {*} resetToken
   * @param {*} password
   */
  const resetPassword = async (resetToken, password = null) => {
    const [creatorId] = hashids.decode(resetToken.substring(13));
    resetToken = resetToken.substring(0, 12);

    if (!creatorId) {
      throw new VError('invalid token', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const token = await redis.get(`r_${creatorId}`);

    if (!token || token.substring(0, 12) !== resetToken) {
      throw new VError('invalid or expired token', VError.HTTP_STATUS.NOT_FOUND);
    }

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query('UPDATE creators SET password = $1 WHERE creator_id = $2', [hash, creatorId]);
      await redis.del(`r_${creatorId}`);
    }
  };

  /**
   * fetches entire creator row as object based on creatorId
   * @param {number} creatorId
   * @returns {object}
   */
  const getUser = async (creatorId) => {
    const accounts = await pool.query('SELECT * FROM creators WHERE creator_id = $1 LIMIT 1', [creatorId]);
    const [account] = accounts.rows;

    if (!account) {
      throw new VError('user not found', VError.HTTP_STATUS.NOT_FOUND);
    }
    return account;
  };

  /**
   * uses Actions CLI commands to verify google actions token
   * @param {number} creatorId
   * @param {string} token
   */
  const verifyGoogleAccessToken = async (creatorId, token) => {
    if (!token || !creatorId) {
      throw new VError('parameters missing', VError.HTTP_STATUS.BAD_REQUEST);
    }

    token = token.trim();
    if (!/^[\S]{40,80}$/.test(token)) {
      throw new VError('malformed token', VError.HTTP_STATUS.BAD_REQUEST);
    }

    let randomId = uuid();
    let dir = `${GACTIONS_CLI_ROOT}/${randomId}`;
    while (fs.existsSync(dir)) {
      randomId = uuid();
      dir = `${GACTIONS_CLI_ROOT}/${randomId}`;
    }

    await Promise.promisify((cb) => mkdirp(dir, cb));

    // this needs to get updated to actually just check for the OS
    const cliFilename = /production/.test(process.env.NODE_ENV) || /staging/.test(process.env.NODE_ENV) ? 'gactions_linux' : 'gactions';

    await Promise.promisify((cb) => fs.copyFile(`${GACTIONS_CLI_ROOT}/${cliFilename}`, `${dir}/gactions`, cb));

    await new Promise((resolve, reject) => {
      const gactions = spawn('./gactions', ['list', '--project='], {
        cwd: dir,
      });
      gactions.stdin.setEncoding('utf-8');

      gactions.stdout.on('data', (data) => {
        if (/Enter authorization code/.test(data)) {
          gactions.stdin.write(`${token}\n`);
        }
      });

      gactions.stderr.on('data', async (data) => {
        if (/400 Bad Request/.test(data)) {
          reject(data);
        } else {
          await Promise.promisify((cb) =>
            fs.readFile(
              `${dir}/creds.data`,
              {
                encoding: 'utf8',
              },
              cb
            )
          );
          await pool.query('UPDATE creators SET gactions_token = $2 WHERE creator_id = $1', [creatorId, data]);
          resolve();
        }
      });
    });

    // clean up and delete directory
    await del([dir]);
  };

  /**
   * fetches google actions token based on creatorId, throws 404 if not found
   * @param {number} creatorId
   * @returns {string}
   */
  const getGoogleAccessToken = async (creatorId) => {
    const accounts = await pool.query('SELECT gactions_token FROM creators WHERE creator_id = $1', [creatorId]);
    const [account] = accounts.rows;

    if (_.isNil(account)) {
      throw new VError('google auth token not found', VError.HTTP_STATUS.NOT_FOUND);
    }

    return account.gactions_token;
  };

  /**
   * deletes google tokens for user and all projects they are on
   * @param {number} creatorId
   */
  const deleteGoogleAccessToken = async (creatorId) => {
    if (!creatorId) {
      throw new VError('creator id missing', VError.HTTP_STATUS.BAD_REQUEST);
    }

    await pool.query('UPDATE creators SET gactions_token = NULL WHERE creator_id = $1', [creatorId]);
    await pool.query('UPDATE project_members SET dialogflow_token = NULL, gactions_token = NULL WHERE creator_id = $1', [creatorId]);
  };

  /**
   * deletes the dialogflowtoken for all project members of a project
   * @param {string} projectId
   */
  const deleteDialogflowToken = async (projectId) => {
    const [_projectId] = hashids.decode(projectId);

    if (!_projectId) {
      throw new VError('invalid project id', VError.HTTP_STATUS.BAD_REQUEST);
    }

    await pool.query('UPDATE project_members SET dialogflow_token = NULL WHERE project_id = $1', [_projectId]);
  };

  /**
   * given an S3 image key, update the creatorId row and return image url
   * @param {number} creatorId
   * @param {string} key
   * @returns {string} image url
   */
  const updateProfilePicture = async (creatorId, key) => {
    const url = `https://s3.amazonaws.com/com.getstoryflow.api.images/${key}`;
    await pool.query('UPDATE creators SET image = $1 WHERE creator_id = $2', [url, creatorId]);
    return url;
  };

  return {
    getUser,
    getVendor,
    createUser,
    putSession,
    googleAuth,
    createLogin,
    googleLogin,
    facebookAuth,
    deleteSession,
    facebookLogin,
    resetPassword,
    generateUserHash,
    AmazonAccessToken,
    resetPasswordEmail,
    hasDialogflowToken,
    updateProfilePicture,
    hasGoogleAccessToken,
    getGoogleAccessToken,
    verifyDialogflowToken,
    deleteDialogflowToken,
    verifyGoogleAccessToken,
    deleteAmazonAccessToken,
    deleteGoogleAccessToken,
  };
};
