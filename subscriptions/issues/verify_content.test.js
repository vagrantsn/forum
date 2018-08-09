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

  it('removes images with sensible data', async () => {
    let sensibleContent =
      'Estou criando essa issue para testar retirar imagens com dados sensíveis de imagens Esse é o link de uma imagem que deve ser removida: [minha imagem](https://i.imgur.com/dPJ8py9.png) Essa é uma imagem colocada diretamente na issue, e deve ser removida ![minha imagem](https://i.imgur.com/lcDhYJ2.png) Essa imagem é um poema que foi feito o UPLOAD no próprio Github, não deve conter nenhum dado sensível e deve permanecer aqui. ![image](https://user-images.githubusercontent.com/18074134/43658581-b43badb6-972f-11e8-9842-a537d15fb288.png). Esse é um link para a imagem que precisa ser removida: https://i.imgur.com/qolzxBj.png'

    nock('https://api.github.com')
      .patch('/repos/owner/repo/issues/1')
      .reply((uri, req) => {
        const { body } = JSON.parse(req)

        expect(body).to.not.include('https://i.imgur.com/dPJ8py9.png')
        expect(body).to.not.include('https://i.imgur.com/lcDhYJ2.png')
        expect(body).to.not.include('https://i.imgur.com/qolzxBj.png')
        expect(body).to.include(
          'https://user-images.githubusercontent.com/18074134/43658581-b43badb6-972f-11e8-9842-a537d15fb288.png'
        )
      })

    await replaceSensitiveInformation({
      issue: {
        number: 1,
        title: 'Issue com imagens sensiveis',
        body: sensibleContent,
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
