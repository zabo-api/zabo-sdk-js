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
 * @description: Zabo bridge with Ledger USB Wallet
 */
'use strict'

require('regenerator-runtime')
const Interface = require('./Interface')
const utils = require('../utils')
const { SDKError } = require('../err')
const Btc = require('@ledgerhq/hw-app-btc').default
const Eth = require('@ledgerhq/hw-app-eth').default
const TransportWebUSB = require('@ledgerhq/hw-transport-webusb').default

class Ledger extends Interface {
  constructor (api) {
    super('Ledger', api)
    this._btcApp = null
    this._ethApp = null
  }

  static isSupported () {
    return utils.isBrowser() && TransportWebUSB.isSupported()
  }

  async sendTransaction ({ account, currency, toAddress, amount } = {}) {
    if (currency === 'ETH' || currency === 'BTC') {
      try {
        const response = await this.api.resources.utils.getBytecode({
          fromAddress: account.address,
          toAddress,
          amount,
          currency
        })

        const bytecode = response.bytecode[0]
        const txObj = response.tx_object || {}
        const signedTx = await this._signTransaction(bytecode, txObj, currency)

        return this.api.request('POST', `/accounts/${account.id}/transactions`, {
          currency,
          bytecode,
          signature: signedTx
        })
      } catch (err) {
        throw new SDKError(500, `[Zabo] Failed to send 'Ledger' transaction. Error: ${err}`)
      }
    }

    throw new SDKError(500, '[Zabo] Unable to send Ledger transactions at the moment.')
  }

  async _signTransaction (rawTx, txObj = {}, currency) {
    // Skip device connection
    if (process.env.NODE_ENV === 'test') {
      return {}
    }

    try {
      const transport = await TransportWebUSB.create()

      if (currency === 'ETH') {
        if (!this._ethApp) {
          this._ethApp = new Eth(transport)
        }

        return this._ethApp.signTransaction("44'/60'/0'/0/0", rawTx.replace(/^0x/, ''))
      }

      if (currency === 'BTC') {
        if (!this._btcApp) {
          this._btcApp = new Btc(transport)
        }

        let script = null

        const inputs = []
        txObj.tx.outputs.forEach(o => {
          inputs.push({
            prevout: Buffer.from(o.prev_hash),
            sequence: Buffer.from(o.sequence),
            script: Buffer.from(0)
          })
        })

        const outputs = []
        txObj.tx.outputs.forEach(o => {
          outputs.push({
            amount: Buffer.from(o.value),
            script: Buffer.from(o.script)
          })
          script = o.script
        })

        return this._btcApp.createPaymentTransactionNew(
          [[{
            inputs: inputs,
            outputs: outputs,
            version: Buffer.from(txObj.tx.ver),
            locktime: Buffer.from(0)
          }, 1]],
          ["0'/0/0"],
          undefined,
          script
        )
      }
    } catch (err) {
      console.log(`[Zabo] Error signing transaction: ${err}`)
      throw new SDKError(400, '[Zabo] Unable to sign transaction with ledger. More details at: https://zabo.com/docs')
    }
  }
}

module.exports = Ledger
