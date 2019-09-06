'use strict'

const should = require('should')
const sdk = require('../../src/index.js')

describe('Zabo SDK Utils', () => {
  let utils = null

  it('should not be instantiated during zabo.init() running outside a browser', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).should.be.ok()

    utils = require('../../src/resources/utils')(sdk.api)

    utils.should.have.property('getQRCode')
  })

  it('utils.getQRCode() should return a QRCode image', async function () {
    let qrCodeImage = utils.getQRCode('test')

    qrCodeImage.should.containEql('<img src=')
  })

})
