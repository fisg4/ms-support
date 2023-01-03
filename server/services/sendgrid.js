const debug = require("debug");
const sendGridMail = require('@sendgrid/mail');

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

function getMessage(user, title) {
    const body = "Dear " + user.username + ",\n\nThank you very much for your report. The complaint has been accepted. We have verified that the message contained offensive and unacceptable language.\n\nFastMusik Team will be at your dispossal for any other problem that you may have.\n\nKind regards.\n\nFastMusik Team.";
    const message = {
        to: user.email,
        from: 'fastmusik.app@gmail.com',
        subject: 'Report: ' + title,
        text: body,
    };
    return message
}

const sendEmail = async (response, user, title) => {
    try {
        await sendGridMail.send(getMessage(user, title));
    } catch (error) {
        debug("Services Problem");
        response.status(500).send({
            success: false,
            message: "Some problem sending the email with SendGrid Service",
            content: null
        });
        return false;
    }
};

module.exports = {
    sendEmail
};