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
const metamask = require('./metamask')()
const ledger = require('./ledger')()
const { SDKError } = require('../err')

class Transactions {
  constructor(api) {
    this.api = api
    this.account = null
  }

  _setAccount(account) {
    this.account = account
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
    utils.validateListParameters(limit, cursor)

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
    amount = amount.toString()

    if (utils.isNode()) {
      if (!userId) {
        throw new SDKError(400, '[Zabo] Missing `userId` parameter. See: https://zabo.com/docs#send-a-transaction')
      } else if (!uuidValidate(userId, 4)) {
        throw new SDKError(400, '[Zabo] `userId` must be a valid UUID v4. See: https://zabo.com/docs#send-a-transaction')
      } else if (!accountId) {
        throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#send-a-transaction')
      } else if (!uuidValidate(accountId, 4)) {
        throw new SDKError(400, '[Zabo] `accountId` must be a valid UUID v4. See: https://zabo.com/docs#send-a-transaction')
      } else if (!amount) {
        throw new SDKError(400, '[Zabo] Missing `amount` parameter. See: https://zabo.com/docs#send-a-transaction')
      }

      if (currency.toUpperCase() == 'HBAR') {
        let hederaAccount = await this.api.resources.users.getAccount({ userId, accountId })

        if (hederaAccount.wallet_provider.name == 'hedera') {
          let url = getCryptoTransferLink({ userId, accountId, toAddress, amount })
          return this.api.request('GET', url)
        } else {
          throw new SDKError(403, '[Zabo] You need a `hedera` account to send `HBAR` transactions. See: https://zabo.com/docs#send-a-transaction')
        }
      }

      return this.api.request('POST', `/users/${userId}/accounts/${accountId}/transactions`, {
        to_address: toAddress,
        currency,
        amount
      })
    }

    if (!toAddress) {
      throw new SDKError(400, '[Zabo] Missing `toAddress` parameter. See: https://zabo.com/docs#send-a-transaction')
    } else if (!amount) {
      throw new SDKError(400, '[Zabo] Missing `amount` parameter. See: https://zabo.com/docs#send-a-transaction')
    } else if (!currency) {
      throw new SDKError(400, '[Zabo] Missing `currency` parameter. See: https://zabo.com/docs#send-a-transaction')
    }

    if (!this.account.id) {
      throw new SDKError(400, '[Zabo] Account not connected. See: https://zabo.com/docs#connecting-a-user')
    }

    currency = currency.toUpperCase()

    if (currency == 'HBAR') {
      if (this.account.wallet_provider.name == 'hedera') {
        let url = getCryptoTransferLink({ accountId, toAddress, amount })
        return this.api.request('GET', url)
      } else {
        throw new SDKError(403, '[Zabo] You need a `hedera` account to send `HBAR` transactions. See: https://zabo.com/docs#send-a-transaction')
      }
    }

    if (this.account.wallet_provider.type != 'private_key') {
      throw new SDKError(403, '[Zabo] At this moment we support transactions for self-custody wallets only. See: https://zabo.com/docs#send-a-transaction')
    }

    const currencyObj = await this.api.resources.currencies.getOne(currency)

    if (this.account.wallet_provider.name == 'metamask') {
      if (!metamask.isSupported()) {
        throw new SDKError(403, '[Zabo] Metamask not installed.')
      }

      try {
        let hash = await metamask.sendTransaction({ address: toAddress, currency: currencyObj, amount })
        await utils.sleep(50000)
        let transaction
        try {
          transaction = await this.getOne({ txId: hash })
          return transaction
        } catch (e) {
          if (e.error_type === 404) {
            await utils.sleep(50000)
            try {
              transaction = await this.getOne({ txId: hash })
              return transaction
            } catch (e) {
              if (e.error_type === 404) {
                return { id: hash }
              }
              throw e
            }
          }
          throw e
        }

      } catch (err) {
        throw new SDKError(500, `[Zabo] Failed to send 'Metamask' transaction. Error: ${err}`)
      }
    } else if (this.account.wallet_provider.name == 'ledger') {
      if (currency == 'ETH' || currency == 'BTC') {
        try {
          let response = await this.api.resources.utils.getBytecode({
            fromAddress: this.account.address,
            toAddress,
            amount,
            currency
          })

          let bytecode = response.bytecode.pop()
          let txObj = response.tx_object || {}
          let signedTx = await ledger.signTransaction(bytecode, txObj, currency)

          return this.api.request('POST', `/accounts/${this.account.id}/transactions`, {
            currency,
            bytecode: response.bytecode,
            signature: signedTx
          })
        } catch (err) {
          throw new SDKError(500, `[Zabo] Failed to send 'Ledger' transaction. Error: ${err}`)
        }
      }

      throw new SDKError(500, `[Zabo] Unable to send Ledger transactions at the moment.`)
    }
  }
}

// Private functions
const getCryptoTransferLink = async function ({ userId, accountId, toAddress, amount, note } = {}) {
  if (!note) {
    note = ''
  } else {
    note = encodeURIComponent(note)
  }

  if (utils.isNode()) {
    url = `/users/${userId}/accounts/${accountId}/transfer-request?to_address=${toAddress}&amount=${amount}&note=${note}`
  } else {
    url = `/accounts/${accountId}/transfer-request?to_address=${toAddress}&amount=${amount}&note=${note}`
  }

  return url
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
