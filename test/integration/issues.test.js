const chai = require('chai')
const chaiHttp = require('chai-http')
const nock = require('nock')

const server = require('../../index')

const expect = chai.expect
chai.use(chaiHttp)

describe('Issues', () => {

  it('removes authentication key from new comment', async () => {
    nock('https://api.github.com')
      .patch('/repos/organization/repository/issues/comments/1')
      .query(true)
      .reply(200)

    let response = await chai.request(server)
      .post('/hooks')
      .set('x-github-event', 'issue_comment')
      .send({
        action: 'created',
        comment: {
          id: 1,
          body: 'random comment ak_live_qweqwe1231q'
        },
        repository: {
          name: 'repository',
          owner: {
            login: 'organization'
          }
        }
      })
    
    expect(response).status(200)
    expect(response.text).to.eql('comment updated')
  })

  it('removes authentication key from edited comment', async () => {
    nock('https://api.github.com')
      .patch('/repos/organization/repository/issues/comments/1')
      .query(true)
      .reply(200)

    let response = await chai.request(server)
      .post('/hooks')
      .set('x-github-event', 'issue_comment')
      .send({
        action: 'edited',
        comment: {
          id: 1,
          body: 'random comment ak_live_qweqwe1231q'
        },
        repository: {
          name: 'repository',
          owner: {
            login: 'organization'
          }
        }
      })
    
    expect(response).status(200)
    expect(response.text).to.eql('comment updated')
  })

  it('notifies opened issue', async () => {
    nock('https://slack.com')
      .post('/api/chat.postMessage')
      .query(true)
      .reply(200, { ok: true })

    let response = await chai.request(server)
      .post('/hooks')
      .set('x-github-event', 'issues')
      .send({
        action: 'opened',
        issue: {
          number: 1,
          title: 'issue title',
          html_url: 'https://github.com',
          body: 'issue content',
          user: {
            login: 'githubuser'
          }
        },
        repository: {
          full_name: 'owner/repository-name'
        }
      })

    expect(response).status(200)
    expect(response.text).to.eql('notified')
  })

  it('assigns to issue on slack action', async () => {
    let response = await chai.request(server)
      .post('/actions')
      .send({
        type: 'interactive_message',
        actions: [
          {
            name: 'assign',
            type: 'button',
            value: 'assign'
          }
        ]
      })

    let expected = [
      {
        action: {
          name: 'assign',
          type: 'button',
          value: 'assign'
        },
        response: 'assign action processed'
      }
    ]

    expect(response).status(200)
    expect(response.text).to.eql(JSON.stringify(expected))
  })

})