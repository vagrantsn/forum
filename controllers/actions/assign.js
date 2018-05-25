const github = require('../../clients/github')

const assign = (req, res, action) => {
  const { callback_id, user: slackUser } = req.body

  let supporter = supporters.find( supporter => supporter.slackId === slackUser.id )

  //TODO: add function to get issue from action callback through callback_id and issue data relation

  return `${action.name} action processed`
}

module.exports = assign