'use strict';

// const VError = require('@voiceflow/verror');
const { check } = require('@voiceflow/common').utils;

module.exports = function mailManager(services) {
  const self = {};

  check(services, '', 'object');
  check(services, 'sgMail', 'object');

  const { sgMail } = services;

  self.sendResetEmail = async (name, token, email) => {
    if (typeof name !== 'string') {
      name = null;
    }

    const data = {
      template_id: 'd-cf3cc12b32b64519a7c2a55568957c3b',
      from: {
        email: 'service@voiceflow.com',
        name: 'Voiceflow Team',
      },
      personalizations: [
        {
          to: [
            {
              email,
            },
          ],
          dynamic_template_data: {
            link: token,
            name,
          },
        },
      ],
    };

    await sgMail.send(data);
  };

  return self;
};
