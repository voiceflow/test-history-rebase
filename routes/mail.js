const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');
const { writeToLogs, encryptJSON } = require('./../services');

exports.sendResetEmail = async (name, token, email) => {
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

exports.sendTeamInvite = async (inviter, team_name, team_id, email, time) => {
  const invite_code = encryptJSON({
    email,
    team_id,
    time,
  });

  const data = {
    template_id: 'd-bc046346f2be4b37af218810f72abd90',
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
          inviter,
          team_name,
          invite_code: `${encodeURIComponent(invite_code)}&email=${encodeURIComponent(email)}`,
        },
      },
    ],
  };

  try {
    await sgMail.send(data);
  } catch (err) {
    writeToLogs('INVITE_EMAIL_ERROR', err);
  }
};
