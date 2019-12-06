'use strict'

const should = require('should')
const sdk = require('../../src/sdk.js')
const mockApi = require('../mock/api.js')

describe('Zabo SDK Users Resource', () => {
  let users
  let user

  it('should be instantiated during zabo.init()', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).catch(err => err).should.be.ok()

    sdk.api.should.be.ok()
    sdk.api.connect.should.be.a.Function()

    sdk.api.resources.should.have.property('users')

    users = await require('../../src/resources/users')(mockApi)

    users.should.have.property('create')
    users.should.have.property('getOne')
    users.should.have.property('getList')
    users.should.have.property('getBalances')
  })

  it('users.create() should fail if an account `id` is missing', async function () {
    let response = await users.create({ token: 'token' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('id')
  })

  it('users.create() should fail if an account session `token` is missing', async function () {
    let response = await users.create({ id: 'id' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('token')
  })

  it('users.addAccount() should fail if a user `id` is missing', async function () {
    let response = await users.addAccount({}, { id: 'account id', token: 'token' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('user')
    response.message.should.containEql('id')
  })

  it('users.addAccount() should fail if an account `id` is missing', async function () {
    let response = await users.addAccount({ id: 'user id' }, { token: 'token' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('account')
    response.message.should.containEql('id')
  })

  it('users.addAccount() should fail if an account session `token` is missing', async function () {
    let response = await users.addAccount({ id: 'user id' }, { id: 'account id' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('account')
    response.message.should.containEql('token')
  })

  it('users.removeAccount() should fail if a user `id` is missing', async function () {
    let response = await users.removeAccount({ accountId: 'account id' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('user')
    response.message.should.containEql('id')
  })

  it('users.removeAccount() should fail if an account `id` is missing', async function () {
    let response = await users.removeAccount({ userId: 'user id' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('account')
    response.message.should.containEql('id')
  })

  it('users.getOne() should fail if an account id is missing', async function () {
    let response = await users.getOne().should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('id')
  })

  it('users.getList() should fail if an invalid `limit` is provided', async function () {
    let response = await users.getList({ limit: 51 }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('limit')
  })

  it('users.getList() should fail if an invalid `cursor` is provided', async function () {
    let response = await users.getList({ cursor: 'not_a_valid_id' }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('cursor')
  })

  it('users.getBalances() should fail if a `userId` is not provided', async function () {
    let response = await users.getBalances({
      accountId: 'not_an_account_id',
      currencies: ['BTC', 'ETH']
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('userId')
  })

  it('users.getBalances() should fail if an `accountId` is not provided', async function () {
    let response = await users.getBalances({
      userId: 'not_a_user_id',
      currencies: 'BTC'
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('accountId')
  })

  it('users.getBalances() should fail if a string or array of `currencies` are not provided', async function () {
    let response = await users.getBalances({
      accountId: 'not_an_account_id',
      userId: 'not_a_user_id'
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('currencies')
  })

  it('users.getList() should return the list of users', async function () {
    let list = await users.getList()

    list.should.be.ok()
    list.data.should.be.an.Array()
    list.data[0].should.have.properties([ 'id', 'accounts' ])
  })

  it('users.create() should create and return a new user', async function () {
    const account = {
      id: "some-account-id",
      token: "some-token",
      address: "some-address",
      wallet_provider: { name: "some-wallet-provider" },
    }
    
    user = await users.create(account)
    
    user.should.be.ok()
    user.should.have.properties([ "id", "application", "accounts" ])
  })

  it('users.getOne() should return one user', async function () {
    let resp = await users.getOne(user.id)

    resp.should.be.ok()
    resp.should.have.properties([ 'id', 'accounts' ])
    resp.id.should.be.eql(user.id)
  })
  
  it('users.addAccount() should add an account to the user', async function () {
    const newAccount = {
      id: "some-account-id",
      token: "some-token",
      address: "some-address",
      wallet_provider: { name: "some-wallet-provider" },
    }
    
    user = await users.addAccount(user, newAccount)
    
    user.should.be.ok()
    user.should.have.properties([ "id", "application", "accounts" ])
    user.accounts.should.matchAny(a => a.id.should.be.eql(newAccount.id))
  })

  it('users.removeAccount() should remove an account from the user', async function () {
    const data = {
      userId: user.id,
      accountId: user.accounts[0].id
    }

    user = await users.removeAccount(data)

    user.should.be.ok()
    user.should.have.properties([ "id", "application", "accounts" ])
    user.accounts.should.not.matchAny(a => a.id.should.be.eql(data.accountId))
  })

  it('users.getAccount() should return an account', async function () {
    const data = {
      userId: '17c0f27e-9916-4ace-b8ca-18d1be2cff43',
      accountId: 'ff0dc466-547b-45f6-a34c-f45463489e2f'
    }
    const account = await users.getAccount(data)

    account.should.be.ok()
    account.should.have.properties([ "id", "address", "wallet_provider", "currencies" ])
  })

  it('users.getBalances() should return balances for the required currencies', async function () {
    const data = {
      userId: '17c0f27e-9916-4ace-b8ca-18d1be2cff43',
      accountId: 'ff0dc466-547b-45f6-a34c-f45463489e2f',
      currencies: [ 'BTC', 'ETH' ]
    }
    const balances = await users.getBalances(data)

    balances.data.should.be.ok()
    balances.data.should.be.an.Array()

    const tickers = balances.data.map(b => b.currency)
    tickers.should.containDeep(data.currencies)
  })

  it('users.createDepositAddress() should create and return an address', async function () {
    const data = {
      userId: '17c0f27e-9916-4ace-b8ca-18d1be2cff43',
      accountId: 'ff0dc466-547b-45f6-a34c-f45463489e2f',
      currency: 'BTC'
    }
    const resp = await users.createDepositAddress(data)

    resp.should.be.ok()
    resp.should.have.properties([ 'currency', 'address' ])
  })
  
  it('users.getDepositAddresses() should return a list of addresses', async function () {
    const data = {
      userId: '17c0f27e-9916-4ace-b8ca-18d1be2cff43',
      accountId: 'ff0dc466-547b-45f6-a34c-f45463489e2f',
      currency: 'BTC'
    }
    const resp = await users.getDepositAddresses(data)
    
    resp.should.be.ok()
    resp.should.be.an.Array()
    resp[0].should.have.properties([ 'currency', 'address' ])
  })
})
