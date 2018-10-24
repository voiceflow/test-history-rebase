const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
sgMail.setSubstitutionWrappers('-', '-');

const isString = str => typeof str === 'string' || str instanceof String;

const send = (email, name, codesArr, template, cb) => {
    if (!isString(email) || !isString(template)) {
        cb(null);

        return;
    } else if (!isString(name)) {
        name = null;
    }
    // console.log(codesArr[0]);
    // console.log(codesArr[1]);
    // console.log(codesArr[2]);

    let data = {
        'template_id': template,
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
                ],
                "substitutions": {
                    "code1": codesArr[0],
                    "code2": codesArr[1],
                    "code3": codesArr[2]
                }
            }
        ],
        'reply_to': {
            'email': 'braden@getstoryflow.com',
            'name': 'Braden from Storyflow'
        }
    };

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

const sendSync = (email, name, template) => new Promise(resolve => {
    send(email, name, template, resolve);
});

exports.send = send;
exports.sendSync = sendSync;
