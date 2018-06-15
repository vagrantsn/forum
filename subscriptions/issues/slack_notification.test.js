const nock = require('nock')
const querystring = require('querystring')
const { notifyOnSlack, generateNotificationAttachment } = require('./slack_notification')

describe('Slack Notification on issue opened event', () => {

  describe('Defines notification alert level correctly', () => {
    let issue

    beforeEach(() => {
      issue = {
        html_url: 'https://github.com',
        title: '',
        body: ''
      }
    })

    it('with sensitive content on title', () => {
      issue.title = 'qweqwe ak_live_qweqwe'

      let attachment = generateNotificationAttachment(issue)
      expect(attachment.fields[0].value).toBe('High')
    })

    it('with sensitive content on body', () => {
      issue.body = 'qweqwe ak_live_qweqwe'

      let attachment = generateNotificationAttachment(issue)
      expect(attachment.fields[0].value).toBe('Medium')
    })

    it('with sensitive content on both title and body', () => {
      issue.title = 'qweqwe ak_live_qweqwe'
      issue.body = 'qweqwe ak_live_qweqwe'

      let attachment = generateNotificationAttachment(issue)
      expect(attachment.fields[0].value).toBe('High')
    })
  })

  describe('Sends notification data to Slack API', () => {
    let issue, repository

    beforeEach(() => {
      issue = {
        number: 1,
        html_url: 'https://github.com',
        assignees: []
      }

      repository = {
        full_name: 'vagnervst/forum',
        owner: {
          login: 'repo'
        }
      }
    })

    it('notifies opened issue', async () => {
      let validateApiRequest = (uri, req) => {
        let { attachments } = querystring.parse(req)
        let attachment = JSON.parse(attachments)[0]

        expect(attachment.fields.length).toBe(0)
        expect(attachment.title).toBe(issue.title)
        expect(attachment.text).toBe(issue.body)
      }

      nock('https://slack.com')
        .post('/api/chat.postMessage')
        .query(true)
        .reply(validateApiRequest)

      issue.title = 'Issue Title'
      issue.body = 'Issue Body'

      await notifyOnSlack({ issue, repository })
    })

    it('alerts issue with sensitive content on title', async () => {
      let validateApiRequest = (uri, req) => {
        let { attachments } = querystring.parse(req)
        let attachment = JSON.parse(attachments)[0]

        expect(attachment.fields.length).toBe(1)
        expect(attachment.fields[0].title).toBe('Priority')
        expect(attachment.fields[0].value).toBe('High')
        expect(attachment.title).toBe('Issue created with sensitive content on title!')
        expect(attachment.text).toBe('Issue Title [...]')
      }

      nock('https://slack.com')
        .post('/api/chat.postMessage')
        .query(true)
        .reply(validateApiRequest)

      issue.title = 'Issue Title ak_live_qweqwe'
      issue.body = 'Issue Body'

      await notifyOnSlack({ issue, repository })
    })

    it('alerts issue with sensitive content on body', async () => {
      let validateApiRequest = (uri, req) => {

        let { attachments } = querystring.parse(req)
        let attachment = JSON.parse(attachments)[0]

        expect(attachment.fields.length).toBe(1)
        expect(attachment.fields[0].title).toBe('Priority')
        expect(attachment.fields[0].value).toBe('Medium')
        expect(attachment.title).toBe('Issue created with sensitive content!')
        expect(attachment.text).toBe('Issue Body [...]')
      }

      nock('https://slack.com')
        .post('/api/chat.postMessage')
        .query(true)
        .reply(validateApiRequest)

      issue.title = 'Issue Title'
      issue.body = 'Issue Body ak_live_qweqwe'

      await notifyOnSlack({ issue, repository })
    })

    it('sends assign button if there is no assignee on issue', async () => {
      let validateApiRequest = (uri, req) => {
        let { attachments } = querystring.parse(req)
        let attachment = JSON.parse(attachments)[0]

        expect(attachment.actions).toEqual([
          {
            name: 'assign',
            text: 'Assign',
            type: 'button',
            value: 'assign'
          }
        ])
      }

      nock('https://slack.com')
        .post('/api/chat.postMessage')
        .query(true)
        .reply(validateApiRequest)

      issue.title = 'Issue Title'
      issue.body = 'Issue Body'

      await notifyOnSlack({ issue, repository })
    })

  })

})
