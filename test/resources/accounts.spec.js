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
    }).catch(err => err).should.be.ok()

    sdk.api.should.be.ok()
    sdk.api.connect.should.be.a.Function()

    sdk.api.resources.should.not.have.property('accounts')

    accounts = await require('../../src/resources/accounts')(sdk.api)

    accounts.should.have.property('get')
    accounts.should.have.property('create')
    accounts.should.have.property('getBalances')
  })

  it('accounts.getBalances() should fail if an account has not connected yet', async function () {
    let response = await accounts.getBalances({ currencies: 'BTC' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(401)
    response.message.should.containEql('connected')
  })

  it('should initialize in decentralized mode', async function () {
    await sdk.init({
      decentralized: true,
      sendCryptoData: false
    }).should.be.ok()
  })
})
