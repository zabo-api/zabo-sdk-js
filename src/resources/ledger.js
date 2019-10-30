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
const regeneratorRuntime = require('regenerator-runtime')
const Btc = require('@ledgerhq/hw-app-btc').default
const Eth = require('@ledgerhq/hw-app-eth').default
const TransportWebUSB = require('@ledgerhq/hw-transport-webusb').default

class Ledger {
  constructor() {
    this.accounts = []

    this.eth = null
    this.btc = null
  }

  onConnect(data) {
    console.log('[Zabo] Account connected with ledger.')
  }

  async signTransaction(rawTx, txObj = {}, currency) {
    try {
      const transport = await TransportWebUSB.create()

      if (currency.toLowerCase() == 'eth') {
        if (!this.eth) {
          this.eth = new Eth(transport)
        }

        let result = await this.eth.signTransaction("44'/60'/0'/0/0", rawTx.replace(/^0x/, ''))
        return result
      }

      if (currency.toLowerCase() == 'btc') {
        if (!this.btc) {
          this.btc = new Btc(transport)
        }

        let script = null

        let inputs = []
        txObj.tx.outputs.forEach(o => {
          inputs.push({
            prevout: Buffer.from(o.prev_hash),
            sequence: Buffer.from(o.sequence),
            script: Buffer.from(0)
          })
        })

        let outputs = []
        txObj.tx.outputs.forEach(o => {
          outputs.push({
            amount: Buffer.from(o.value),
            script: Buffer.from(o.script)
          })
          script = o.script
        })

        let result = await this.btc.createPaymentTransactionNew(
          [ [{
            inputs: inputs,
            outputs: outputs,
            version: Buffer.from(txObj.tx.ver),
            locktime: Buffer.from(0)
          }, 1] ],
          ["0'/0/0"],
          undefined,
          script
        )

        return result
      }
    } catch (err) {
      console.log(`[Zabo] Ledger.signTransaction Error: ${err}`)
      throw new SDKError(400, '[Zabo] Unable to sign transaction with ledger. More details at: https://zabo.com/docs')
    }
  }

  _onAccountSwitch(account) {
    // TODO: Bubble event up to Zabo SDK and store new address in user's settings
  }
}

module.exports = () => {
  return new Ledger()
}
