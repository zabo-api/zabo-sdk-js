'use strict'

const should = require('should')
const sdk = require('../../src/index.js')

describe('Zabo SDK Currencies Resource', () => {

  it('should be instantiated during zabo.init()', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).catch(err => err).should.be.ok()

    sdk.api.should.be.ok()
    sdk.api.connect.should.be.a.Function()

    sdk.api.resources.should.have.property('currencies')

    sdk.api.resources.currencies.should.have.property('getList')
    sdk.api.resources.currencies.should.have.property('getOne')
    sdk.api.resources.currencies.should.have.property('getExchangeRates')
  })

  it('currencies.getList() should fail if an invalid `limit` is provided', async function () {
    let response = await sdk.currencies.getList({ limit: 51 }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('limit')
  })

  it('currencies.getOne() should fail if a currency ticker is not provided', async function () {
    let response = await sdk.currencies.getOne().should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('currency')
  })

  it('currencies.getExchangeRates() should fail if an invalid `limit` is provided', async function () {
    let response = await sdk.currencies.getExchangeRates({
      cryptoCurrency: 'BTC',
      limit: 51
    }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('limit')
  })

})
