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

    sdk.api.resources.transactions.should.have.property('getOne')
    sdk.api.resources.transactions.should.have.property('getList')
    sdk.api.resources.transactions.should.have.property('send')
  })

  it('transactions.getOne() should fail if `userId` is not provided', async function () {
    let response = await sdk.transactions.getOne({
      accountId: '7a1e6a76-f7d0-4b8c-8c16-8972041c970a',
      txId: 'b2a020df-1057-4847-8aaf-eb1f524e3518'
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('userId')
  })

  it('transactions.getOne() should fail if `accountId` is not provided', async function () {
    let response = await sdk.transactions.getOne({
      userId: '35b6b5dd-90a4-478e-b7b4-8712370f3333',
      txId: 'b2a020df-1057-4847-8aaf-eb1f524e3518'
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('accountId')
  })

  it('transactions.getOne() should fail if `txId` is not provided', async function () {
    let response = await sdk.transactions.getOne({
      userId: '35b6b5dd-90a4-478e-b7b4-8712370f3333',
      accountId: '7a1e6a76-f7d0-4b8c-8c16-8972041c970a'
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('txId')
  })

  it('transactions.getList() should fail if `userId` is not provided', async function () {
    let response = await sdk.transactions.getList({
      accountId: '7a1e6a76-f7d0-4b8c-8c16-8972041c970a',
      currency: 'ETH',
      limit: 10
    }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('userId')
  })

  it('transactions.getList() should fail if `accountId` is not provided', async function () {
    let response = await sdk.transactions.getList({
      userId: '35b6b5dd-90a4-478e-b7b4-8712370f3333',
      currency: 'ETH',
      limit: 10
    }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('accountId')
  })

  it('transactions.getList() should fail if an invalid `limit` is provided', async function () {
    let response = await sdk.transactions.getList({ limit: 51 }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('limit')
  })

  it('transactions.getList() should fail if an invalid `cursor` is provided', async function () {
    let response = await sdk.transactions.getList({ cursor: 'not_a_valid_id' }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('cursor')
  })

  it('transactions.send() should fail if `userId` is not provided', async function () {
    let response = await sdk.transactions.send({
      accountId: '7a1e6a76-f7d0-4b8c-8c16-8972041c970a',
      currency: 'ETH',
      toAddress: '0x0DCFA5fBBCe44FfebcBd7D306fEa4F946eBaE535',
      amount: 0.1
    }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('userId')
  })

  it('transactions.send() should fail if `accountId` is not provided', async function () {
    let response = await sdk.transactions.send({
      userId: '35b6b5dd-90a4-478e-b7b4-8712370f3333',
      currency: 'ETH',
      toAddress: '0x0DCFA5fBBCe44FfebcBd7D306fEa4F946eBaE535',
      amount: 0.1
    }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('accountId')
  })

  it('transactions.send() should fail if `toAddress` is not provided', async function () {
    let response = await sdk.transactions.send({
      accountId: '7a1e6a76-f7d0-4b8c-8c16-8972041c970a',
      userId: '35b6b5dd-90a4-478e-b7b4-8712370f3333',
      currency: 'ETH',
      amount: 0.1
    }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('toAddress')
  })

  it('transactions.send() should fail if `amount` is not provided', async function () {
    let response = await sdk.transactions.send({
      accountId: '7a1e6a76-f7d0-4b8c-8c16-8972041c970a',
      userId: '35b6b5dd-90a4-478e-b7b4-8712370f3333',
      currency: 'ETH',
      toAddress: '0x0DCFA5fBBCe44FfebcBd7D306fEa4F946eBaE535',
    }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('amount')
  })
})
