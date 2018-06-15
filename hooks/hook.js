function Hook(event) {
  this._event = event
  this.subscriptions = []
}

Hook.prototype.getEventName = function() { return this._event }

Hook.prototype.subscribe = function(fn) {
  let length = this.subscriptions.push({
    fn,
    priority: this.subscriptions.length
  })

  return {
    priority: (priority) => {
      this.subscriptions[length-1].priority = priority
    }
  }
}

Hook.prototype.getSubscriptions = function() { return this.subscriptions }

Hook.prototype.process = function(req, res) {
  if( !this.validateRequest(req, res) ) {
    return false
  }

  this.broadcast(req.body)
}

Hook.prototype.broadcast = function(payload) {
  let orderedCallbacks = this.subscriptions.sort( (a, b) => {
    return b.priority < a.priority
  })

  orderedCallbacks.map( cb => cb.fn(payload) )
}

Hook.prototype.validateRequest = function(req, res) {
  return true
}

module.exports = Hook
