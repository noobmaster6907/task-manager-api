const sgMail = require('@sendgrid/mail')

// const senGridAPI = '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';

sgMail.setApiKey(process.env.SENDGRID_KEY);

const sendWel = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ppandit_be19@thapar.edu',
        text: `Welcome to the app, ${name}.`
    
    })
}

const sendCancel = (email, name) => {
    sgMail.send( {
        to: 'email',
        from: 'ppandit_be19@thapar.edu',
        subject:'cancel',
        text: `Why are you cancelling, ${name}?`
    })
}

module.exports = {
    sendWel,
    sendCancel
}