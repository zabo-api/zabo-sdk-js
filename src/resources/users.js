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

const utils = require('../utils')
const { SDKError } = require('../err')

class Users {
  constructor (api) {
    this.api = api
  }

  async create (account = {}) {
    if (!account.id) {
      throw new SDKError(400, '[Zabo] Missing `id` property in account object. See: https://zabo.com/docs#create-a-user')
    } else if (!account.token) {
      throw new SDKError(400, '[Zabo] Missing `token` property in account object. See: https://zabo.com/docs#create-a-user')
    }

    try {
      return this.api.request('POST', '/users', account)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async addAccount (user = {}, account = {}) {
    if (!user.id) {
      throw new SDKError(400, '[Zabo] Missing `id` property in user object. See: https://zabo.com/docs#add-account-to-existing-user')
    } else if (!account.id) {
      throw new SDKError(400, '[Zabo] Missing `id` property in account object. See: https://zabo.com/docs#add-account-to-existing-user')
    } else if (!account.token) {
      throw new SDKError(400, '[Zabo] Missing `token` property in account object. See: https://zabo.com/docs#add-account-to-existing-user')
    }

    try {
      return this.api.request('POST', `/users/${user.id}/accounts`, account)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async removeAccount ({ userId, accountId }) {
    if (!userId) {
      throw new SDKError(400, '[Zabo] Missing `id` property in user object. See: https://zabo.com/docs#remove-account-from-user')
    } else if (!accountId) {
      throw new SDKError(400, '[Zabo] Missing `id` property in account object. See: https://zabo.com/docs#remove-account-from-user')
    }

    try {
      return this.api.request('DELETE', `/users/${userId}/accounts/${accountId}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async getOne (id) {
    if (!id) {
      throw new SDKError(400, '[Zabo] Missing `id` input. See: https://zabo.com/docs#get-a-user')
    }

    try {
      return this.api.request('GET', `/users/${id}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async getList ({ limit = 25, cursor = '' } = {}) {
    utils.validateListParameters(limit, cursor)

    try {
      return this.api.request('GET', `/users?limit=${limit}&cursor=${cursor}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async getAccount ({ userId, accountId } = {}) {
    if (!userId) {
      throw new SDKError(400, '[Zabo] Missing `userId` parameter. See: https://zabo.com/docs#get-a-user-account')
    } else if (!accountId) {
      throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#get-a-user-account')
    }

    try {
      return this.api.request('GET', `/users/${userId}/accounts/${accountId}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async getBalances ({ userId, accountId, tickers } = {}) {
    if (!userId) {
      throw new SDKError(400, '[Zabo] Missing `userId` parameter. See: https://zabo.com/docs#get-a-specific-balance')
    } else if (!accountId) {
      throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#get-a-specific-balance')
    }

    let url = `/users/${userId}/accounts/${accountId}/balances`

    if (tickers) {
      if (Array.isArray(tickers)) {
        tickers = tickers.join(',')
      }
      url = `${url}?tickers=${tickers}`
    }

    try {
      return this.api.request('GET', url)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async createDepositAddress ({ userId, accountId, ticker } = {}) {
    if (!userId) {
      throw new SDKError(400, '[Zabo] Missing `userId` parameter. See: https://zabo.com/docs#create-a-deposit-address')
    } else if (!accountId) {
      throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#create-a-deposit-address')
    } else if (!ticker || typeof ticker !== 'string') {
      throw new SDKError(400, '[Zabo] Missing or invalid `ticker` parameter. See: https://zabo.com/docs#create-a-deposit-address')
    }

    try {
      return this.api.request('POST', `/users/${userId}/accounts/${accountId}/deposit-addresses?ticker=${ticker}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async getDepositAddresses ({ userId, accountId, ticker } = {}) {
    if (!userId) {
      throw new SDKError(400, '[Zabo] Missing `userId` parameter. See: https://zabo.com/docs#get-deposit-addresses')
    } else if (!accountId) {
      throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#get-deposit-addresses')
    } else if (!ticker || typeof ticker !== 'string') {
      throw new SDKError(400, '[Zabo] Missing or invalid `ticker` parameter. See: https://zabo.com/docs#get-deposit-addresses')
    }

    try {
      return this.api.request('GET', `/users/${userId}/accounts/${accountId}/deposit-addresses?ticker=${ticker}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }
}

module.exports = (api) => {
  return new Users(api)
}
