const github = require('../clients/github')

const { hideAuthenticationKeys } = require('../helpers/content')

const comments = async (req, res, next) => {
  const {
    action, issue, comment, repository, sender 
  } = req.body

  switch(action) {
    case 'created': case 'edited':
      let publicComment = hideAuthenticationKeys(comment.body, '*[Não compartilhe suas informações publicamente]*')

      if( publicComment !== comment.body ) {
        await github.issues.editComment({
          owner: repository.owner.login,
          repo: repository.name,
          id: comment.id,
          body: publicComment
        })
      }
    default:
      return res.status(403).send(`Unrecognized action: ${action}`)

    return res.send('Ok')
  }

  res.send('Hello, world!')
}

const issuesController = (req, res, next) => {
  const event = req.headers['x-github-event']

  switch(event) {
    case 'issue_comment':
      return comments(req, res, next)
    default:
      return res.status(403).send(`Issue Controller: invalid event ${event}`)
  }
}

module.exports = issuesController