const fs = require('fs')
const path = require('path')

function createWriteStream() {
  const accessLogPath = path.resolve(__dirname, '..', 'logs', 'access.log')
  const writeStream = fs.createWriteStream(accessLogPath, {
    flags: 'a'
  })

  return writeStream
}

module.exports = {
  createWriteStream
}
