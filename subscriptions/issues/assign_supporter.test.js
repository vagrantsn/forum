const nock = require('nock')
const querystring = require('querystring')

const { assignNextSupporter, getNextActiveSupporter } = require('./assign_supporter')

const db = require('../../database/connection')
const Supporter = require('../../database/models/supporter')

describe('Supporter assignment on issue opened event', () => {

  beforeEach(async () => {
    await Supporter.deleteMany({})

    await new Supporter({
      name: 'Test Supporter',
      user: 'supporter',
      email: 'supporter@email.com',
      password: '123',
      slack_id: '1',
      is_active: false,
      last_assign_date: new Date()
    }).save()

    await new Supporter({
      name: 'Test Supporter',
      user: 'supporter2',
      email: 'supporter2@email.com',
      password: '123',
      slack_id: '2',
      is_active: true,
      last_assign_date: new Date()
    }).save()
  })

  it('assigns next supporter to issue', async () => {

    nock('https://api.github.com')
      .post('/repos/owner/repo/issues/1/assignees')
      .query(true)
      .reply( (uri, req) => {
        const body = JSON.parse(req)

        expect(body.assignees.length).toBe(1)
        expect(body.assignees[0]).toBe('supporter2')
      })

    await assignNextSupporter({
      issue: {
        number: 1
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
