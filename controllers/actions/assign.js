const axios = require('axios')
const github = require('../../clients/github')
const redis = require('../../clients/redis')
const supporters = require('../../supporters')

const assign = async (req, res, action) => {
  const { callback_id, user: slackUser, response_url } = JSON.parse(req.body.payload)

  let supporter = supporters.find( supporter => supporter.slack.id === slackUser.id )

  let actionContext = await redis.get( callback_id )
  
  const { repository, issue } = JSON.parse(actionContext)
  
  const githubIssue = await github.issues.get({
    owner: repository.owner,
    repo: repository.name,
    number: issue.number
  })

  await github.issues.addAssigneesToIssue({
    owner: repository.owner,
    repo: repository.name,
    number: issue.number,
    assignees: [
      ...githubIssue.data.assignees,
      supporter.github.login
    ]
  })
  .then( () => axios.post(response_url, { text: 'Successfully assigned to issue!' }) )
  .catch( () => axios.post(response_url, { text: 'Oops! It looks like something has broken :S' }) )
}

module.exports = {
  'assign': assign
}
