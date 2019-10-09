'use strict'

const should = require('should')
const sdk = require('../../src/index.js')

describe('Zabo SDK Accounts Resource', () => {
  let accounts = null

  it('should not be instantiated during zabo.init() running outside a browser', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).should.be.ok()

    sdk.api.should.be.ok()
    sdk.api.connect.should.be.a.Function()

    sdk.api.resources.should.not.have.property('accounts')

    accounts = require('../../src/resources/accounts')(sdk.api)

    accounts.should.have.property('getAccount')
    accounts.should.have.property('getBalances')
  })

  it('accounts.getBalances() should fail if a string or array of `tickers` are not provided', async function () {
    let response = await accounts.getBalances().should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('tickers')
  })

  it('accounts.getBalances() should fail if an account has not connected yet', async function () {
    let response = await accounts.getBalances({ tickers: 'BTC' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(401)
    response.message.should.containEql('connected')
  })

  it('accounts.createDepositAddress() should fail if an account `id` is missing', async function () {
    let response = await accounts.createDepositAddress({ token: 'token' }, 'ETH').should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('id')
  })

  it('accounts.createDepositAddress() should fail if an account session `token` is missing', async function () {
    let response = await accounts.createDepositAddress({ id: 'id' }, 'BTC').should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('token')
  })

  it('accounts.createDepositAddress() should fail if a currency ticker is missing', async function () {
    let response = await accounts.createDepositAddress({ id: 'id', token: 'token' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('ticker')
  })

  it('accounts.getDepositAddress() should fail if an account `id` is missing', async function () {
    let response = await accounts.getDepositAddress({ token: 'token' }, 'BAT').should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('id')
  })

  it('accounts.getDepositAddress() should fail if an account session `token` is missing', async function () {
    let response = await accounts.getDepositAddress({ id: 'id' }, 'DAI').should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('token')
  })

  it('accounts.getDepositAddress() should fail if a currency ticker is missing', async function () {
    let response = await accounts.getDepositAddress({ id: 'id', token: 'token' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('ticker')
  })

})
