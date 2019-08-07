'use strict'

const should = require('should')
const sdk = require('../src/index.js')

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
      env: 'sandbox',
    }).should.be.rejected()

    sdk.status.should.equal('offline')
  })

  it('should just init and not try to connect if autoConnect is set to false', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).should.be.ok()

    sdk.status.should.be.ok()
    sdk.status.should.equal('offline')
  })

  it('should enable zabo.connect() to be called when autoConnect is set to false', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).should.be.ok()

    sdk.connect.should.be.a.Function()
  })

  it('setEndpointAliases() should append API endpoints on the main SDK instance', async function () {
    this.timeout(1000)

    sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    })

    sdk.status.should.be.ok()

    // users
    sdk.users.should.have.property('create')
    sdk.users.should.have.property('getUser')
    sdk.users.should.have.property('getUsers')
    sdk.users.should.have.property('getBalances')

    // applications
    sdk.applications.should.have.property('getApplication')

    // wallet providers
    sdk.walletProviders.should.have.property('getWalletProviders')
    sdk.walletProviders.should.have.property('getWalletProvider')

    // currencies
    sdk.currencies.should.have.property('getCurrency')
    sdk.currencies.should.have.property('getCurrencies')
    sdk.currencies.should.have.property('getExchangeRates')

    // transactions
    sdk.transactions.should.have.property('getTransaction')
    sdk.transactions.should.have.property('getTransactionHistory')
  })

})
