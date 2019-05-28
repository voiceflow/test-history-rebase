'use strict';

const _ = require('lodash');
const VError = require('@voiceflow/verror');
const { checkServices } = require('@voiceflow/common').utils;
const Promise = require('bluebird');

// low level stuff required for Google Verifications
const uuid = require('uuid/v4');
const mkdirp = require('mkdirp');
const fs = require('fs').promises;
const del = require('del');
const { spawn } = require('child_process');
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

// Temporary Constants
const MAX_DEPTH = 100;
const ONE_DAY_SEC = 60 * 60 * 24;
const ONE_WEEK_SEC = ONE_DAY_SEC * 7;
const GACTIONS_CLI_ROOT = './gactions_cli';
const AMAZON_TOKEN_PREFIX = 't_';
const SESSION_PREFIX = 's_';
const RESET_PASSWORD_PREFIX = 'r_';

// REQUIRED
const SERVICE_DEPENDENCIES = ['_jwt', 'pool', 'axios', 'redis', 'bcrypt', 'hashids', 'teamManager', 'mailManager', 'randomstring', 'googleClient'];

function AccountManager(services, config = {}) {
  const self = {};

  checkServices(SERVICE_DEPENDENCIES, services);

  const { _jwt, pool, axios, redis, bcrypt, hashids, mailManager, teamManager, randomstring, googleClient } = services;
  const { CONFIG_CLIENT_ID, CONFIG_CLIENT_SECRET, NODE_ENV, GOOGLE_ID, APP_TOKEN } = config;

  /**
   * generate an unique login hash for user that doesn't exist in the database
   * @param {number} count number of times it will keep generating in case of hash collision
   */
  self.generateUserHash = async (count = 0) => {
    if (count > MAX_DEPTH) throw new Error('userHash generation depth exceeded');

    let userHash = randomstring.generate({
      length: 16,
      charset: 'alphanumeric',
    });

    const exists = await redis.exists(userHash);
    if (exists === 1) {
      userHash = await self.generateUserHash(count + 1);
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
  self.createSession = async (data) => {
    const userHash = await self.generateUserHash();
    const secret = randomstring.generate(32);

    // relevant user details to save to redis
    const user = {
      id: data.creator_id,
      name: data.name,
      email: data.email,
      admin: data.admin,
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
   * fetches user amazon info (email, name, etc) from Amazon Token
   * @param {string} token
   * @return {object}
   */
  self.fetchAmazonInfo = async (token) => {
    const { data } = await axios.get(`https://api.amazon.com/user/profile?access_token=${token}`);
    return data;
  };

  /**
   * gets the user's current amazon token and gets new token if expired
   * returns null if no token
   * @param {*} creatorId
   * @returns {string} amazon token
   */
  self.AmazonAccessToken = async (creatorId) => {
    // fetch user amazon token from redis
    let token = await redis.get(`${AMAZON_TOKEN_PREFIX}${creatorId}`);
    if (!token) return null;

    token = JSON.parse(token);

    // if token is expired, use the refresh token to generate new token and update redis
    if (token.expire < Date.now()) {
      const result = await axios.post('https://api.amazon.com/auth/o2/token', {
        grant_type: 'refresh_token',
        client_id: CONFIG_CLIENT_ID,
        client_secret: CONFIG_CLIENT_SECRET,
        refresh_token: token.refresh_token,
      });

      const data = {
        expire: Date.now() + result.data.expires_in * 1000,
        access_token: result.data.access_token,
        refresh_token: result.data.refresh_token,
      };

      await redis.set(`${AMAZON_TOKEN_PREFIX}${creatorId}`, JSON.stringify(data));
      return data.access_token;
    }
    return token.access_token;
  };

  /**
   * deletes user's amazon login token
   * @param {number} creatorId
   */
  self.deleteAmazonAccessToken = async (creatorId) => {
    await redis.del(`${AMAZON_TOKEN_PREFIX}${creatorId}`);
  };

  /**
   * creates a new amazon session and saves the token to redis
   * @param {number} creatorId
   * @param {string} code
   */
  self.createAmazonSession = async (creatorId, code) => {
    if (!code) {
      throw new VError('no amazon code defined', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const result = await axios.post('https://api.amazon.com/auth/o2/token', {
      grant_type: 'authorization_code',
      code,
      client_id: CONFIG_CLIENT_ID,
      client_secret: CONFIG_CLIENT_SECRET,
    });

    const data = {
      expire: Date.now() + result.data.expires_in * 1000,
      access_token: result.data.access_token,
      refresh_token: result.data.refresh_token,
    };

    await redis.set(`t_${creatorId}`, JSON.stringify(data));

    return data.access_token;
  };

  /**
   * checks that a user's email/password is correct and returns their account credentials
   * @param {object} param0
   * @param {string} param0.email
   * @param {string} param0.password
   * @returns {object}
   */
  self.checkLogin = async ({ email, password }) => {
    if (!_.isString(email)) throw new VError('email must be a string', VError.HTTP_STATUS.BAD_REQUEST);
    if (!password) throw new VError('password must be defined', VError.HTTP_STATUS.BAD_REQUEST);

    email = email.trim().toLowerCase();
    if (email === '') throw new VError('email must be defined', VError.HTTP_STATUS.BAD_REQUEST);

    const [account] = (await pool.query('SELECT * FROM creators WHERE email = $1 LIMIT 1', [email])).rows;
    if (!account) {
      throw new VError('Username or Password Incorrect', VError.HTTP_STATUS.NOT_ACCEPTABLE);
    }

    // check if the password is correct
    if (!['local', 'development_prod', 'development'].includes(NODE_ENV)) {
      if (!(await bcrypt.compare(password, account.password))) {
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
  self.deleteSession = async (creatorId, cookies) => {
    if (creatorId) {
      if (cookies.auth) {
        const userHash = cookies.auth.substring(0, 16);
        redis.del(userHash);
      }
      redis.del(`${SESSION_PREFIX}${creatorId}`);
    }
  };

  /**
   * checks google auth token and retrieves metadata
   * @param {string} token
   * @returns {object}
   */
  self.googleAuth = async (token) => {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_ID,
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
  self.googleLogin = async ({ name, email, googleId, token }) => {
    if (!name || !email || !googleId || !token) {
      throw new VError('Unable to Authenticate Through Google', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const { payload } = await self.googleAuth(token);

    if (payload.email !== email) {
      throw new VError('Invalid Token', VError.HTTP_STATUS.BAD_REQUEST);
    }

    email = email.trim().toLowerCase();
    let [account] = (await pool.query('SELECT * FROM creators WHERE email = $1 OR gid = $2 LIMIT 1', [email, googleId])).rows;

    // If Account Exists
    if (account) {
      // If Google ID hasn't been declared update the existing account
      if (account.gid !== googleId) {
        await pool.query('UPDATE creators SET gid = $2 WHERE email = $1', [email, googleId]);
        account.gid = googleId;
      }
    } else {
      const image = _.sample(profileColors);
      [account] = (await pool.query('INSERT INTO creators (name, email, gid, image) VALUES ($1, $2, $3, $4) RETURNING *', [
        name,
        email,
        googleId,
        image,
      ])).rows;
      account.first_login = true;

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
  self.facebookAuth = async (code) => {
    const result = await axios.get(`https://graph.facebook.com/debug_token?input_token=${code}&access_token=${APP_TOKEN}`);
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
  self.facebookLogin = async ({ name, email, fbId, code }) => {
    if (!name || !email || !fbId || !code) {
      throw new VError('Unable to Authenticate Through Facebook', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const data = await self.facebookAuth(code);

    if (data.user_id !== fbId) {
      throw new VError('Invalid Token', VError.HTTP_STATUS.BAD_REQUEST);
    }

    let [account] = (await pool.query('SELECT * FROM creators WHERE email = $1 OR fid = $2 LIMIT 1', [email, fbId])).rows;

    email = email.trim().toLowerCase();

    if (account) {
      if (account.fid !== fbId) {
        await pool.query('UPDATE creators SET fid = $2 WHERE email = $1', [email, fbId]);
        account.fid = fbId;
      }
    } else {
      const image = _.sample(profileColors);
      [account] = (await pool.query('INSERT INTO creators (name, email, fid, image) VALUES ($1, $2, $3, $4) RETURNING *', [
        name,
        email,
        fbId,
        image,
      ])).rows;

      account.first_login = true;

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
  self.createUser = async ({ name, email, password }) => {
    if (!name || !email || !password) {
      throw new VError('invalid sign up parameters', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const existing = await pool.query('SELECT 1 FROM creators WHERE email = $1 LIMIT 1', [email]);

    if (existing.rowCount > 0) {
      throw new VError('this email already exists', VError.HTTP_STATUS.CONFLICT);
    }

    const hash = await bcrypt.hash(password, 10);
    const image = _.sample(profileColors);

    const [account] = (await pool.query('INSERT INTO creators (name, email, password, image) VALUES ($1, $2, $3, $4) RETURNING *', [
      name,
      email,
      hash,
      image,
    ])).rows;

    await teamManager.createPersonalTeam({
      id: account.creator_id,
      email: account.email,
    });

    account.first_login = true;
    return account;
  };

  /**
   * checks if the user has a google access token associated with the account
   * @param {number} creatorId
   * @returns {boolean}
   */
  self.hasGoogleAccessToken = async (creatorId) => {
    if (!creatorId) {
      throw new VError('missing creatorId', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const [account] = (await pool.query('SELECT gactions_token FROM creators WHERE creator_id = $1', [creatorId])).rows;

    return !!account && !_.isNil(account.gactions_token);
  };

  /**
   * checks that the user has a valid dialogflowtoken for this project
   * @param {number} creatorId
   * @param {string} projectId
   * @returns {boolean}
   */
  self.hasDialogflowToken = async (creatorId, projectId) => {
    const [_projectId] = hashids.decode(projectId);
    if (!_projectId) {
      throw new VError('missing project id', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const [member] = (await pool.query(
      `
      SELECT dialogflow_token 
      FROM project_members
      WHERE creator_id = $1 AND project_id = $2
      LIMIT 1
    `,
      [creatorId, _projectId]
    )).rows;

    return !!member && !_.isNil(member.dialogflow_token);
  };

  /**
   * verifies that the creator's dialogflow token is valid and returns metadata about it
   * @param {number} creatorId
   * @param {string} projectId
   * @param {string} token
   * @returns {{google_id, defaultLanguageCode, supportedLanguageCodes}}
   */
  self.verifyDialogflowToken = async (creatorId, projectId, token) => {
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
  self.getVendor = async (creatorId) => {
    const token = await self.AmazonAccessToken(creatorId);

    const vendorRequest = await axios.request({
      url: 'https://api.amazonalexa.com/v1/vendors',
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const { vendors } = vendorRequest.data;

    return Array.isArray(vendors) && vendors.length !== 0 ? vendors[0].id : null;
  };

  /**
   * generates unique token with prefix saved to redis with number of tries at the end
   * if token already exists, increment number of attempts
   * @param {number} creatorId
   * @param {string} prefix
   * @param {number} maxRetry (max 9)
   */
  self.generateLimitToken = async (creatorId, prefix, maxRetry) => {
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
    } else {
      newToken = `${randomstring.generate(12)}1`;
    }

    await redis.set(`${prefix}${creatorId}`, newToken, 'EX', ONE_DAY_SEC);

    return newToken;
  };

  /**
   * sends a password reset email, no errors thrown if email doesn't exist
   * the link token consists of a hash to check against and the creator id appended at the end
   * to look for the given hash (ensures can't have more than 1 active email as well)
   * @param {string} email
   */
  self.resetPasswordEmail = async (email) => {
    if (!email) {
      throw new VError('undefined password reset email', VError.HTTP_STATUS.BAD_REQUEST);
    }
    email = email.trim().toLowerCase();
    const [account] = (await pool.query('SELECT creator_id, name FROM creators WHERE LOWER(email)=$1 LIMIT 1', [email])).rows;

    if (account) {
      const token = await self.generateLimitToken(account.creator_id, RESET_PASSWORD_PREFIX, 3);

      if (token) {
        await mailManager.sendResetEmail(account.name, `${token}${hashids.encode(account.creator_id)}`, email);
      }
    }
  };

  /**
   * resets a user's password based on their password reset token
   * @param {*} resetToken
   * @param {*} password
   */
  self.resetPassword = async (resetToken, password = null) => {
    const [creatorId] = hashids.decode(resetToken.substring(13));
    resetToken = resetToken.substring(0, 12);

    if (!creatorId) {
      throw new VError('invalid token', VError.HTTP_STATUS.BAD_REQUEST);
    }

    const token = await redis.get(`${RESET_PASSWORD_PREFIX}${creatorId}`);

    if (!token || token.substring(0, 12) !== resetToken) {
      throw new VError('invalid or expired token', VError.HTTP_STATUS.NOT_FOUND);
    }

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query('UPDATE creators SET password = $1 WHERE creator_id = $2', [hash, creatorId]);
      await redis.del(`${RESET_PASSWORD_PREFIX}${creatorId}`);
    }
  };

  /**
   * fetches entire creator row as object based on creatorId
   * @param {number} creatorId
   * @returns {object}
   */
  self.getUser = async (creatorId) => {
    const [account] = (await pool.query('SELECT * FROM creators WHERE creator_id = $1 LIMIT 1', [creatorId])).rows;

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
  self.verifyGoogleAccessToken = async (creatorId, token) => {
    if (!token || !creatorId) {
      throw new VError('parameters missing', VError.HTTP_STATUS.BAD_REQUEST);
    }

    token = token.trim();
    if (!/^[\S]{40,80}$/.test(token)) {
      throw new VError('malformed token', VError.HTTP_STATUS.BAD_REQUEST);
    }

    let counter = 0;
    let dir;
    while (counter < 10) {
      const randomId = uuid();
      dir = `${GACTIONS_CLI_ROOT}/${randomId}`;
      try {
        // eslint-disable-next-line
        await Promise.promisify((cb) => mkdirp(dir, cb))();
      } catch (err) {
        if (err.code !== 'EEXIST') throw err;
        counter++;
        continue;
      }
      break;
    }

    const cliFilename = process.platform === 'darwin' ? 'gactions' : 'gactions_linux';

    await fs.copyFile(`${GACTIONS_CLI_ROOT}/${cliFilename}`, `${dir}/gactions`);

    try {
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

        gactions.stdout.on('error', (err) => reject(err));

        gactions.stderr.on('data', async (data) => {
          if (/400 Bad Request/.test(data)) {
            reject(data);
          } else {
            await fs.readFile(`${dir}/creds.data`, {
              encoding: 'utf8',
            });
            await pool.query('UPDATE creators SET gactions_token = $2 WHERE creator_id = $1', [creatorId, data]);
            resolve();
          }
        });
      });
    } catch (err) {
      // clean up and delete directory
      await del([dir]);
      throw err;
    }
    await del([dir]);
  };

  /**
   * fetches google actions token based on creatorId, throws 404 if not found
   * @param {number} creatorId
   * @returns {string}
   */
  self.getGoogleAccessToken = async (creatorId) => {
    const [account] = (await pool.query('SELECT gactions_token FROM creators WHERE creator_id = $1', [creatorId])).rows;

    if (_.isNil(account)) {
      throw new VError('google auth token not found', VError.HTTP_STATUS.NOT_FOUND);
    }

    return account.gactions_token;
  };

  /**
   * deletes google tokens for user and all projects they are on
   * @param {number} creatorId
   */
  self.deleteGoogleAccessToken = async (creatorId) => {
    if (!creatorId) {
      throw new VError('creator id missing', VError.HTTP_STATUS.BAD_REQUEST);
    }

    await pool.query('UPDATE creators SET gactions_token = NULL WHERE creator_id = $1', [creatorId]);
    await pool.query('UPDATE project_members SET dialogflow_token = NULL WHERE creator_id = $1', [creatorId]);
  };

  /**
   * deletes the dialogflowtoken for all project members of a project
   * @param {string} projectId
   */
  self.deleteDialogflowToken = async (projectId) => {
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
  self.updateProfilePicture = async (creatorId, key) => {
    const url = `https://s3.amazonaws.com/com.getstoryflow.api.images/${key}`;
    await pool.query('UPDATE creators SET image = $1 WHERE creator_id = $2', [url, creatorId]);
    return url;
  };

  return self;
}

AccountManager.CONSTANTS = {
  SERVICE_DEPENDENCIES,
  ONE_DAY_SEC,
  ONE_WEEK_SEC,
  AMAZON_TOKEN_PREFIX,
};

module.exports = AccountManager;
