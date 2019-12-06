'use strict'

const should = require('should')
const sdk = require('../../src/sdk.js')
const mockApi = require('../mock/api.js')

describe('Zabo SDK Currencies Resource', () => {
  let currencies

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

    currencies = await require('../../src/resources/currencies')(mockApi)

    currencies.should.have.property('getList')
    currencies.should.have.property('getOne')
    currencies.should.have.property('getExchangeRates')
  })

  it('currencies.getList() should fail if an invalid `limit` is provided', async function () {
    let response = await currencies.getList({ limit: 51 }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('limit')
  })

  it('currencies.getOne() should fail if a currency ticker is not provided', async function () {
    let response = await currencies.getOne().should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('currency')
  })

  it('currencies.getExchangeRates() should fail if an invalid `limit` is provided', async function () {
    let response = await currencies.getExchangeRates({
      cryptoCurrency: 'BTC',
      limit: 51
    }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('limit')
  })

  it('currencies.getList() should return the list of currencies', async function () {
    let list = await currencies.getList()

    list.should.be.ok()
    list.data.should.be.an.Array()
    list.data[0].should.have.properties([ 'ticker', 'name', 'type', 'logo' ])
  })

  it('currencies.getOne() should return one currency', async function () {
    let currency = await currencies.getOne('BTC')

    currency.should.be.ok()
    currency.should.have.properties([ 'ticker', 'name', 'type', 'logo' ])
    currency.ticker.should.be.eql('BTC')
  })

  it('currencies.getExchangeRates() should return a list of exchange rates', async function () {
    let list = await currencies.getExchangeRates()

    list.should.be.ok()
    list.data.should.be.an.Array()
    list.data[0].should.have.properties([ 'from', 'to', 'rate' ])
  })
})
