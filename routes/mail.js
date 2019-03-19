const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
const {
  writeToLogs
} = require('./../services')


exports.sendOnboarding = (email, name, cb) => {
  if (typeof name !== 'string') {
    name = null;
  }

  let data = {
    'template_id': 'd-9ba04cdf70894f489147057e71d2c5c9',
    'from': {
      'email': 'braden@getvoiceflow.com',
      'name': 'Braden from Voiceflow'
    },
    'personalizations': [{
      'to': [{
        'email': email,
        'name': name,
      }],
      "dynamic_template_data": {
        name: name
      }
    }],
    'reply_to': {
      'email': 'braden@getvoiceflow.com',
      'name': 'Braden from Voiceflow'
    }
  };

  try {
    sgMail.send(data);
  } catch (err) {
    console.log(JSON.stringify(err.response.body));
  }
};

exports.sendResetEmail = async (name, user_id, random, email) => {
  if (typeof name !== 'string') {
    name = null
  }

  let data = {
    'template_id': 'd-cf3cc12b32b64519a7c2a55568957c3b',
    'from': {
      'email': 'reset@getvoiceflow.com',
      'name': 'Voiceflow Team'
    },
    'personalizations': [{
      'to': [{
        'email': email
      }],
      "dynamic_template_data": {
        link: `${random}${user_id}`,
        name: name
      }
    }]
  }

  await sgMail.send(data)
};

exports.sendVerificationEmail = async (name, user_id, random, email) => {
  if (typeof name !== 'string') {
    name = null
  }

  let data = {
    'template_id': 'd-a0722d2554164efbaa6aed6075834048',
    'from': {
      'email': 'reset@getvoiceflow.com',
      'name': 'Voiceflow Team'
    },
    'personalizations': [{
      'to': [{
        'email': email
      }],
      "dynamic_template_data": {
        link: `${random}${user_id}`,
        name: name
      }
    }]
  }

  await sgMail.send(data)
}

exports.sendTeamInvite = async (inviter, team_name, team_id, email) => {
  let data = {
    'template_id': 'd-bc046346f2be4b37af218810f72abd90',
    'from': {
      'email': 'invite@getvoiceflow.com',
      'name': 'Voiceflow Team'
    },
    'personalizations': [{
      'to': [{
        'email': email
      }],
      "dynamic_template_data": {
        inviter: inviter,
        team_name: team_name,
        team_id: team_id
      }
    }]
  }

  try{
    await sgMail.send(data)
  }catch(err){
    writeToLogs('INVITE_EMAIL_ERROR', err)
  }
}