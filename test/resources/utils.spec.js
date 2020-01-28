'use strict'

const sdk = require('../../src/sdk.js')
const mockApi = require('../mock/api.js')
require('should')

describe('Zabo SDK Utils', () => {
  let utils

  it('should be instantiated during zabo.init()', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).catch(err => err).should.be.ok()

    utils = await require('../../src/resources/utils')(mockApi)

    utils.should.have.property('getQRCode')
    utils.should.have.property('getBytecode')
  })

  it('utils.getQRCode() should return a QRCode image', function () {
    const qrCodeImage = utils.getQRCode('test')

    qrCodeImage.should.containEql('<img src=')
  })

  it('utils.getBytecode() should fail if `fromAddress` is missing', async function () {
    const response = await utils.getBytecode({
      toAddress: '0x0',
      amount: '0.0001',
      currency: 'ETH'
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('fromAddress')
  })

  it('utils.getBytecode() should fail if `toAddress` is missing', async function () {
    const response = await utils.getBytecode({
      fromAddress: '0x0',
      amount: '0.0001',
      currency: 'ETH'
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('toAddress')
  })

  it('utils.getBytecode() should fail if `amount` is missing', async function () {
    const response = await utils.getBytecode({
      fromAddress: '0x0',
      toAddress: '0x0',
      currency: 'ETH'
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('amount')
  })

  it('utils.getBytecode() should fail if `currency` is missing', async function () {
    const response = await utils.getBytecode({
      fromAddress: '0x0',
      toAddress: '0x0',
      amount: '0.0001'
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('currency')
  })

  it('utils.getBytecode() should return the bytecode', async function () {
    const response = await utils.getBytecode({
      fromAddress: '0x0',
      toAddress: '0x0',
      amount: '0.0001',
      currency: 'ETH'
    })

    response.should.be.ok()
    response.should.have.property('bytecode')
    response.bytecode.should.be.an.Array()
    response.bytecode[0].should.be.a.String()
  })
})
