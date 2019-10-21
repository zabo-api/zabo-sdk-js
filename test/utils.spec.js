'use strict'

const should = require('should')
const bigInt = require("big-integer")
const utils = require('../src/utils.js')

const defaultERC20GasLimit = "0x3d090"
const defaultETHGasLimit = "0x5208"
const defaultGasPrice = "0x4e3b29200"
const transferFuncHash = "0xa9059cbb"
const balanceFuncHash = "0x70a08231"

describe('Zabo SDK Utils', () => {

  it('should error with a bad address', async function () {
    let requestType = 'transfer'
    let address = '0x7580ba923c01783115d79975d6a41b3d38eff8d51'
    let currency = {
      "ticker": "DAI",
      "name": "Dai",
      "type": "ERC20",
      "logo": "https://zabo-static.s3.amazonaws.com/currencies/DAI.png",
      "priority": 5,
      "decimals": 18,
      "address": "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
      "resource_type": "currency"
    }
    let amount = "24.693037"

    should(() => utils.getDataObjectForEthereumRequest({ requestType, address, currency, amount, options: {} }))
      .throw(utils.ErrorMessages.invalidAddress)
  })

  it('should reject an invalid amount', async function () {
    let requestType = 'transfer'
    let address = '0x7580ba923c01783115d79975d6a41b3d38eff8d5'
    let currency = {
      "ticker": "DAI",
      "name": "Dai",
      "type": "ERC20",
      "logo": "https://zabo-static.s3.amazonaws.com/currencies/DAI.png",
      "priority": 5,
      "decimals": 18,
      "address": "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
      "resource_type": "currency"
    }
    let amount = "24.69303.7"

    should(() => utils.getDataObjectForEthereumRequest({ requestType, address, currency, amount, options: {} }))
      .throw(utils.ErrorMessages.invalidAmount)
  })

  it('should reject an invalid amount', async function () {
    let requestType = 'transfer'
    let address = '0x7580ba923c01783115d79975d6a41b3d38eff8d5'
    let currency = {
      "ticker": "NOT",
      "name": "Funny",
      "type": "ERC20",
      "decimals": 0,
      "resource_type": "currency"
    }
    let amount = "24.693037"

    should(() => utils.getDataObjectForEthereumRequest({ requestType, address, currency, amount, options: {} }))
      .throw(utils.ErrorMessages.invalidAmount)
  })

  it('should obtain a proper data object for a proper ERC20 transfer request', async function () {
    let requestType = 'transfer'
    let address = '0x7580ba923c01783115d79975d6a41b3d38eff8d5'
    let currency = {
      "ticker": "DAI",
      "name": "Dai",
      "type": "ERC20",
      "logo": "https://zabo-static.s3.amazonaws.com/currencies/DAI.png",
      "priority": 5,
      "decimals": 18,
      "address": "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
      "resource_type": "currency"
    }
    let amount = "24.693037"
    let amountInInt = "24693037000000000000"

    let dataObject = utils.getDataObjectForEthereumRequest({ requestType, address, currency, amount, options: {} })
    let derivedData = transferFuncHash +
      address.replace(/^0x/, '').padStart(64, 0) +
      bigInt(amountInInt).toString(16).padStart(64, 0)

    dataObject.should.be.ok()
    dataObject.should.be.an.Object()

    dataObject.should.have.property('value')
    dataObject.should.have.property('gasLimit')
    dataObject.should.have.property('gasPrice')

    dataObject.value.should.be.equal('0x00')
    dataObject.gasLimit.should.be.equal(defaultERC20GasLimit)
    dataObject.gasPrice.should.be.equal(defaultGasPrice)
    dataObject.data.should.be.equal(derivedData)
  })

  it('should obtain a proper data object for a proper Ether transfer request', async function () {
    let requestType = 'transfer'
    let address = '0x7580ba923c01783115d79975d6a41b3d38eff8d5'
    let currency = {
      "ticker": "ETH",
      "name": "Ether",
      "type": "Account",
      "logo": "https://zabo-static.s3.amazonaws.com/currencies/ETH.png",
      "priority": 2,
      "decimals": 18,
      "address": "0x0000000000000000000000000000000000000000",
      "resource_type": "currency"
    }
    let amount = "2.693037"
    let weiAmountInHex = "0x255f96e217fbd000"

    let dataObject = utils.getDataObjectForEthereumRequest({ requestType, address, currency, amount, options: {} })
    let derivedData = ""

    dataObject.should.be.ok()
    dataObject.should.be.an.Object()

    dataObject.should.have.property('value')
    dataObject.should.have.property('gasLimit')
    dataObject.should.have.property('gasPrice')

    dataObject.value.should.be.equal(weiAmountInHex)
    dataObject.gasLimit.should.be.equal(defaultETHGasLimit)
    dataObject.gasPrice.should.be.equal(defaultGasPrice)
    dataObject.data.should.be.equal(derivedData)
  })

  it('should obtain a proper data object for an ERC20 balance request', async function () {
    let requestType = 'balanceOf'
    let address = '0x7580ba923c01783115d79975d6a41b3d38eff8d5'
    let currency = {
      "ticker": "DAI",
      "name": "Dai",
      "type": "ERC20",
      "logo": "https://zabo-static.s3.amazonaws.com/currencies/DAI.png",
      "priority": 5,
      "decimals": 18,
      "address": "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
      "resource_type": "currency"
    }

    let dataObject = utils.getDataObjectForEthereumRequest({ requestType, address, currency })
    let derivedData = balanceFuncHash + address.replace(/^0x/, '').padStart(64, 0)

    dataObject.should.be.ok()
    dataObject.should.be.an.Object()

    dataObject.should.not.have.property('value')
    dataObject.should.have.property('data')

    dataObject.data.should.be.equal(derivedData)
  })
})
