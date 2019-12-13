'use strict'

const should = require('should')
const sdk = require('../../src/sdk.js')
const mockApi = require('../mock/api.js')

describe('Zabo SDK Accounts Resource', () => {
  const originalGlobal = global
  let accounts

  it('should be instantiated during zabo.init()', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).catch(err => err).should.be.ok()

    sdk.api.should.be.ok()
    sdk.api.connect.should.be.a.Function()

    sdk.api.resources.should.have.property('accounts')

    accounts = await require('../../src/resources/accounts')(mockApi)

    accounts.should.have.property('get')
    accounts.should.have.property('create')
    accounts.should.have.property('getBalances')
    accounts.should.have.property('createDepositAddress')
    accounts.should.have.property('getDepositAddresses')
  })

  it('accounts.get() should not be available in the server SDK', async function () {
    const response = await accounts.get().should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('Not available')
  })

  it('accounts.create() should not be available in the server SDK', async function () {
    const response = await accounts.create({}).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('Not available')
  })

  it('accounts.getBalances() should fail if an account has not connected yet', async function () {
    // Mock DOM
    require('jsdom-global')()
    global = undefined

    let response = await accounts.getBalances({ currencies: 'BTC' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(401)
    response.message.should.containEql('connected')
  })

  it('accounts.get() should return an account and cache account data', async function () {
    const account = await accounts.get()

    account.should.be.ok()
    account.should.have.properties([ "id", "address", "wallet_provider", "currencies" ])
    
    accounts.data.should.be.eql(account)
    accounts.id.should.be.equal(account.id)
  })

  it('accounts.create() should create and return a new account', async function () {
    const data = {
      clientId: 'some-client-id',
      credentials: [ 'some-credentials' ],
      provider: 'some-provider',
      origin: 'some-origin'
    }

    const account = await accounts.create(data)

    account.should.be.ok()
    account.should.have.properties([ "id", "address", "wallet_provider", "currencies" ])
    account.wallet_provider.name.should.have.equal(data.provider)
  })

  it('accounts.getBalances() should return balances for the required currencies', async function () {
    const currencies = [ 'BTC', 'ETH' ]
    const balances = await accounts.getBalances({ currencies })

    balances.data.should.be.ok()
    balances.data.should.be.an.Array()

    const tickers = balances.data.map(b => b.currency)
    tickers.should.containDeep(currencies)
  })

  it('accounts.createDepositAddress() should create and return an address', async function () {
    const data = {
      currency: 'BTC'
    }

    const resp = await accounts.createDepositAddress(data)

    resp.should.be.ok()
    resp.should.have.properties([ 'currency', 'address' ])
  })

  it('accounts.getDepositAddresses() should return a list of addresses', async function () {
    const data = {
      currency: 'BTC'
    }

    const resp = await accounts.getDepositAddresses(data)

    resp.should.be.ok()
    resp.should.be.an.Array()
    resp[0].should.have.properties([ 'currency', 'address' ])

    // Undo mock DOM
    global = originalGlobal
  })

  it('accounts.createDepositAddress() should create and return an address for a specific account', async function () {
    const data = {
      accountId: '7a1e6a76-f7d0-4b8c-8c16-8972041c970a',
      currency: 'BTC'
    }

    const resp = await accounts.createDepositAddress(data)

    resp.should.be.ok()
    resp.should.have.properties([ 'currency', 'address' ])
  })

  it('accounts.getDepositAddresses() should return a list of addresses for a specific account', async function () {
    const data = {
      accountId: '7a1e6a76-f7d0-4b8c-8c16-8972041c970a',
      currency: 'BTC'
    }

    const resp = await accounts.getDepositAddresses(data)

    resp.should.be.ok()
    resp.should.be.an.Array()
    resp[0].should.have.properties([ 'currency', 'address' ])
  })
})
