/**
 * Copyright (c) 2019-present, Zabo & Modular, Inc. All rights reserved.
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
 *
 * @description: Zabo bridge with Metamask
 */
'use strict'

const Interface = require('./Interface')
const utils = require('../utils')
const { SDKError } = require('../err')

class Metamask extends Interface {
  constructor (api) {
    super('Metamask', api)
    this._accounts = []
  }

  static isSupported () {
    return utils.isBrowser() && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask
  }

  async sendTransaction ({ account, currency, toAddress, amount } = {}) {
    currency = await this.api.resources.currencies.getOne(currency)

    if (!window || !window.web3) {
      throw new SDKError(400, '[Zabo] Unable to sign transaction on metamask. More details at: https://zabo.com/docs')
    }

    try {
      const metamaskAddress = await this._connect()

      if (!metamaskAddress) {
        throw new SDKError(400, '[Zabo] Unable to sign transaction with metamask. Account connection refused.')
      }

      if (metamaskAddress !== account.address) {
        throw new SDKError(403, 'Make sure you have the right account selected on your Metamask plugin.')
      }

      const tx = utils.getTxObjectForEthereumRequest({
        requestType: 'transfer',
        toAddress,
        amount,
        currency
      })
      tx.from = metamaskAddress

      // Unforunately, web3 doesn't support promises just yet.
      const hash = await new Promise((resolve, reject) => {
        window.web3.eth.sendTransaction(tx, (err, txHash) => {
          if (err) return reject(err)
          resolve(txHash)
        })
      })

      return {
        id: hash,
        currency: currency.ticker,
        amount,
        other_parties: [toAddress],
        type: 'send',
        status: 'pending'
      }
    } catch (err) {
      throw new SDKError(err.error_type || 500, `[Zabo] Failed to send 'Metamask' transaction. Error: ${err}`)
    }
  }

  async _connect () {
    const accounts = await window.ethereum.enable()

    if (accounts.length === 0) {
      return null
    }

    accounts.forEach(a => {
      if (this._accounts.includes(a)) {
        return
      }

      this._accounts.push(a)
    })

    if (this._accounts[0] !== accounts[0]) {
      this._onAccountSwitch(accounts[0])
    }

    return this._accounts[0]
  }

  _onAccountSwitch (account) {
    // TODO: Bubble event up to Zabo SDK and store new address in user's settings
  }
}

module.exports = Metamask
