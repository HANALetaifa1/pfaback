const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'letaifahana500@gmail.com',
        pass: 'H@n@H@n@255'
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports.sendConfirmationEmail = (userEmail, activationCode) => {
    transporter.sendMail({
        from: '"Vérifiez votre e-mail " <letaifahana500@gmail.com>',
        to: userEmail,
        subject: 'Vérifiez votre email',
        html: `<h2>Bonjour ! Merci de votre inscription sur notre site</h2> 
        <h4>Veuillez vérifier votre e-mail pour continuer.</h4> 
        <a href="http://localhost:3000/confirm/${activationCode}"> Cliquez ici ! </a>`
    })
    .catch((err) => console.log(err));
};
