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

const { SDKError } = require('../err')

class Transactions {
  constructor(api, isNode) {
    this.api = api
    this.isNode = isNode
    this.accountId = null
  }

  _setAccount(account) {
    this.accountId = account.id
  }

  async getTransaction({ userId, accountId, txId } = {}) {
    if (this.isNode) {
      if (!userId) {
        throw new SDKError(400, '[Zabo] Missing `userId` parameter. See: https://zabo.com/docs#get-a-specific-transaction')
      } else if (!accountId) {
        throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#get-a-specific-transaction')
      } else if (!txId) {
        throw new SDKError(400, '[Zabo] Missing `txId` parameter. See: https://zabo.com/docs#get-a-specific-transaction')
      }

      try {
        return this.api.request('GET', `/users/${userId}/accounts/${accountId}/transactions/${txId}`)
      } catch (err) {
        throw new SDKError(err.error_type, err.message)
      }
    }
    if (!this.accountId) {
      throw new SDKError(400, '[Zabo] Not connectec. See: https://zabo.com/docs#get-a-specific-transaction')
    } else if (!txId) {
      throw new SDKError(400, '[Zabo] Missing `txId` parameter. See: https://zabo.com/docs#get-a-specific-transaction')
    }

    try {
      return this.api.request('GET', `/accounts/${this.accountId}/transactions/${txId}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

  async getTransactionHistory({ userId, accountId, currencyTicker, limit = 25, cursor = '' } = {}) {
    let url
    if (this.isNode) {
      if (!userId) {
        throw new SDKError(400, '[Zabo] Missing `userId` parameter. See: https://zabo.com/docs#get-a-specific-transaction')
      } else if (!accountId) {
        throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#get-account-history')
      } else if (!currencyTicker) {
        throw new SDKError(400, '[Zabo] Missing `currencyTicker` parameter. See: https://zabo.com/docs#get-account-history')
      }

      url = `/users/${userId}/accounts/${accountId}/transactions?currency=${currencyTicker}&limit=${limit}&cursor=${cursor}`
    } else {
      if (!this.accountId) {
        throw new SDKError(400, '[Zabo] Not connected. See: https://zabo.com/docs#get-account-history')
      } else if (!currencyTicker) {
        throw new SDKError(400, '[Zabo] Missing `currencyTicker` parameter. See: https://zabo.com/docs#get-account-history')
      }

      url = `/accounts/${this.accountId}/transactions?currency=${currencyTicker}&limit=${limit}&cursor=${cursor}`
    }
    try {
      return this.api.request('GET', url)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }
}

module.exports = (api) => {
  return new Transactions(api)
}
