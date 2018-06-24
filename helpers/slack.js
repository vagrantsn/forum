const { slack } = require('../clients')

const sendMessage = (payload) => {
  const { channel, text = '', attachments = [] } = payload

  return slack.chat.postMessage({ 
    channel, 
    text, 
    attachments
  })
}

module.exports = {
  sendMessage
}
