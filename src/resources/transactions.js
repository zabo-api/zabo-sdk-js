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
  constructor (api) {
    this.api = api
    this.account = null
  }

  _setAccount (account) {
    this.account = account
  }

  async getOne ({ userId, accountId, txId } = {}) {
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

  async getList ({ userId, accountId, currency = '', limit = 25, cursor = '' } = {}) {
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

  async send () {
    console.warn('This method was deprecated in version 0.8. See: https://zabo.com/docs#send-a-transaction')
    throw new SDKError(400, '[Zabo] Not supported for this wallet provider. See: https://zabo.com/docs/#unsupported-functions')
  }

  onConfirmation () {
    console.warn('This method was deprecated in version 0.8. See: https://zabo.com/docs#send-a-transaction')
    throw new SDKError(400, '[Zabo] Not supported for this wallet provider. See: https://zabo.com/docs/#unsupported-functions')
  }
}

// Export class instance
module.exports = (api) => {
  const transactions = new Transactions(api)
  if (api.ethereum) {
    transactions.getOne = ({ txId } = {}) => { return api.ethereum.getTransaction(txId) }
    transactions.getList = () => { throw new SDKError(400, '[Zabo] Not available in decentralized mode. See: https://zabo.com/docs#decentralized-mode') }
  }
  return transactions
}
