const express = require('express')
const router = express.Router()
const { getList, getDetail, newBlog, delBlog, updateBlog } = require('../controller/blog')
const { loginValidator } = require('../middleware/auth')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.get('/list', async ({ query }, res) => {
  const { author, keyword } = query || {}

  try {
    const listData = await getList(author, keyword)

    res.json(new SuccessModel(listData))
  } catch (error) {
    res.json(new ErrorModel(null, error))
  }
})

router.get('/detail', async (req, res) => {
  try {
    const data = await getDetail(req.query.id)

    res.json(new SuccessModel(data))
  } catch (error) {
    res.json(new ErrorModel(null, error))
  }
})

router.post('/update', loginValidator, async (req, res) => {
  try {
    await updateBlog(req.body)

    res.json(new SuccessModel(null, '更新成功'))
  } catch (error) {
    res.json(new ErrorModel(null, error))
  }
})

router.post('/new', loginValidator, async (req, res) => {
  req.body.author = req.session.username

  try {
    const data = await newBlog(req.body)

    res.json(new SuccessModel(data, '创建成功'))
  } catch (error) {
    res.json(new ErrorModel(null, error))
  }
})

router.post('/del', loginValidator, async (req, res) => {
  req.body.author = req.session.username

  try {
    await delBlog(req.body.id, req.body.author)

    res.json(new SuccessModel(null, '删除成功'))
  } catch (error) {
    res.json(new ErrorModel(null, error))
  }
})

module.exports = router
