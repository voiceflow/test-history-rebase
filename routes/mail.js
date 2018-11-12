const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
sgMail.setSubstitutionWrappers('-','-');

const sendCodes = (email, name, cb) => {
    if (typeof name !== 'string') {
        name = null;
    }
    // console.log(codesArr[0]);
    // console.log(codesArr[1]);
    // console.log(codesArr[2]);

    let data = {
        'template_id': 'd-9ba04cdf70894f489147057e71d2c5c9',
        'from': {
            'email': 'braden@getstoryflow.com',
            'name': 'Braden from Storyflow'
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
            'email': 'braden@getstoryflow.com',
            'name': 'Braden from Storyflow'
        }
    };

    // "dynamic_template_data": {
    //     "CODE1": codesArr[0],
    //     "CODE2": codesArr[1],
    //     "CODE3": codesArr[2]
    // }

    // request = {
    //     body: data,
    //     method: 'POST',
    //     url: '/v3/mail/send'
    // };

    try{
        sgMail.send(data);
    }catch(err){
        console.log(JSON.stringify(err.response.body));
    }
    // client.request(request)
    //     .then(([
    //         response,
    //         body
    //     ]) => {
    //         cb(response);
    //     })
    //     .catch(err => {
    //         console.log(JSON.stringify(err.response.body));
    //     });
};

exports.sendCodes = sendCodes;

