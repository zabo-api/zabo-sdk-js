'use strict'

const sdk = require('../../src/sdk.js')
const mockApi = require('../mock/api.js')
require('should')

describe('Zabo SDK Accounts Resource', () => {
  let accounts

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

    accounts = await require('../../src/resources/accounts')(mockApi)

    accounts.should.have.property('get')
    accounts.should.have.property('create')
    accounts.should.have.property('getBalances')
  })

  it('accounts.getBalances() should fail if an account has not connected yet', async function () {
    const response = await accounts.getBalances({ tickers: 'BTC' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(401)
    response.message.should.containEql('connected')
  })

  it('accounts.get() should return an account and cache account data', async function () {
    const account = await accounts.get()

    account.should.be.ok()
    account.should.have.properties(['id', 'provider', 'balances'])

    accounts.data.should.be.eql(account)
    accounts.id.should.be.equal(account.id)
  })

  it('accounts.create() should create and return a new account', async function () {
    const data = {
      clientId: 'some-client-id',
      credentials: ['some-credentials'],
      provider: 'some-provider',
      origin: 'some-origin'
    }

    const account = await accounts.create(data)

    account.should.be.ok()
    account.should.have.properties(['id', 'provider', 'balances'])
    account.provider.name.should.have.equal(data.provider)
  })

  it('accounts.getBalances() should return balances for the required tickers', async function () {
    const tickers = ['BTC', 'ETH']
    const balances = await accounts.getBalances({ tickers })

    balances.data.should.be.ok()
    balances.data.should.be.an.Array()

    const currencyTickers = balances.data.map(b => b.ticker)
    currencyTickers.should.containDeep(tickers)
  })

  it('accounts.createDepositAddress() should create and return an address', async function () {
    const resp = await accounts.createDepositAddress('BTC')

    resp.should.be.ok()
    resp.should.have.properties(['ticker', 'provider_ticker', 'address'])
  })

  it('accounts.getDepositAddresses() should return a list of addresses', async function () {
    const resp = await accounts.getDepositAddresses('BTC')

    resp.should.be.ok()
    resp.should.be.an.Array()
    resp[0].should.have.properties(['ticker', 'provider_ticker', 'address'])
  })
})
