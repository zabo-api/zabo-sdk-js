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
 * @description: Zabo API utilities
 */

'use strict'

const utils = require('../utils')

class Utils {
  constructor(api) {
    this.api = api
  }

  getQRCode(url) {
    return utils.createQRCode(url)
  }

  getBytecode({ fromAddress, toAddress, amount, currency } = {}) {
    if (!fromAddress) {
      throw new SDKError(400, '[Zabo] Missing `fromAddress` parameter. See: https://zabo.com/docs#get-network-message-bytecode')
    } else if (!toAddress) {
      throw new SDKError(400, '[Zabo] Missing `toAddress` parameter. See: https://zabo.com/docs#get-network-message-bytecode')
    } else if (!amount) {
      throw new SDKError(400, '[Zabo] Missing `amount` parameter. See: https://zabo.com/docs#get-network-message-bytecode')
    } else if (!currency) {
      throw new SDKError(400, '[Zabo] Missing `currency` parameter. See: https://zabo.com/docs#get-network-message-bytecode')
    }

    try {
      return this.api.request('GET', `/bytecode?currency=${currency.toLowerCase()}&from_address=${fromAddress}&to_address=${toAddress}&amount=${amount}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }
}

module.exports = (api) => {
  let utils = new Utils(api)
  if (api.decentralized) {
    utils.getBytecode = () => { throw new SDKError(400, '[Zabo] Not available in decentralized mode. See: https://zabo.com/docs#decentralized-mode') }
  }
  return utils
}
