const chai = require('chai')
const chaiHttp = require('chai-http')

const server = require('../../index')

const expect = chai.expect
chai.use(chaiHttp)

describe('Hooks', () => {

  it('alerts on unsupported event', async () => {
    let response = await chai.request(server)
      .post('/hooks')
      .set('x-github-event', 'somerandomevent')
      .send()

    expect(response).status(403)
  })

})
