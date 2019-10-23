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

const ethers = require('ethers')
const { ethereum } = require('../networks')
const { SDKError } = require('../err')

class Metamask {
  constructor() {
    this.ethereum = window.ethereum
    this.accounts = []
  }

  isSupported() {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask
  }

  async connect() {
    if (!this.isSupported()) { return }

    const accounts = await this.ethereum.enable()

    if (accounts.length == 0) {
      return null
    }

    accounts.forEach(a => {
      if (this.accounts.includes(a)) {
        return
      }

      this.accounts.push(a)
    })

    if (this.accounts[0] != accounts[0]) {
      this._onAccountSwitch(accounts[0])
    }

    return this.accounts[0]
  }

  onConnect(data) {
    console.log('[Zabo] Account connected with metamask.')
  }

  async sendTransaction(address, amount, currency = { ticker: 'ETH' }, options = {}) {
    let account = null

    if (this.accounts[0]) {
      account = this.accounts[0]
    } else {
      account = await this.connect()
      if (!account) {
        throw new SDKError(400, '[Zabo] Unable to sign transaction with metamask. Account connection refused.')
      }
    }

    if (!web3) {
      throw new SDKError(400, '[Zabo] Unable to sign transaction on metamask. More details at: https://zabo.com/docs')
    }

    let { gasPrice, gasLimit, nonce } = options
    gasLimit = gasLimit || 250000

    if (ethereum.node) {
      let network = await ethereum.node.getNetwork()

      // Sign transaction and send signed hash via the connected node.
      if (!gasPrice) {
        gasPrice = await ethereum.node.getGasPrice()
      }
      if (!nonce) {
        nonce = await ethereum.node.getTransactionCount(account)
      }

      // Build ans serialize transaction object to sign
      let tx = {
        gasLimit,
        gasPrice,
        nonce,
        chainId: network.chainId // Rinkeby
      }
      tx = this._completeTransactionObject(tx, address, amount, currency)

      // Unforunately the web3 API doesn't support promises just yet
      return new Promise(resolve => {
        let txHex = ethers.utils.serializeTransaction(tx)

        web3.personal.sign(txHex, account, async (err, signedTx) => {
          if (err) {
            throw new SDKError(400, `[Zabo] Unable to sign transaction on metamask. Error: ${err}`)
          }

          // let response = await ethereum.node.sendTransaction(signedTx)
          web3.eth.sendRawTransaction(signedTx, (err, response) => {
            if (err) {
              throw new SDKError(400, `[Zabo] Unable to push transaction to the ethereum network. Error: ${err}`)
            }

            return resolve(response)
          })
        })
      })
    } else {
      // Sign and send transaction via default Metamask flow. Note that 'nonce' is ignored by Metamask.
      if (!gasPrice) {
        gasPrice = 21000000000
      }

      // Build ans send transaction via Metamask
      let tx = { gasPrice, gasLimit, nonce }
      tx = this._completeTransactionObject(tx, address, amount, currency)

      // TODO: Push transaction to metamask using ethereum.sendAsync({ method: 'eth_sendTransaction' })
    }
  }

  _completeTransactionObject (tx, address, amount, currency) {
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
      tx.data = '0x'
      tx.value = ethers.utils.parseEther(amount) // convert eth amount to wei
    }
    return tx
  }

  _onAccountSwitch(account) {
    // TODO: Bubble event up to Zabo SDK and store new address in user's settings
  }
}

module.exports = () => {
  return new Metamask()
}
