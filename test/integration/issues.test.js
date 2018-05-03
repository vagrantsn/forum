const chai = require('chai')
const chaiHttp = require('chai-http')

const server = require('../../index')

const expect = chai.expect
chai.use(chaiHttp)

describe('Issues event', () => {

  it('accepts "issue_comment" events only', async () => {
    let response = await chai.request(server)
      .post('/hooks/issue/comment')
      .set('x-github-event', 'somerandomevent')
      .send()

    expect(response).status(403)
  })

})