const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const { redisClient } = require('./db/redis')
const RedisStore = require('connect-redis')(session)
const { SECRET_KEY } = require('./utils/crypto')

const userRouter = require('./routes/user')
const blogRouter = require('./routes/blog')
const { createWriteStream } = require('./utils/log')

const app = express()
const ENV = process.env.NODE_ENV

// view engine setup
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'jade')

if (ENV === 'development') {
  app.use(logger('dev'))
} else {
  app.use(
    logger('combined', {
      stream: createWriteStream()
    })
  )
}

// 接收 application/json 的数据，并 set 到 req 中
app.use(express.json())
// 接收 www-x-form-urlencoded 的数据 并 set 到 req
app.use(express.urlencoded({ extended: false }))
// 解析 cookie
app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')))

const sessionStore = new RedisStore({ client: redisClient })

app.use(
  session({
    secret: `${SECRET_KEY}_session_key#`,
    cookie: {
      // path: '/', // 默认 '/'
      // httpOnly: true, // 默认 true
      maxAge: 24 * 3600 * 1000
    },
    store: sessionStore // 关联 session 到 redis 中
  })
)

app.use('/api/user', userRouter)
app.use('/api/blog', blogRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
