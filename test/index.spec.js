'use strict'

const should = require('should')

describe('Zabo SDK Module', () => {
  let sdk = null

  beforeEach(() => {
    sdk = require('../src/index.js')
  })

  it('should init properly', function () {
    sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox'
    })

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

  it('setEndpointAliases() should append API endpoints on the main SDK instance', async function () {
    this.timeout(1000)

    sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox'
    })

    sdk.status.should.be.ok()

    sdk.setEndpointAliases()

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
    sdk.walletProviders.should.have.property('getScopes')

    // currencies
    sdk.currencies.should.have.property('getCurrency')
    sdk.currencies.should.have.property('getCurrencies')
    sdk.currencies.should.have.property('getExchangeRates')

    // transactions
    sdk.transactions.should.have.property('getTransaction')
    sdk.transactions.should.have.property('getTransactionHistory')
  })

})
