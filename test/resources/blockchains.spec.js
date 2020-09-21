'use strict'

const sdk = require('../../src/sdk.js')
const mockApi = require('../mock/api.js')
require('should')

describe('Zabo SDK Blockchains Resource', () => {
  let blockchains

  it('should be instantiated during zabo.init()', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).catch(err => err).should.be.ok()

    sdk.api.should.be.ok()
    sdk.api.connect.should.be.a.Function()

    sdk.api.resources.should.have.property('blockchains')

    blockchains = await require('../../src/resources/blockchains')(mockApi)

    blockchains.should.have.property('getBlock')
    blockchains.should.have.property('getContract')
    blockchains.should.have.property('getTokens')
    blockchains.should.have.property('getBalances')
    blockchains.should.have.property('getTransactions')
    blockchains.should.have.property('getTransaction')
    blockchains.should.have.property('getTokenTransfers')
    blockchains.should.have.property('getTokenTransfer')
  })

  // blockchains.getBlock()
  it('blockchains.getBlock() should fail if `blockchain` is not provided', async function () {
    const response = await blockchains.getBlock()
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getBlock() should fail if `blockchain` is invalid', async function () {
    const response = await blockchains.getBlock('invalidBlockchain')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getBlock() should fail if `blockNumber` is not provided', async function () {
    const response = await blockchains.getBlock('ethereum')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockNumber')
  })

  it('blockchains.getBlock() should return one block', async function () {
    const response = await blockchains.getBlock('ethereum', 0)

    response.should.be.ok()
    response.should.have.properties(['number', 'hash', 'size', 'gas_limit', 'gas_used', 'transaction_count', 'timestamp'])
  })

  // blockchains.getContract()
  it('blockchains.getContract() should fail if `blockchain` is not provided', async function () {
    const response = await blockchains.getContract()
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getContract() should fail if `blockchain` is invalid', async function () {
    const response = await blockchains.getContract('invalidBlockchain')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getContract() should fail if `blockchain` is not supported', async function () {
    const response = await blockchains.getContract('bitcoin')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getContract() should fail if `address` is not provided', async function () {
    const response = await blockchains.getContract('ethereum')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('address')
  })

  it('blockchains.getContract() should return one contract', async function () {
    const response = await blockchains.getContract('ethereum', '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f')

    response.should.be.ok()
    response.should.have.properties(['address', 'bytecode'])
  })

  // blockchains.getTokens()
  it('blockchains.getTokens() should fail if `blockchain` is not provided', async function () {
    const response = await blockchains.getTokens()
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getTokens() should fail if `blockchain` is invalid', async function () {
    const response = await blockchains.getTokens('invalidBlockchain')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getTokens() should fail if `blockchain` is not supported', async function () {
    const response = await blockchains.getTokens('bitcoin')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getTokens() should fail if `tokenName` is not provided', async function () {
    const response = await blockchains.getTokens('ethereum')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('tokenName')
  })

  it('blockchains.getTokens() should return the list of tokens', async function () {
    const response = await blockchains.getTokens('ethereum', 'Wrapped Ether')

    response.should.be.ok()
    response.data.should.be.an.Array()
    response.data[0].should.have.properties(['contract', 'ticker', 'name', 'decimals', 'total_supply', 'is_erc20'])
  })

  // blockchains.getBalances()
  it('blockchains.getBalances() should fail if `blockchain` is not provided', async function () {
    const response = await blockchains.getBalances()
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getBalances() should fail if `blockchain` is invalid', async function () {
    const response = await blockchains.getBalances('invalidBlockchain')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getBalances() should fail if `address` is not provided', async function () {
    const response = await blockchains.getBalances('ethereum')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('address')
  })

  it('blockchains.getBalances() should return balances for the given address', async function () {
    const response = await blockchains.getBalances('ethereum', '0x62a6ebC0ac598819CCad368788F6d2357FaE0d9e')

    response.should.be.ok()
    response.data.should.be.an.Array()
    response.data[0].should.have.properties(['token', 'address', 'balance'])
  })

  // blockchains.getTransactions()
  it('blockchains.getTransactions() should fail if `blockchain` is not provided', async function () {
    const response = await blockchains.getTransactions()
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getTransactions() should fail if `blockchain` is invalid', async function () {
    const response = await blockchains.getTransactions('invalidBlockchain')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getTransactions() should fail if `address` is not provided', async function () {
    const response = await blockchains.getTransactions('ethereum')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('address')
  })

  it('blockchains.getTransactions() should return transactions for the given address', async function () {
    const response = await blockchains.getTransactions('ethereum', '0x4ae694344e7e4e5820c62aa9816b7aa61210eaba')

    response.should.be.ok()
    response.data.should.be.an.Array()
    response.data[0].should.have.properties(['hash', 'to_address', 'value', 'gas', 'gas_price', 'gas_used', 'input', 'status'])
  })

  // blockchains.getTransaction()
  it('blockchains.getTransaction() should fail if `blockchain` is not provided', async function () {
    const response = await blockchains.getTransaction()
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getTransaction() should fail if `blockchain` is invalid', async function () {
    const response = await blockchains.getTransaction('invalidBlockchain')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getTransaction() should fail if `transactionHash` is not provided', async function () {
    const response = await blockchains.getTransaction('ethereum')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('transactionHash')
  })

  it('blockchains.getTransaction() should return one transaction', async function () {
    const response = await blockchains.getTransaction('ethereum', '0x23170b29a16c3ed89a2d7514c2d6d0796e39a29184c52a0bb5aed6b404b78a83')

    response.should.be.ok()
    response.should.have.properties(['hash', 'block_number', 'from_address', 'to_address', 'value', 'gas', 'gas_price', 'gas_used', 'input', 'status'])
  })

  // blockchains.getTokenTransfers()
  it('blockchains.getTokenTransfers() should fail if `blockchain` is not provided', async function () {
    const response = await blockchains.getTokenTransfers()
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getTokenTransfers() should fail if `blockchain` is invalid', async function () {
    const response = await blockchains.getTokenTransfers('invalidBlockchain')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getTokenTransfers() should fail if `blockchain` is not supported', async function () {
    const response = await blockchains.getTokenTransfers('bitcoin')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getTokenTransfers() should fail if `address` is not provided', async function () {
    const response = await blockchains.getTokenTransfers('ethereum')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('address')
  })

  it('blockchains.getTokenTransfers() should return token transfers for the given address', async function () {
    const response = await blockchains.getTokenTransfers('ethereum', '0x4ae694344e7e4e5820c62aa9816b7aa61210eaba')

    response.should.be.ok()
    response.data.should.be.an.Array()
    response.data[0].should.have.properties(['transaction', 'token', 'from_address', 'to_address', 'value'])
  })

  // blockchains.getTokenTransfer()
  it('blockchains.getTokenTransfer() should fail if `blockchain` is not provided', async function () {
    const response = await blockchains.getTokenTransfer()
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getTokenTransfer() should fail if `blockchain` is invalid', async function () {
    const response = await blockchains.getTokenTransfer('invalidBlockchain')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getTokenTransfer() should fail if `blockchain` is not supported', async function () {
    const response = await blockchains.getTokenTransfer('bitcoin')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('blockchain')
  })

  it('blockchains.getTokenTransfer() should fail if `transactionHash` is not provided', async function () {
    const response = await blockchains.getTokenTransfer('ethereum')
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('transactionHash')
  })

  it('blockchains.getTokenTransfer() should return the token transfers for the given transaction hash', async function () {
    const response = await blockchains.getTokenTransfer('ethereum', '0x23170b29a16c3ed89a2d7514c2d6d0796e39a29184c52a0bb5aed6b404b78a83')

    response.should.be.ok()
    response.data.should.be.an.Array()
    response.data[0].should.have.properties(['transaction', 'token', 'from_address', 'to_address', 'value'])
  })
})
