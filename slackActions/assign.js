const { github, redis } = require('../clients')
const { supporterHelper } = require('../helpers')
const axios = require('axios')

const assignSupporterToIssue = async ({ callback_id, user, response_url }) => {
  let supporter = await supporterHelper.getSupporterBySlackId(user.id)

  supporter = {
    user: 'vagnervst'
  }

  if (!supporter) {
    return axios.post(response_url, {
      replace_original: false,
      text: `Supporter not found for ${user.name} #${user.id}`
    })
  }

  let contextData = await redis.get(callback_id)
  let { repository, issue } = JSON.parse(contextData)

  let issueInfo = `#${issue.number} @ ${repository.owner}/${repository.name}`

  try {
    await github.issues.addAssigneesToIssue({
      owner: repository.owner,
      repo: repository.name,
      number: issue.number,
      assignees: [supporter.user]
    })

    axios.post(response_url, {
      replace_original: true,
      text: `Supporter ${
        supporter.user
      } successfully assigned to issue ${issueInfo}`
    })
  } catch (e) {
    axios.post(response_url, {
      replace_original: false,
      text: `There was an error assigning to issue ${issueInfo}`
    })
  }
}

module.exports = assignSupporterToIssue
