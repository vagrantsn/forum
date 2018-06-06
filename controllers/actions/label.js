const github = require('../../clients/github')
const redis = require('../../clients/redis')

const addLabel = async (req, res, action) => {
  const { callback_id, response_url } = JSON.parse(req.body.payload)

  let selectedLabels = action.selected_options.map( label => label.value )

  let actionContext = await redis.get( callback_id )
  const { repository, issue } = JSON.parse(actionContext)

  try {
    await github.issues.addLabels({
      owner: repository.owner,
      repo: repository.name,
      number: issue.number,
      labels: selectedLabels
    })

    return {
      success: true,
      message: 'Label successfully added'
    }

  } catch(e) {

    return {
      success: false,
      error: e
    }

  }
}

module.exports = {
  'addlabel': addLabel
}
