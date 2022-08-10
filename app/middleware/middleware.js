const { Session } = require('../models')

module.exports = middleware = async (req, res, next) => {
  if (req.path.includes('login') || req.path.includes('register') || req.path.includes('forgot')) return next();

  if (req.headers.authorization) {
    const session = await Session.findOne({ where: { token: req.headers.authorization } });

    if (session) {
      let date_ob = new Date();
      let expirteToken = date_ob - session.created_at
      if (expirteToken < 8.64e+7) {
        if (session) { return next(); }
      }
    }
  }
  res.status(401).send({
    message: 'Unauthorized access!',
    error: true
  })
}
