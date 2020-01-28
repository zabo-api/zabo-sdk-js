/**
 * @Copyright (c) 2019-present, Zabo & Modular, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @description: Zabo account-related functions
 */

'use strict'

const ethers = require('ethers')
const utils = require('../utils')
const { SDKError } = require('../err')

class Ethereum {
  constructor () {
    this.node = null
    this.account = null
  }

  async connect (nodeUrl, useAddress) {
    if (!utils.isValidNodeUrl(nodeUrl)) {
      throw new SDKError(400, '[Zabo] For decentralized connections, please provide a valid node url as `useNode`. More details at: https://zabo.com/docs')
    }

    try {
      this.node = new ethers.providers.JsonRpcProvider(nodeUrl)
      this.data = {
        id: 'decentralized',
        wallet_provider: {
          name: 'ethereum-node',
          type: 'private_key',
          scopes: ['read_balances', 'read_transactions', 'create_deposit_address']
        }
      }
      const accounts = await this.node.listAccounts()
      if (useAddress) {
        if (accounts.includes(useAddress)) {
          this.data.address = useAddress
        } else {
          throw new SDKError(400, '[Zabo] Ethereum node address provided but not available from the node.')
        }
      } else {
        this.data.address = accounts[0]
      }

      // this.account = this.node.getSigner(accounts.pop())

      // TODO: Handle geth/parity account unlocks with password files
      // await this.account.unlock('')
    } catch (err) {
      throw new SDKError(400, `[Zabo] Failed to connect with geth or parity node. Error: ${err.message}`)
    }

    return this
  }

  async getBalance (currencies) {
    if ((currencies || []).length === 0) {
      currencies = ['ETH']
    } else if (currencies.length > 1) {
      throw new SDKError(400, '[Zabo] Can only request one balance at a time in decentralized mode.')
    }

    let result = null
    let currencyObj = { ticker: currencies[0].toUpperCase() }
    if (currencyObj.ticker !== 'ETH') {
      currencyObj = window['ERC_20_' + currencyObj.ticker]
    }
    if (!currencyObj) {
      throw new SDKError(400, `[Zabo] Requested currency ${currencies[0]} is not loaded.`)
    }
    if (currencyObj.ticker !== 'ETH') {
      currencyObj.type = 'ERC20'
      const txobj = utils.getTxObjectForEthereumRequest({ requestType: 'balanceOf', address: this.data.address, currency: currencyObj })
      result = await this.node.call(txobj)
    } else {
      result = await this.node.getBalance(this.data.address)
    }

    // TODO: Format response according to token decimal places
    return ethers.utils.formatEther(result)
  }

  async getTransaction (txHash) {
    if (!txHash || txHash === '') {
      throw new SDKError(400, '[Zabo] Did not provide a transaction hash and one is required.')
    }
    const rawTx = await this.node.getTransaction(txHash)
    const block = await this.node.getBlock(txHash.blockNumber)
    return this._transformRawTxToZaboTx(rawTx, block)
  }

  async sendTransaction ({ toAddress, amount, currency } = {}) {
    try {
      let currencyObj = {}
      if (currency !== 'ETH') {
        currencyObj = window['ERC_20_' + currency.toUpperCase()]
      } else {
        currencyObj = { ticker: 'ETH' }
      }
      const txobj = utils.getTxObjectForEthereumRequest({
        requestType: 'transfer',
        toAddress,
        amount,
        currency: currencyObj
      })
      const signer = this.node.getSigner(this.data.address)

      const rawTx = await signer.sendTransaction(txobj)
      const block = await this.node.getBlock(rawTx.blockNumber)
      return this._transformRawTxToZaboTx(rawTx, block, { currency: currency, amount: amount, to: toAddress })
    } catch (err) {
      console.error(err)
      throw new SDKError(400, '[Zabo] Unable to send transaction to ethereum node. Please review your inputs and try again.')
    }
  }

  _transformRawTxToZaboTx (rawTx, block, erc20Data) {
    // Hacking here, need to clean up after Waterloo and properly parse for erc20 transfers + return
    // ETH amount as decimal string instead of wei to conform to the API
    let currency
    let otherParty
    let amount = rawTx.value.toString()
    if (rawTx.data === '0x') {
      currency = 'wei'
      otherParty = rawTx.to
    } else if (erc20Data) {
      currency = erc20Data.currency
      amount = erc20Data.amount
      otherParty = erc20Data.to
    } else {
      currency = 'unknown'
      otherParty = rawTx.to
      if (amount === '0') {
        amount = 'unknown'
        otherParty = 'unknown'
      }
    }
    let txType
    if (rawTx.to === this.data.address) {
      txType = 'received'
    } else if (rawTx.from === this.data.address) {
      txType = 'sent'
    } else {
      if (erc20Data) {
        if (erc20Data.to === this.data.address) {
          txType = 'received'
        }
      }
      txType = 'unknown'
    }
    const zaboTx = {
      id: rawTx.hash,
      type: txType,
      from: rawTx.from,
      amount: amount,
      currency: currency,
      status: rawTx.confirmations > 0 ? 'completed' : 'pending',
      other_parties: [otherParty],
      initiated_at: block.timestamp,
      confirmed_at: rawTx.confirmations > 0 ? block.timestamp : null,
      rawTx: rawTx
    }
    return zaboTx
  }
}

module.exports = () => {
  return new Ethereum()
}
