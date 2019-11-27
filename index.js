const serverless = require('serverless-http');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config();

const corsOptions = {
	origin: function(origin, callback) {
		if (origin == process.env.URL) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', cors(corsOptions), (req, res, next) => {
	const { name, email, message } = req.body;

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.SENDEREMAIL,
			pass: process.env.SENDERPASS,
		},
	});

	const mailOptions = {
		from: process.env.SENDEREMAIL,
		to: process.env.DESTEMAIL,
		subject: 'From Portfolio Contact Form',
		text: `From: ${name} @ ${email}, Message: ${message}`,
	};

	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			res.sendStatus(500);
		} else {
			res.sendStatus(200);
		}
	});
});

module.exports.handler = serverless(app);
