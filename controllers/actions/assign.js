const github = require('../../clients/github')
const redis = require('../../clients/redis')
const supporters = require('../../supporters')

const assign = async (req, res, action) => {
  const { callback_id, user: slackUser } = JSON.parse(req.body.payload)

  let supporter = supporters.find( supporter => supporter.slack.id === slackUser.id )

  let actionContext = await redis.get( callback_id )
  
  const { repository, issue } = JSON.parse(actionContext)
  
  const githubIssue = await github.issues.get({
    owner: repository.owner,
    repo: repository.name,
    number: issue.number
  })

  const result = await github.issues.addAssigneesToIssue({
    owner: repository.owner,
    repo: repository.name,
    number: issue.number,
    assignees: [
      ...githubIssue.data.assignees,
      supporter.github.login
    ]
  })

  return `${action.name} action processed`
}

module.exports = assign
