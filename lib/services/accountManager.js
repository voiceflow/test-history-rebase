'use strict';

const _ = require('lodash');
const VError = require('@voiceflow/verror');
const { check, getProcessEnv } = require('@voiceflow/common').utils;
const Promise = require('bluebird');

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
const getProfile = () => profileColors[Math.floor(Math.random() * profileColors.length)];

const MAX_DEPTH = 100;
const EXPIRE_TIME = 60 * 60 * 24 * 7;

const AccountManager = (services) => {
  check(services, '', 'object');
  check(services, 'jwt', 'object');
  check(services, 'pool', 'object');
  check(services, 'axios', 'object');
  check(services, 'redis', 'object');
  check(services, 'crypto', 'object');
  check(services, 'hashids', 'object');
  check(services, 'analytics', 'object');
  check(services, 'randomstring', 'object');
  check(services, 'googleClient', 'object');

  const {
    jwt,
    axios,
    pool,
    redis,
    randomstring,
    googleClient,
    analytics,
  } = services;

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

  const trackUser = async (data, analyticsData) => {
    if (/development|local/.test(getProcessEnv('NODE_ENV'))) return;

    let { id } = data;
    if (!id) id = data.creator_id;

    // Get location
    const res = await axios.get('http://ip-api.com/json');
    const { country, city } = res.data;

    await Promise.fromCallback((cb) => analytics.identify({
      userId: id,
      traits: {
        email: data.email,
        name: data.name,
        admin: data.admin,
        type: analyticsData.platform,
        city,
        country,
        os: analyticsData.device.os,
        browser: analyticsData.device.browser,
        created: data.created.toISOString().substring(0, 10),
      },
    }, cb));

    analytics.track({
      userId: id,
      event: 'Signed up',
    });
  };

  const createLogin = async (data, analyticsData) => {
    const userHash = await generateUserHash();
    const secret = crypto.randomBytes(256).toString('hex');

    const user = {
      id: data.id,
      email: data.email,
      name: data.name,
      admin: data.admin,
      verified: data.verified,
    };

    trackUser(data, analyticsData);

    // cache the token
    const token = jwt.sign(user, secret);

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
    const result = await axios.get(`https://graph.facebook.com/debug_token?input_token=${data.code}&access_token=${process.env.APP_TOKEN}`)
    return result;
  };

  const AmazonAccessToken = async (userId) => {
    let token = await Promise.fromCallback((cb) => redis.get(`t_${userId}`, cb));
    if (!token) return null;

    token = JSON.parse(token);
    if (token.expire < Date.now()) {
      const result = await axios.post('https://api.amazon.com/auth/o2/token', {
        grant_type: 'refresh_token',
        client_id: getProcessEnv('CONFIG_CLIENT_ID'),
        client_secret: getProcessEnv('CONFIG_CLIENT_SECRET'),
        refresh_token: token.refresh_token,
      });

      const data = {
        expire: Date.now() + (result.data.expires_in * 1000),
        access_token: result.data.access_token,
        refresh_token: result.data.refresh_token,
      };

      await Promise.fromCallback((cb) => redis.set(`t_${userId}`, JSON.stringify(data), cb));

      return data.access_token;
    }

    return token.access_token;
  };

  return {
    AmazonAccessToken,
    generateUserHash,
    createLogin,
    trackUser,
    googleAuth,
    facebookAuth,
  };
};

module.exports = AccountManager;
