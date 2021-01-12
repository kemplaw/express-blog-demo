const { ErrorModel } = require('../model/resModel')

function loginValidator(req, res, next) {
  if (!req.session || !req.session.username) {
    return res.json(new ErrorModel(null, '尚未登录'))
  }

  next()
}

module.exports = {
  loginValidator
}
