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
 */

'use strict'

const uuidValidate = require('uuid-validate')
const utils = require('../utils')
const interfaces = require('../interfaces')
const { SDKError } = require('../err')

class Transactions {
  constructor(api) {
    this.api = api
    this.account = null
    this.interfaces = interfaces(api)

    this.txsListeners = {}
    this.checkInterval = setInterval(this._checkTransactions.bind(this), 50000)
  }

  _setAccount(account) {
    this.account = account
  }

  async _checkTransactions() {
    const txIds = Object.keys(this.txsListeners)

    if (txIds.length == 0) {
      return
    }

    for (let hash of txIds) {
      try {
        const transaction = await this.getOne({ txId: hash })
        this._onTransactionUpdate(hash, transaction)
        delete this.txsListeners[hash]
      } catch (err) {
        if (err.error_type !== 404) {
          throw err
        }
      }
    }
  }

  _onTransactionUpdate(hash, transaction) {
    if (!hash || !this.txsListeners[hash] || !transaction) {
      return
    }
    this.txsListeners[hash].call(this, transaction)
  }

  async getOne({ userId, accountId, txId } = {}) {
    if (utils.isNode()) {
      if (!userId) {
        throw new SDKError(400, '[Zabo] Missing `userId` parameter. See: https://zabo.com/docs#get-a-specific-transaction')
      } else if (!uuidValidate(userId, 4)) {
        throw new SDKError(400, '[Zabo] `userId` must be a valid UUID v4. See: https://zabo.com/docs#get-a-specific-transaction')
      } else if (!accountId) {
        throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#get-a-specific-transaction')
      } else if (!uuidValidate(accountId, 4)) {
        throw new SDKError(400, '[Zabo] `accountId` must be a valid UUID v4. See: https://zabo.com/docs#get-a-specific-transaction')
      } else if (!txId) {
        throw new SDKError(400, '[Zabo] Missing `txId` parameter. See: https://zabo.com/docs#get-a-specific-transaction')
      }

      try {
        return this.api.request('GET', `/users/${userId}/accounts/${accountId}/transactions/${txId}`)
      } catch (err) {
        throw new SDKError(err.error_type, err.message)
      }
    }

    if (!this.account.id) {
      throw new SDKError(400, '[Zabo] Not connected. See: https://zabo.com/docs#connecting-a-user')
    } else if (!txId) {
      throw new SDKError(400, '[Zabo] Missing `txId` parameter. See: https://zabo.com/docs#get-a-specific-transaction')
    }

    try {
      return this.api.request('GET', `/accounts/${this.account.id}/transactions/${txId}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

  async getList({ userId, accountId, currency = '', limit = 25, cursor = '' } = {}) {
    utils.validateListParameters(limit)

    if (cursor) {
      const timestamp = (new Date(cursor)).getTime()
      if (timestamp === 0 || isNaN(timestamp)) {
        throw new SDKError(400, '[Zabo] Values for `cursor` must be a valid `initiated_at` timestamp. See: https://zabo.com/docs#get-account-history')
      }
    }

    let url = null

    if (utils.isNode()) {
      if (!userId) {
        throw new SDKError(400, '[Zabo] Missing `userId` parameter. See: https://zabo.com/docs#get-account-history')
      } else if (!uuidValidate(userId, 4)) {
        throw new SDKError(400, '[Zabo] `userId` must be a valid UUID v4. See: https://zabo.com/docs#get-account-history')
      } else if (!accountId) {
        throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#get-account-history')
      } else if (!uuidValidate(accountId, 4)) {
        throw new SDKError(400, '[Zabo] `accountId` must be a valid UUID v4. See: https://zabo.com/docs#get-account-history')
      }

      url = `/users/${userId}/accounts/${accountId}/transactions?limit=${limit}&cursor=${cursor}`
      if (currency !== '') {
        url = `${url}&currency=${currency}`
      }
    } else {
      if (!this.account.id) {
        throw new SDKError(400, '[Zabo] Not connected. See: https://zabo.com/docs#connecting-a-user')
      }

      url = `/accounts/${this.account.id}/transactions?limit=${limit}&cursor=${cursor}`
      if (currency !== '') {
        url = `${url}&currency=${currency}`
      }
    }

    try {
      return this.api.request('GET', url)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

  async send({ userId, accountId, currency, toAddress, amount } = {}) {
    if (!toAddress) {
      throw new SDKError(400, '[Zabo] Missing `toAddress` parameter. See: https://zabo.com/docs#send-a-transaction')
    } else if (!currency) {
      throw new SDKError(400, '[Zabo] Missing `currency` parameter. See: https://zabo.com/docs#send-a-transaction')
    } else if (!amount) {
      throw new SDKError(400, '[Zabo] Missing `amount` parameter. See: https://zabo.com/docs#send-a-transaction')
    } else if (!accountId) {
      throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#send-a-transaction')
    } else if (!uuidValidate(accountId, 4)) {
      throw new SDKError(400, '[Zabo] `accountId` must be a valid UUID v4. See: https://zabo.com/docs#send-a-transaction')
    }

    amount = amount.toString()
    currency = currency.toUpperCase()

    if (utils.isNode()) {
      if (!userId) {
        throw new SDKError(400, '[Zabo] Missing `userId` parameter. See: https://zabo.com/docs#send-a-transaction')
      } else if (!uuidValidate(userId, 4)) {
        throw new SDKError(400, '[Zabo] `userId` must be a valid UUID v4. See: https://zabo.com/docs#send-a-transaction')
      }

      if (currency === 'HBAR') {
        const hederaAccount = await this.api.resources.users.getAccount({ userId, accountId })

        return this.interfaces['hedera'].sendTransaction({
          account: hederaAccount,
          currency,
          toAddress,
          amount,
          userId
        })
      }

      return this.api.request('POST', `/users/${userId}/accounts/${accountId}/transactions`, {
        to_address: toAddress,
        currency,
        amount
      })
    }

    if (!this.account.id) {
      throw new SDKError(400, '[Zabo] Account not connected. See: https://zabo.com/docs#connecting-a-user')
    } else if (this.account.wallet_provider.type !== 'private_key') {
      throw new SDKError(403, '[Zabo] At this moment we support transactions for self-custody wallets only. See: https://zabo.com/docs#send-a-transaction')
    }

    if (this.interfaces[this.account.wallet_provider.name]) {
      return this.interfaces[this.account.wallet_provider.name].sendTransaction({
        account: this.account,
        currency,
        toAddress,
        amount
      })
    }
  }

  onConfirmation (txId, callback) {
    if (!txId || typeof txId !== 'string') {
      throw new SDKError(400, '[Zabo] Missing `txId` parameter. See: https://zabo.com/docs#send-a-transaction')
    } else if (!callback || typeof callback !== 'function') {
      throw new SDKError(400, '[Zabo] Missing `callback` parameter. See: https://zabo.com/docs#send-a-transaction')
    }

    this.txsListeners[txId] = callback
  }
}

// Export class instance
module.exports = (api) => {
  let transactions = new Transactions(api)
  if (api.ethereum) {
    transactions.getOne = ({ txId } = {}) => { return api.ethereum.getTransaction(txId) }
    transactions.send = ({ toAddress, currency, amount } = {}) => { let tx = { toAddress, currency: (currency || 'ETH'), amount }; return api.ethereum.sendTransaction(tx) }
    transactions.getList = () => { throw new SDKError(400, '[Zabo] Not available in decentralized mode. See: https://zabo.com/docs#decentralized-mode') }
  }
  return transactions
}
