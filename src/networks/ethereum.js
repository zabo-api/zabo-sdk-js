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
  constructor(api) {
    this.node = null
    this.account = null
  }

  async connect (nodeIpcPath) {
    if (!utils.isValidNodeUrl(nodeIpcPath)) {
      throw new SDKError(400, '[Zabo] For decentralized connections, please provide a valid node url as `useNode`. More details at: https://zabo.com/docs')
    }

    try {
      // this.node = new ethers.providers.JsonRpcProvider(nodeUrl)
      this.node = new ethers.providers.IpcProvider(nodeIpcPath)

      const accounts = await this.node.listAccounts()
      this.account = this.node.getSigner(accounts.pop())

      // TODO: Handle geth/parity account unlocks with password files
      await this.account.unlock('')
    } catch (err) {
      throw new SDKError(400, `[Zabo] Failed to connect with geth or parity node. Error: ${err.message}`)
    }

    return 'online'
  }

  async getBalance(address, currency = { ticker: 'ETH' }) {
    this.validateAddress(address)

    let result = null

    if (currency && currency.ticker != 'ETH') {
      const obj =  utils.getDataObjectForEthereumRequest({ requestType: 'balanceOf', address, currency })
      result = await this.node.call({ to: currency.address, data: obj.data })
    } else {
      result = await this.node.getBalance(address)
    }

    // TODO: Format response according to token decimal places
    return ethers.utils.formatEther(result)
  }

  async sendTransaction(address, amount, currency = { ticker: 'ETH' }) {
    this.validateAddress(address)

    let gasPrice = await this.node.getGasPrice()
    let tx = { gasPrice, gasLimit: 250000 }

    if (currency && currency.ticker != 'ETH') {
      const obj = utils.getDataObjectForEthereumRequest({
        requestType: 'transfer',
        address,
        amount,
        currency
      })
      tx.to = currency.address
      tx.data = obj.data
    } else {
      tx.to = address
      tx.value = ethers.utils.parseEther(amount) // convert eth amount to wei
    }

    return this.account.sendTransaction(tx)
  }

  validateAddress (address) {
    if (address && address.length === 42) { return }
    throw new SDKError(400, '[Zabo] Please provide a valid ethereum address. More details at: https://zabo.com/docs')
  }
}

module.exports = () => {
  return new Ethereum()
}
