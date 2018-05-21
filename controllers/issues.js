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
        return await github.issues.editComment({
          owner: repository.owner.login,
          repo: repository.name,
          id: comment.id,
          body: publicComment
        })
        .then( () => res.send('comment updated') )
        .catch( () => res.status(500).send('update request failed') )
      }

      return res.send('ok')
    default:
      return res.status(403).send(`unrecognized action: ${action}`)
  }
}

module.exports = {
  'issue_comment': comments
}