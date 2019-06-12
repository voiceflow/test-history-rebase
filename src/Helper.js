import { find } from 'lodash';

const intentHasSlots = (intent) => {
  for (let i = 0; i < intent.inputs.length; i++) {
    const input = intent.inputs[i];
    if (input.slots && input.slots.length > 0) {
      return true;
    }
  }
  return false;
};

const getIntentSlots = (intent, slots_set) => {
  if (!intent) {
    return [];
  }
  const slot_keys = new Set();
  const slots = [];
  for (let i = 0; i < intent.inputs.length; i++) {
    const input = intent.inputs[i];
    if (input.slots && input.slots.length > 0) {
      input.slots.forEach((slot_key) => {
        if (!slot_keys.has(slot_key)) {
          slot_keys.add(slot_key);
          const slot_obj = find(slots_set, {
            key: slot_key,
          });
          if (slot_obj) slots.push(slot_obj);
        }
      });
    }
  }
  return slots;
};

const getDevice = () => {
  const module = {
    options: [],
    header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera],
    dataos: [
      {
        name: 'Windows Phone',
        value: 'Windows Phone',
        version: 'OS',
      },
      {
        name: 'Windows',
        value: 'Win',
        version: 'NT',
      },
      {
        name: 'iPhone',
        value: 'iPhone',
        version: 'OS',
      },
      {
        name: 'iPad',
        value: 'iPad',
        version: 'OS',
      },
      {
        name: 'Kindle',
        value: 'Silk',
        version: 'Silk',
      },
      {
        name: 'Android',
        value: 'Android',
        version: 'Android',
      },
      {
        name: 'PlayBook',
        value: 'PlayBook',
        version: 'OS',
      },
      {
        name: 'BlackBerry',
        value: 'BlackBerry',
        version: '/',
      },
      {
        name: 'Mac',
        value: 'Mac',
        version: 'OS X',
      },
      {
        name: 'Linux',
        value: 'Linux',
        version: 'rv',
      },
      {
        name: 'Palm',
        value: 'Palm',
        version: 'PalmOS',
      },
    ],
    databrowser: [
      {
        name: 'Chrome',
        value: 'Chrome',
        version: 'Chrome',
      },
      {
        name: 'Firefox',
        value: 'Firefox',
        version: 'Firefox',
      },
      {
        name: 'Safari',
        value: 'Safari',
        version: 'Version',
      },
      {
        name: 'Internet Explorer',
        value: 'MSIE',
        version: 'MSIE',
      },
      {
        name: 'Opera',
        value: 'Opera',
        version: 'Opera',
      },
      {
        name: 'BlackBerry',
        value: 'CLDC',
        version: 'CLDC',
      },
      {
        name: 'Mozilla',
        value: 'Mozilla',
        version: 'Mozilla',
      },
    ],
    init() {
      const agent = this.header.join(' ');

      const os = this.matchItem(agent, this.dataos);

      const browser = this.matchItem(agent, this.databrowser);

      return {
        os,
        browser,
      };
    },
    matchItem(string, data) {
      let i = 0;

      let j = 0;

      let regex;

      let regexv;

      let match;

      let matches;

      let version;

      for (i = 0; i < data.length; i += 1) {
        regex = new RegExp(data[i].value, 'i');
        match = regex.test(string);
        if (match) {
          regexv = new RegExp(`${data[i].version}[- /:;]([\\d._]+)`, 'i');
          matches = string.match(regexv);
          version = '';
          if (matches && matches[1]) {
            // eslint-disable-next-line prefer-destructuring
            matches = matches[1];
          }
          if (matches) {
            matches = matches.split(/[._]+/);
            for (j = 0; j < matches.length; j += 1) {
              if (j === 0) {
                version += `${matches[j]}.`;
              } else {
                version += matches[j];
              }
            }
          } else {
            version = '0';
          }
          return {
            name: data[i].name,
            version: parseFloat(version),
          };
        }
      }
      return {
        name: 'unknown',
        version: 0,
      };
    },
  };

  const e = module.init();

  return {
    os: e.os.name,
    version: e.os.version,
    browser: e.browser.name,
  };
};

exports.intentHasSlots = intentHasSlots;
exports.getIntentSlots = getIntentSlots;
exports.getDevice = getDevice;
