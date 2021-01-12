const express = require('express')
const router = express.Router()
const { login, signIn } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const result = (await login(username, password)) || {}

  if (result.username) {
    req.session.username = username
    req.session.realname = result.realname

    return res.json(new SuccessModel(result, '登录成功'))
  }

  res.json(new ErrorModel(null, '用户名或密码错误'))
})

router.post('/signIn', async (req, res) => {
  if (!req.body.username) return res.json(new ErrorModel(null, '注册失败'))

  const result = await signIn(req.body)
  const { username } = result

  res.json(username ? new SuccessModel(result, '注册成功') : new ErrorModel(null, '注册失败'))
})

router.post('/logout', async (req, res) => {
  req.session.username = ''
  req.session.realname = ''

  res.json(new SuccessModel(null, '退出登录成功'))
})

module.exports = router
