
const fs = require('fs');

const GACTIONS_CLI_ROOT = './gactions_cli';

const uuid = require('uuid/v4');

const mkdirp = require('mkdirp');
const _ = require('lodash');


const del = require('del');
const { spawn } = require('child_process');
const {
  delay,
} = require('../util');
const { pool } = require('./../services');

const VALID_VERSION_REGEXES = [
  new RegExp('Version (\\d+)'),
  new RegExp('.-\\[([^\\[\\]]+)\\]\\S+'),
];

exports.checkGactionsVersionChanged = (creds, google_id, project_id, creator_id) => new Promise(async (resolve, reject) => {
  let random_id = uuid();
  let dir = `${GACTIONS_CLI_ROOT}/${random_id}`;
  while (fs.existsSync(dir)) {
    random_id = uuid();
    dir = `${GACTIONS_CLI_ROOT}/${random_id}`;
  }

  const google_versions_to_update = {};
  let all_google_versions;

  try {
    await new Promise((resolve, reject) => {
      mkdirp(dir, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const cli_filename = /darwin/.test(process.env.npm_config_user_agent) ? 'gactions' : 'gactions_linux';

    await new Promise((resolve, reject) => {
      fs.copyFile(`${GACTIONS_CLI_ROOT}/${cli_filename}`, `${dir}/gactions`, (err) => {
        if (err) reject(err);
        resolve();
      });
    });

    await new Promise((resolve, reject) => {
      fs.writeFile(`${dir}/creds.data`, creds, 'utf8', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    all_google_versions = await new Promise(async (resolve, reject) => {
      const gactions = spawn('./gactions', ['list', `--project=${google_id}`], {
        cwd: dir,
      });

      let output = '';

      gactions.stdout.on('data', (data) => {
        output += data.toString();
      });

      gactions.stderr.on('data', (data) => {
        reject(data.toString());
      });

      await delay(4000);

      const attached_google_versions = {};
      const lines = output.split('\n').filter(Boolean);

      lines.forEach((line) => {
        const words = line.split('  ').filter(Boolean);
        const version = words[0];
        const create_time = words[1];
        const update_time = words[2];
        const approval = words[3];
        const deployment_status = words[4];

        if (_.some(VALID_VERSION_REGEXES, (regex) => regex.test(version))) {
          attached_google_versions[version] = {
            create_time,
            update_time,
            approval,
            deployment_status,
          };
        }
      });
      if (lines.length > 1 && Object.keys(attached_google_versions) === 0) {
        reject('Unable to verify Google Actions Version');
      }
      resolve(attached_google_versions);
    });

    const data = await pool.query('SELECT google_versions FROM project_members WHERE project_id = $1 AND creator_id = $2', [project_id, creator_id]);

    let existing_google_versions = data.rows[0].google_versions;
    let highest_existing_version = 0;

    if (existing_google_versions && Object.keys(existing_google_versions).length > 0) {
      highest_existing_version = Object.keys(existing_google_versions).sort((a, b) => {
        const aVersion = +(_.find(VALID_VERSION_REGEXES.map((regex) => a.match(regex))))[1];
        const bVersion = +(_.find(VALID_VERSION_REGEXES.map((regex) => b.match(regex))))[1];

        return aVersion - bVersion;
      });
      highest_existing_version = +(_.find(VALID_VERSION_REGEXES.map((regex) => highest_existing_version[highest_existing_version.length - 1].match(regex))))[1];
    } else {
      existing_google_versions = {};
    }

    Object.keys(all_google_versions).forEach((version) => {
      const version_number = +(_.find(VALID_VERSION_REGEXES.map((regex) => version.match(regex))))[1];
      if (version_number > highest_existing_version) {
        google_versions_to_update[version] = all_google_versions[version];
      }
      existing_google_versions[version] = all_google_versions[version];
    });

    if (existing_google_versions) await pool.query('UPDATE project_members SET google_versions = $3 WHERE project_id = $1 AND creator_id = $2', [project_id, creator_id, existing_google_versions]);
  } catch (e) {
    await new Promise((resolve, reject) => {
      del([dir]).then(resolve()).catch((e) => reject(e));
    });
    console.error(e);
    reject(`Unable to check Google Actions version! Does the project ${google_id} belong to the same google account that you used for authentication?`);
  }
  await new Promise((resolve, reject) => {
    del([dir]).then(resolve()).catch((e) => reject(e));
  });
  resolve(google_versions_to_update);
});
