const express = require('express');
const app = express();
var path = require('path');
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(process.env.PORT || 8000, () => {
    console.log(`Listening on http://127.0.0.1:${process.env.PORT || 8000}`);
});

// Contact form
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASS
    }
});

app.post('/email', function(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    
    const data = {name: name, email: email, subject: subject, message: message};

    var mailOptions = {
        from: 'jake@jpwfilm.co.uk', // sender address [has to be the same as the transporter]
        to: 'jake@jpwfilm.co.uk', // list of receivers
        replyTo: email,
        cc: 'jake.williams77@gmail.com', // cc main email just in case
        subject: "WEBSITE FORM SUBMISSION", // Subject line
        text: message, // plaintext body
        html: `<p><b>Name:</b> ${name}<br /><b>Email:</b> ${email}<br /><b>Subject:</b> ${subject}<br /><b>Message:</b><br />${message}</p>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            res.redirect(307, '/404.html');
            return console.log(err);
        } else {
            res.redirect('/#contact');
        }
    });
});