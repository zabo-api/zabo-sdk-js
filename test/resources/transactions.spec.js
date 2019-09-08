'use strict'

const should = require('should')
const sdk = require('../../src/index.js')

describe('Zabo SDK Transactions Resource', () => {

  it('should be instantiated during zabo.init()', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).should.be.ok()

    sdk.api.should.be.ok()
    sdk.api.connect.should.be.a.Function()

    sdk.api.resources.should.have.property('transactions')

    sdk.api.resources.transactions.should.have.property('getTransaction')
    sdk.api.resources.transactions.should.have.property('getTransactionHistory')
    sdk.api.resources.transactions.should.have.property('getCryptoTransferLink')
  })

  it('transactions.getTransaction() should fail if `userId` is not provided', async function () {
    let response = await sdk.transactions.getTransaction({
      accountId: '7a1e6a76-f7d0-4b8c-8c16-8972041c970a',
      txId: 'b2a020df-1057-4847-8aaf-eb1f524e3518'
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('userId')
  })

  it('transactions.getTransaction() should fail if `accountId` is not provided', async function () {
    let response = await sdk.transactions.getTransaction({
      userId: '35b6b5dd-90a4-478e-b7b4-8712370f3333',
      txId: 'b2a020df-1057-4847-8aaf-eb1f524e3518'
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('accountId')
  })

  it('transactions.getTransaction() should fail if `txId` is not provided', async function () {
    let response = await sdk.transactions.getTransaction({
      userId: '35b6b5dd-90a4-478e-b7b4-8712370f3333',
      accountId: '7a1e6a76-f7d0-4b8c-8c16-8972041c970a'
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('txId')
  })

  it('transactions.getTransactionHistory() should fail if `userId` is not provided', async function () {
    let response = await sdk.transactions.getTransactionHistory({
      accountId: '7a1e6a76-f7d0-4b8c-8c16-8972041c970a',
      currencyTicker: 'ETH',
      limit: 10
    }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('userId')
  })

  it('transactions.getTransactionHistory() should fail if `accountId` is not provided', async function () {
    let response = await sdk.transactions.getTransactionHistory({
      userId: '35b6b5dd-90a4-478e-b7b4-8712370f3333',
      currencyTicker: 'ETH',
      limit: 10
    }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('accountId')
  })

  it('transactions.getTransactionHistory() should fail if `currencyTicker` is not provided', async function () {
    let response = await sdk.transactions.getTransactionHistory({
      userId: '35b6b5dd-90a4-478e-b7b4-8712370f3333',
      accountId: '7a1e6a76-f7d0-4b8c-8c16-8972041c970a',
      limit: 10
    }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('currencyTicker')
  })

  it('transactions.getTransactionHistory() should fail if an invalid `limit` is provided', async function () {
    let response = await sdk.transactions.getTransactionHistory({ limit: 51 }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('limit')
  })

  it('transactions.getTransactionHistory() should fail if an invalid `cursor` is provided', async function () {
    let response = await sdk.transactions.getTransactionHistory({ cursor: 'not_a_valid_id' }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('cursor')
  })

})
