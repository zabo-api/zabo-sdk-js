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
 *
 * @description: Zabo account-related functions
 */

'use strict'

const utils = require('../utils')
const { SDKError } = require('../err')

class Accounts {
  constructor(api) {
    this.api = api
    this.id = null
    this.data = null
  }

  _setAccount(account) {
    this.id = account.id
    this.data = account
  }

  async getAccount() {
    try {
      let response = await this.api.request('GET', `/sessions`)
      this._setAccount(response)

      return this.data
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

  async getBalances({ tickers } = {}) {
    if (!tickers) {
      throw new SDKError(400, '[Zabo] Missing `tickers` parameter. See: https://zabo.com/docs#get-balances')
    }

    if (!this.id) {
      throw new SDKError(401, '[Zabo] Account not yet connected. See: https://zabo.com/docs#connecting-a-user')
    }

    if (Array.isArray(tickers)) {
      tickers = tickers.join(',')
    }

    try {
      return this.api.request('GET', `/accounts/${this.id}/balances?currency=${tickers}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

}

module.exports = (api) => {
  return new Accounts(api)
}
