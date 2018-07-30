const Hook = require('./hook')

const GithubHook = function(event) {
  Hook.call(this, event)
}

GithubHook.prototype = Object.create(Hook.prototype)

GithubHook.prototype.process = function(req, res) {
  if (!this.validateRequest(req, res)) {
    return false
  }

  const event = req.headers['x-github-event']

  if (event === this._event) {
    this.broadcast(req.body)
  }
}

module.exports = GithubHook
