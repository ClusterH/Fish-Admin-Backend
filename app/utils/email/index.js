const config = require("../../config/auth.config")
const nodeMailer = require("nodemailer");
const mailConfig = {
    service: 'gmail',
    port: 587,
    host: 'smtp.gmail.com',
    secure: false,
    requireTLS: true,
    auth: {
        user: 'connectzero.dev@gmail.com',
        pass: 'tastefish123!!'
    }
};

const testMailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'graham.jones75@ethereal.email',
        pass: 'XRaqpZNjGMxfGGmbWy'
    }
};

const transporter = nodeMailer.createTransport(mailConfig);
// const transporter = nodeMailer.createTransport(testMailConfig);

const sendMail = (res, to, user_name, userId, subject, content) => {
    transporter.sendMail({
        from: 'Customer Center <connectzero.dev@gmail.com>',
        to: `${user_name} <${to}>`,
        subject: subject,
        text: 'Hello, dear user!',
        html: content
    }, function (err, info) {
        if (err) {
            return res.status(500).send({msg: "AUTH.ERROR", err: err.toString()});
        } else {
            return res.status(200).json({
                period: config.PENDING_EXPIRATION / 60000,
                email: to,
                userId: userId,
            });
        }
    });
};

module.exports = sendMail;
