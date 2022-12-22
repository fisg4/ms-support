const debug = require("debug");
const sendGridMail = require('@sendgrid/mail');

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

function getMessage(user, title) {
    const body = "Dear " + user.name + ",\n\nThank you very much for your report. The complaint has been accepted. We have verified that the message contained offensive and unacceptable language.\n\nFastMusik Team will be at your dispossal for any other problem that you may have.\n\nKind regards.\n\nFastMusik Team.";
    const message = {
        to: user.email,
        from: 'fastmusik.app@gmail.com',
        subject: 'Report: ' + title,
        text: body,
    };
    return message
}

const sendEmail = async (user, title) => {
    try {

        const response = await sendGridMail.send(getMessage(user, title));
        return {status: response[0].statusCode}
    } catch (error) {
        debug('Error sending confirmation email', error);
        console.log(error.response)
        if (error.response) {
            return {message: error.response.body}
        }
    }
};

module.exports = {
    sendEmail
};