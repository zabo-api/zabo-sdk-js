'use strict'

const should = require('should')
const sdk = require('../../src/index.js')

describe('Zabo SDK Users Resource', () => {

  it('should be instantiated during zabo.init()', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).should.be.ok()

    sdk.api.should.be.ok()
    sdk.api.connect.should.be.a.Function()

    sdk.api.resources.should.have.property('users')

    sdk.api.resources.users.should.have.property('create')
    sdk.api.resources.users.should.have.property('getUser')
    sdk.api.resources.users.should.have.property('getUsers')
    sdk.api.resources.users.should.have.property('getBalances')
  })

  it('users.create() should fail if an account `id` is missing', async function () {
    let response = await sdk.users.create({ token: 'token' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('id')
  })

  it('users.create() should fail if an account session `token` is missing', async function () {
    let response = await sdk.users.create({ id: 'id' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('token')
  })

  it('users.addAccount() should fail if a user `id` is missing', async function () {
    let response = await sdk.users.addAccount({}, { id: 'account id', token: 'token' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('user')
    response.message.should.containEql('id')
  })

  it('users.addAccount() should fail if an account `id` is missing', async function () {
    let response = await sdk.users.addAccount({ id: 'user id' }, { token: 'token' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('account')
    response.message.should.containEql('id')
  })

  it('users.addAccount() should fail if an account session `token` is missing', async function () {
    let response = await sdk.users.addAccount({ id: 'user id' }, { id: 'account id' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('account')
    response.message.should.containEql('token')
  })

  it('users.removeAccount() should fail if a user `id` is missing', async function () {
    let response = await sdk.users.removeAccount({}, { id: 'account id' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('user')
    response.message.should.containEql('id')
  })

  it('users.removeAccount() should fail if an account `id` is missing', async function () {
    let response = await sdk.users.removeAccount({ id: 'user id' }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('account')
    response.message.should.containEql('id')
  })

  it('users.getUser() should fail if an account id is missing', async function () {
    let response = await sdk.users.getUser().should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('id')
  })

  it('users.getUsers() should fail if an invalid `limit` is provided', async function () {
    let response = await sdk.users.getUsers({ limit: 51 }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('limit')
  })

  it('users.getUsers() should fail if an invalid `cursor` is provided', async function () {
    let response = await sdk.users.getUsers({ cursor: 'not_a_valid_id' }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('cursor')
  })

  it('users.getBalances() should fail if a `userId` is not provided', async function () {
    let response = await sdk.users.getBalances({
      accountId: 'not_an_account_id',
      tickers: ['BTC', 'ETH']
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('userId')
  })

  it('users.getBalances() should fail if an `accountId` is not provided', async function () {
    let response = await sdk.users.getBalances({
      userId: 'not_a_user_id',
      tickers: 'BTC'
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('accountId')
  })

  it('users.getBalances() should fail if a string or array of `tickers` are not provided', async function () {
    let response = await sdk.users.getBalances({
      accountId: 'not_an_account_id',
      userId: 'not_a_user_id'
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('tickers')
  })

})
