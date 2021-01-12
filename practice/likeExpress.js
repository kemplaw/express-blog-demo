const http = require('http')
const slice = Array.prototype.slice

class LikeExpress {
  constructor() {
    this.routes = {
      all: [],
      get: [],
      post: []
    }
  }

  register(path) {
    // 分析第一个参数是不是路由
    // 当前的中间件注册信息
    const info = {}

    if (typeof path === 'string') {
      info.path = path
      // stack 为当前所有注册中间件的信息
      // 从第二个参数开始转换为数组
      info.stack = slice.call(arguments, 1)
    } else {
      // 如果第一个参数不是 string 类型，则认为是根路由
      info.path = '/'
      info.stack = slice.call(arguments, 0)
    }

    return info
  }

  use(...args) {
    const info = this.register(...args)
    this.routes.all.push(info)
  }

  get(...args) {
    const info = this.register(...args)
    this.routes.get.push(info)
  }

  post(...args) {
    const info = this.register(...args)
    this.routes.post.push(info)
  }

  match(method, url) {
    let stack = []

    if (url === '/favicon.ico') {
      return stack
    }

    // 获取 routes
    let curRoutes = []
    curRoutes = [...curRoutes, ...this.routes.all]
    curRoutes = [...curRoutes, ...this.routes[method]]

    curRoutes.forEach(route => {
      // 匹配访问路径
      if (url.indexOf(route.path) !== 1) {
        stack = [...stack, ...route.stack]
      }
    })

    return stack
  }

  // 核心 next 机制
  handle(req, res, stack) {
    const next = () => {
      // 拿到第一个匹配的中间件
      const middleware = stack.shift()

      if (middleware) {
        middleware(req, res, next)
      }
    }

    next()
  }

  callback() {
    return (req, res) => {
      res.json = data => {
        res.setHeader('content-type', 'application/json')
        res.end(JSON.stringify(data))
      }

      const url = req.url
      const method = req.method.toLowerCase()
      const resultList = this.match(method, url)
      this.handle(req, res, resultList)
    }
  }

  listen(...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }
}

const app = new LikeExpress()

app.use((req, res, next) => {
  console.log('第一个中间件，命中任何路由')
  next()
})

app.get((req, res, next) => {
  console.log('命中第二个中间件')
})

app.get('/test-express', (req, res) => {
  res.json({
    data: 'ok'
  })
})

app.listen(9000, () => console.log('test-express is launching'))
