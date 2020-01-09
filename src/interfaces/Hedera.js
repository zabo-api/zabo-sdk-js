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
 * @description: Zabo bridge with Hedera
 */
'use strict'

const Interface = require('./Interface')
const utils = require('../utils')
const { SDKError } = require('../err')

class Hedera extends Interface {
  constructor(api) {
    super('Hedera', api)
    this._accounts = []
  }

  static isSupported() {
    return true
  }
  
  async sendTransaction({ userId, account, currency, toAddress, amount } = {}) {
    if (currency === 'HBAR') {
      if (account.wallet_provider.name == 'hedera') {
        const url = this._getCryptoTransferLink({ accountId: account.id, userId, toAddress, amount })
        return this.api.request('GET', url)
      } else {
        throw new SDKError(403, '[Zabo] You need a `hedera` account to send `HBAR` transactions. See: https://zabo.com/docs#send-a-transaction')
      }
    }

    throw new SDKError(500, `[Zabo] Unable to send Hedera transactions at the moment.`)
  }

  _getCryptoTransferLink ({ userId, accountId, toAddress, amount, note } = {}) {
    note = note ? encodeURIComponent(note) : ''
  
    let url
    if (utils.isNode()) {
      url = `/users/${userId}/accounts/${accountId}/transfer-request?to_address=${toAddress}&amount=${amount}&note=${note}`
    } else {
      url = `/accounts/${accountId}/transfer-request?to_address=${toAddress}&amount=${amount}&note=${note}`
    }
  
    return url
  }
}

module.exports = Hedera
