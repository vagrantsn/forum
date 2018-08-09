const Promise = require('bluebird')
const Tesseract = require('tesseract.js')
const Jimp = require('jimp')

const getImagesLink = string => {
  const findImagesLink = /https?:\/\/[^\s]+\.png|jpg|jpeg/g

  return string.match(findImagesLink) ? string.match(findImagesLink) : null
}

const getImage = (url, scale = 1) =>
  Jimp.read(url)
    .then(image => image.scale(scale))
    .then(
      resultantImage =>
        new Promise(resolve =>
          resultantImage.getBuffer(Jimp.MIME_PNG, (err, data) =>
            resolve(getImageText(data))
          )
        )
    )

const getImageText = async image => {
  const imageText = await Tesseract.recognize(image, {
    lang: 'por'
  })

  return imageText.text
}

const findImageInText = url => new RegExp(`(\!?\\[.+\\])?\\(?${url}\\)?`, 'g')

const hasEncryptionKey = string =>
  string.match(/ek(_|\s)?(live|test)(_|\s)?([0-9A-z])/g) !== null

const hasApiKey = string =>
  string.match(/ak(_|\s)?(live|test)(_|\s)?([0-9A-z])/g) !== null

const hasApiKeyOrEncryptionKey = string =>
  hasEncryptionKey(string) || hasApiKey(string)

const hideAuthenticationKeys = (string, replace) => {
  const findKey = /(a|e)k_(live|test)_([0-9A-z])*/g

  return string.replace(findKey, replace)
}

const hideImagesWithSensibleData = async string => {
  const imagesUrl = getImagesLink(string)

  if (!imagesUrl) {
    return string
  }

  const imageContents = await Promise.all(
    await imagesUrl.map(url => getImageContent(url))
  )

  imagesUrl.forEach((value, index) => {
    if (
      hasApiKeyOrEncryptionKey(imageContents[index][0]) ||
      hasApiKeyOrEncryptionKey(imageContents[index][1])
    ) {
      string = string.replace(
        findImageInText(imagesUrl[index]),
        '[...Imagem removida por conter dados sensíveis...]'
      )
    }
  })

  return string
}

const getImageContent = async url => {
  return await Promise.all([getImage(url, 1), getImage(url, 2)])
}

module.exports = {
  hasApiKey,
  hasEncryptionKey,
  hideAuthenticationKeys,
  hideImagesWithSensibleData
}
