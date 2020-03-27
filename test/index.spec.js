'use strict'

const sdk = require('../src/sdk.js')
require('should')

describe('Zabo SDK Module', () => {
  it('should init properly', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox'
    }).should.be.rejected()

    sdk.status.should.be.ok()
    sdk.status.should.equal('connecting')
  })

  it('init() should throw an error if an argument is missing', async function () {
    this.timeout(1000)

    await sdk.init({
      apiKey: 'some-api-key',
      env: 'sandbox'
    }).should.be.rejected()

    sdk.status.should.equal('offline')
  })

  it('should just init and not try to connect if autoConnect is set to false', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).catch(err => err).should.be.ok()

    sdk.status.should.be.ok()
    sdk.status.should.equal('offline')
  })

  it('should enable zabo.connect() to be called when autoConnect is set to false', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).catch(err => err).should.be.ok()

    sdk.connect.should.be.a.Function()
  })

  it('setEndpointAliases() should append API endpoints on the main SDK instance', async function () {
    this.timeout(1000)

    sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).catch(err => err)

    sdk.status.should.be.ok()

    // users
    sdk.users.should.have.property('create')
    sdk.users.should.have.property('getOne')
    sdk.users.should.have.property('getList')
    sdk.users.should.have.property('getBalances')

    // providers
    sdk.providers.should.have.property('getList')
    sdk.providers.should.have.property('getOne')

    // currencies
    sdk.currencies.should.have.property('getOne')
    sdk.currencies.should.have.property('getList')
    sdk.currencies.should.have.property('getExchangeRates')

    // transactions
    sdk.transactions.should.have.property('getOne')
    sdk.transactions.should.have.property('getList')
  })

  it('should initialize in decentralized mode', async function () {
    await sdk.init({
      decentralized: true,
      sendCryptoData: false
    }).should.be.ok()
  })
})
