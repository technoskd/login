const md5 = require('md5')

const { Session, User } = require('../models/index');
const { handleError, generateOTP, sendEmail } = require('../utils/helper');
const { registerValidation, loginValidation, forgotPasswordValidation, forgotPasswordVerifyValidation } = require('./schema');

exports.create = async (req, res) => {

  const { error, value } = registerValidation.validate(req.body,);

  if (error) {
    error.details.map((item) => {
      res.send({
        message: item.message
      })
    })
  }

  const data = {
    full_name: req.body.full_name,
    mobile: req.body.mobile,
    email: req.body.email,
    password: md5(req.body.password),
    address: req.body.address,

  };

  const user = await User.findOne({ where: { email: data.email, mobile: data.mobile } })

  if (!user) {
    User.create(data)
      .then(data => {
        res.send({
          data,
          message: `Your registration successfully Please login`,
          error: false
        });
      })
      .catch(err => {
        console.log('err', err);
        handleError(err, req, res);
      });
  }
  else {
    res.status(400).send({ message: `Email id is already exist` })
  }
}

exports.login = async (req, res) => {
  const { error, value } = loginValidation.validate(req.body,);

  const email = req.body.email.toLowerCase();
  const password = md5(req.body.password)

  const user = await User.findOne({ where: { email: email, password: password } })

  if (user) {
    const session = await Session.create({ user_id: user.id });
    res.status(200).send({
      message: `Loggined successfully.`,
      access_token: session.token,
      error: false,
    });
  }
  else {
    res.status(400).send({
      message: `Email or Password Incorrect.`,
      error: true
    });
  }
};

exports.forgotPassword = async (req, res) => {

  const { error, value } = forgotPasswordValidation.validate(req.body,);

  if (error) {
    error.details.map((item) => {
      res.status(400).send({
        message: item.message
      })
    })
  }

  const user = await User.findOne({ where: { email: req.body.email } })

  if (user) {
    const email = req.body.email
    const otp = generateOTP()
    const [user, created] = await User.findOrCreate({
      where: { email: email },
      defaults: {
        email: email,
        token: otp,
      }
    })
      .catch(err => {
        handleError(err, req, res)
      })

    if (created === false) {
      User.update({
        email: email,
        token: otp
      }, { where: { id: user.id } })
        .catch(err => {
          handleError(err, req, res)
        })
    }
    sendEmail(email, 'Your forgot password code to - Stock securities', `<p style="font-size:1.1em">Hi, ${user.full_name}</p> <p>Please use this code to reset password- </p> <h2 style="background: #00466a;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>  <p style="font-size:0.9em;">Regards,<br />Stock Securities</p> `, res);
  }
  else {
    res.status(400).send({
      message: 'This email is not exist',
      error: true
    })
  }
};

exports.forgotPasswordVerify = async (req, res) => {
  const { error, value } = forgotPasswordVerifyValidation.validate(req.body,);

  if (error) {
    error.details.map((item) => {
      res.status(400).send({
        message: item.message
      })
    })
  }

  const token = req.body.token
  const newpassword = req.body.newpassword
  const confirmpassword = req.body.confirmpassword

  if (newpassword === confirmpassword) {
    const password = newpassword

    const user = await User.findOne({ where: { token: token } })
    if (user) {
      User.update({
        token: token,
        password: md5(password)
      },
        { where: { id: user.id } })
        .catch(err => {
          handleError(err, req, res)
        })
      return res.send(200, {
        messsage: 'You successfully reset your password ',
        error: false
      })
    }
  } else {
    return res.status(400).send({
      message: 'Password is not match',
      error: true
    })
  }
  return res.send({
    message: 'Invalid code. Please make sure you use code that was sent to your email.',
    error: true
  })
}

exports.me = async (req, res) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization;
    const session = await Session.findOne({ where: { token: token } });

    if (session) {
      const data = await User.findOne({ where: { id: session.user_id } })
      return res.send({
        id: data.id, full_name: data.full_name, email: data.email, mobile: data.mobile, password: data.password, created_at: data.created_at
      })
    }
  }
}
