const path = require('path')
const fs = require('fs')

const callbacksPath = path.join(__dirname, 'subscriptions')

const readDirContent = _path =>
  fs.readdirSync(_path).forEach(content => {
    const contentPath = path.join(_path, content)

    const isDir = fs.lstatSync(contentPath).isDirectory()

    if (isDir) {
      readDirContent(contentPath)
    } else if (content.indexOf('test') === -1) {
      require(contentPath)
    }
  })

readDirContent(callbacksPath)
