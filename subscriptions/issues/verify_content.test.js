const { expect } = require('chai')
const nock = require('nock')

const { replaceSensitiveInformation } = require('./verify_content')

describe('Issue callback: verify content', () => {
  it('removes sensitive content from issue body and title', async () => {
    let sensitiveContent = 'qweqwe ak_live_qweqwe'
    let expected = 'qweqwe [...]'

    nock('https://api.github.com')
      .patch('/repos/owner/repo/issues/1')
      .reply((uri, req) => {
        const updateRequest = JSON.parse(req)

        expect(updateRequest.title).eql(expected)
        expect(updateRequest.body).eql(expected)
      })

    nock('https://api.github.com')
      .post('/repos/owner/repo/issues/1/comments')
      .reply(200)

    await replaceSensitiveInformation({
      issue: {
        number: 1,
        title: sensitiveContent,
        body: sensitiveContent,
        user: {
          login: 'githubuser'
        }
      },
      repository: {
        name: 'repo',
        owner: {
          login: 'owner'
        }
      }
    })
  })
})
