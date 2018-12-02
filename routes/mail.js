const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

exports.sendOnboarding = (email, name, cb) => {
    if (typeof name !== 'string') {
        name = null;
    }

    let data = {
        'template_id': 'd-9ba04cdf70894f489147057e71d2c5c9',
        'from': {
            'email': 'braden@getvoiceflow.com',
            'name': 'Braden from VoiceFlow'
        },
        'personalizations': [
            {
                'to': [
                    {
                        'email': email,
                        'name': name,
                    }
                ]
            }
        ],
        'reply_to': {
            'email': 'braden@getvoiceflow.com',
            'name': 'Braden from VoiceFlow'
        }
    };

    try{
        sgMail.send(data);
    }catch(err){
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
            'name': 'VoiceFlow Team'
        },
        'personalizations': [
            {
                'to': [
                    {
                        'email': email
                    }
                ],
                "dynamic_template_data":{
                    link: `${random}${user_id}`,
                    name: name
                }
            }
        ]
    }
    
    await sgMail.send(data)
};
