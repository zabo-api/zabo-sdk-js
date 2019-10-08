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
  constructor(api) {
    this.api = api
  }

  async create(account = {}) {
    if (!account.id) {
      throw new SDKError(400, '[Zabo] Missing `id` property in account object. See: https://zabo.com/docs#create-a-user')
    } else if (!account.token) {
      throw new SDKError(400, '[Zabo] Missing `token` property in account object. See: https://zabo.com/docs#create-a-user')
    }

    try {
      return this.api.request('POST', '/users', account)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

  async addAccount(user = {}, account = {}) {
    if (!user.id) {
      throw new SDKError(400, '[Zabo] Missing `id` property in user object. See: https://zabo.com/docs#add-account-to-existing-user')
    } else if (!account.id) {
      throw new SDKError(400, '[Zabo] Missing `id` property in account object. See: https://zabo.com/docs#add-account-to-existing-user')
    } else if (!account.token) {
      throw new SDKError(400, '[Zabo] Missing `token` property in account object. See: https://zabo.com/docs#add-account-to-existing-use')
    }

    try {
      return this.api.request('POST', `/users/${user.id}/accounts`, account)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

  async removeAccount(user = {}, account = {}) {
    if (!user.id) {
      throw new SDKError(400, '[Zabo] Missing `id` property in user object. See: https://zabo.com/docs#remove-account-from-user')
    } else if (!account.id) {
      throw new SDKError(400, '[Zabo] Missing `id` property in account object. See: https://zabo.com/docs#remove-account-from-user')
    }

    try {
      return this.api.request('DELETE', `/users/${user.id}/accounts/${account.id}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

  async getUser(id) {
    if (!id) {
      throw new SDKError(400, '[Zabo] Missing `id` input. See: https://zabo.com/docs#get-a-user')
    }

    try {
      return this.api.request('GET', `/users/${id}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

  async getUsers({ limit = 25, cursor = '' } = {}) {
    utils.validateListParameters(limit, cursor)

    try {
      return this.api.request('GET', `/users?limit=${limit}&cursor=${cursor}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

  async getAccount({ userId, accountId } = {}) {
    if (!userId) {
      throw new SDKError(400, '[Zabo] Missing `userId` parameter. See: https://zabo.com/docs#get-balances')
    } else if (!accountId) {
      throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#get-balances')
    }

    try {
      return this.api.request('GET', `/users/${userId}/accounts/${accountId}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

  async getBalances({ userId, accountId, tickers } = {}) {
    if (!userId) {
      throw new SDKError(400, '[Zabo] Missing `userId` parameter. See: https://zabo.com/docs#get-balances')
    } else if (!accountId) {
      throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#get-balances')
    } else if (!tickers) {
      throw new SDKError(400, '[Zabo] Missing `tickers` parameter. See: https://zabo.com/docs#get-balances')
    }

    if (Array.isArray(tickers)) {
      tickers = tickers.join(',')
    }

    try {
      return this.api.request('GET', `/users/${userId}/accounts/${accountId}/balances?currencies=${tickers}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

}

module.exports = (api) => {
  return new Users(api)
}
