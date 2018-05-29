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

})