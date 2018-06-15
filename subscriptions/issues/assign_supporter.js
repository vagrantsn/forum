const issues = require('../../hooks/events/issues')
const { github } = require('../../clients')
const { supporterHelper } = require('../../helpers')

const assignNextSupporter = async ({ issue, repository }) => {

  let supporter = await supporterHelper.getNextSupporter()

  if( supporter ) {
    github.issues.addAssigneesToIssue({
      owner: repository.owner.login,
      repo: repository.name,
      number: issue.number,
      assignees: [
        supporter.user
      ]
    })
  }

}

issues.subscribe(payload => {
  const { action } = payload

  switch(action) {
    case 'opened':
      assignNextSupporter(payload)
  }
}).priority(0)

module.exports = {
  assignNextSupporter
}
