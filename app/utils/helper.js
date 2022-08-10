/**
 * Common place to handle all error
 * @link https://stackoverflow.com/questions/63856212/how-to-display-sequelize-validation-error-messages-in-express-api
 */
exports.handleError = (error, req, res) => {
	console.log('Error', error);
	res.status(400).send({
		error: true,
		message: error.data ? error.data : error.error ? error.error.message : error.errors ? error.errors.map(e => e.message) : error?.original?.sqlMessage
	});
};

/**
 * Generate 6 digits OTP
 * @link https://www.studytonight.com/post/one-time-password-generation-using-javascript
 */
exports.generateOTP = () => {
	var digits = '0123456789'; var otpLength = 6; var otp = '';

	for (let i = 1; i <= otpLength; i++) {
		var index = Math.floor(Math.random() * (digits.length));
		otp = otp + digits[index];
	}

	return otp;
}

/**
 * Pagination with sequelize
 * @link https://www.bezkoder.com/node-js-sequelize-pagination-mysql
 */
exports.getPagination = (page, size) => {
	const limit = size ? +size : 10;
	const offset = page ? (page - 1) * limit : 0;
	return { limit, offset };
};

exports.getPagingResults = (data, page, limit) => {
	const { count: totalItems, rows: items } = data;
	const currentPage = page ? +page : 1;
	const totalPages = Math.ceil(totalItems / limit);
	const perPage = limit;

	return { items, pagination: { totalItems, perPage, totalPages, currentPage } };
};

// Query and filters
const { Op } = require('sequelize')

exports.handleFilteraAndQuery = (req, fields) => {
	const { filters, q } = req.query;
	const query = [];

	let queryKeys = fields.map((key) => {
		return { [key]: { [Op.like]: q } };
	});

	q && query.push({
		[Op.or]: queryKeys
	});

	filters && query.push(filters);

	return query;
};

/**
 * Browser user agents
 * @link https://github.com/intoli/user-agents
 */
const UserAgent = require('user-agents')
const userAgent = (new UserAgent())
exports.useragent = JSON.stringify(userAgent.data, null, 2)

const nodemailer = require('nodemailer')

exports.sendEmail = (email, subject, msg, res) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.hostinger.com',
		port: 465,
		auth: {
			user: 'info@piecodes.in',
			pass: 'NnTBZ21KLdcB'
		},
		secure: true
	});

	const data = {
		from: 'Stock Securities<info@piecodes.in>',
		to: `${email}`,
		subject: `${subject}`,
		html: `${msg}`

	}

	transporter.sendMail(data, (error, info) => {
		if (error) {
			return res.status(error.responseCode).send(error);
		}
		return res.status(200).send({
			message: `Check your email for the forgot password code. We have sent it to ${email}`,
			message_id: info.messageId,
			error: false
		});
	});

}