const { expect } = require('chai')
const nock = require('nock')

const { replaceSensitiveInformation } = require('./verify_content')

describe('Issue comment callback: verify content', () => {
  it('removes sensitive content from issue body and title', async () => {
    let sensitiveContent = 'qweqwe ak_live_qweqwe'
    let expected = 'qweqwe [...]'

    nock('https://api.github.com')
      .delete('/repos/owner/repo/issues/comments/1')
      .reply(200)

    nock('https://api.github.com')
      .post('/repos/owner/repo/issues/1/comments')
      .reply((uri, req) => {
        const { body } = JSON.parse(req)

        let notificationToUser = `@githubuser Não compartilhe informações sensíveis de sua conta!\n\n`
        notificationToUser += '**Comentário publicado**:\n'
        notificationToUser += `\> ${expected}\n`

        expect(body).eql(notificationToUser)
      })

    await replaceSensitiveInformation({
      comment: {
        id: 1,
        body: sensitiveContent
      },
      issue: {
        number: 1,
        title: sensitiveContent,
        body: sensitiveContent
      },
      repository: {
        name: 'repo',
        owner: {
          login: 'owner'
        }
      },
      sender: {
        login: 'githubuser'
      }
    })
  })
})
