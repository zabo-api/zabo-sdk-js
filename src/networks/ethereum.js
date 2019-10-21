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

const ethers = require('ethers')
const utils = require('../utils')
const { SDKError } = require('../err')

class Ethereum {
  constructor(api) {
    this.node = null
  }

  async connect (nodeUrl) {
    if (!utils.isValidNodeUrl(nodeUrl)) {
      throw new SDKError(400, '[Zabo] For decentralized connections, please provide a valid node url as `useNode`. More details at: https://zabo.com/docs')
    }

    this.node = new ethers.providers.JsonRpcProvider(nodeUrl)

    const network = await this.node.getNetwork()
    console.log('>> NETWORK:', network)

    return 'online'
  }
}

module.exports = () => {
  return new Ethereum()
}
