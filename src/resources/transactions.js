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
const { SDKError } = require('../err')

class Transactions {
  constructor(api) {
    this.api = api
    this.account = null
  }

  _setAccount(account) {
    this.account = account
  }

  async getTransaction({ userId, accountId, txId, currency } = {}) {
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
        return this.api.request('GET', `/users/${userId}/accounts/${accountId}/transactions/${txId}?currency=${currency}`)
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
      return this.api.request('GET', `/accounts/${this.account.id}/transactions/${txId}?currency=${currency}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

  async getTransactionHistory({ userId, accountId, currencyTicker, limit = 25, cursor = '' } = {}) {
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
      } else if (!currencyTicker) {
        throw new SDKError(400, '[Zabo] Missing `currencyTicker` parameter. See: https://zabo.com/docs#get-account-history')
      }

      url = `/users/${userId}/accounts/${accountId}/transactions?currency=${currencyTicker}&limit=${limit}&cursor=${cursor}`
    } else {
      if (!this.account.id) {
        throw new SDKError(400, '[Zabo] Not connected. See: https://zabo.com/docs#connecting-a-user')
      } else if (!currencyTicker) {
        throw new SDKError(400, '[Zabo] Missing `currencyTicker` parameter. See: https://zabo.com/docs#get-account-history')
      }

      url = `/accounts/${this.account.id}/transactions?currency=${currencyTicker}&limit=${limit}&cursor=${cursor}`
    }

    try {
      return this.api.request('GET', url)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

  async send({ userId, accountId, currency, toAddress, bytecode, amount }) {
    let url = ''

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

      if (currency.toLowerCase() == 'hbar') {
        let hederaAccount = await this.api.resources.users.getAccount({ userId, accountId })

        if (hederaAccount.wallet_provider.name == 'hedera') {
          url = getCryptoTransferLink({ userId, accountId, toAddress, amount })
        } else {
          throw new SDKError(403, '[Zabo] You need a `hedera` account to send `HBAR` transactions. See: https://zabo.com/docs#send-a-transaction')
        }
      }
    } else {
      if (!this.account.id) {
        throw new SDKError(400, '[Zabo] Not connected. See: https://zabo.com/docs#connecting-a-user')
      } else if (!toAddress) {
        throw new SDKError(400, '[Zabo] Missing `toAddress` parameter. See: https://zabo.com/docs#send-a-transaction')
      } else if (!amount) {
        throw new SDKError(400, '[Zabo] Missing `amount` parameter. See: https://zabo.com/docs#send-a-transaction')
      } else if (!amount) {
        throw new SDKError(400, '[Zabo] Missing `amount` parameter. See: https://zabo.com/docs#send-a-transaction')
      }

      if (currency.toLowerCase() == 'hbar') {
        if (this.account.wallet_provider.name == 'hedera') {
          url = getCryptoTransferLink({ accountId, toAddress, amount })
        } else {
          throw new SDKError(403, '[Zabo] You need a `hedera` account to send `HBAR` transactions. See: https://zabo.com/docs#send-a-transaction')
        }
      }
    }

    return this.api.request('GET', url)
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
  return new Transactions(api)
}
