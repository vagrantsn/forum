const nock = require('nock')

const assignSupporterToIssue = require('./assign')

const { redisHelper } = require('../helpers')

const db = require('../database/connection')
const Supporter = require('../database/models/supporter')

describe('Slack Assign Button', () => {
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
  })

  it('assigns supporter on button click', async () => {
    nock('https://api.github.com')
      .post('/')
      .reply(() => {
        done()
      })
      .post('/repos/owner/repo/issues/1/assignees')
      .reply((uri, req) => {
        const body = JSON.parse(req)

        expect(body.assignees.length).toBe(1)
        expect(body.assignees).toEqual(['supporter'])
      })

    let contextData = JSON.stringify({
      repository: {
        name: 'repo',
        owner: 'owner'
      },
      issue: {
        number: 1
      }
    })

    let callback_id = redisHelper.createContext(contextData)

    const payload = {
      actions: [
        {
          name: 'assign',
          type: 'button',
          value: 'assign'
        }
      ],
      callback_id,
      user: {
        id: '1'
      },
      response_url: 'https://api.github.com'
    }

    assignSupporterToIssue(payload)
  })
})
