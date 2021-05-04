/**
 * @Copyright (c) 2019-present, Zabo, All rights reserved.
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

const sdk = require('./sdk')

/**
 * @typedef {sdk.SDK} SDK
 */

/**
 * Zabo main class definition.
 */
class Zabo {
  /**
   * Initialize the Zabo SDK.
   * @param {{
   *  clientId?: String
   *  env: 'live' | 'sandbox'
   *  apiKey?: String
   *  secretKey?: String
   *  autoConnect?: Boolean
   * }} config Zabo initialization config.
   * @returns {Promise<SDK>} The Zabo SDK.
   */
  async init (config = {}) {
    await sdk.init(config)
    return sdk
  }

  /**
   * Get an instance of the ZaboSDK.
   * @returns {SDK} An instance of ZaboSDK.
   */
  get instance () {
    return sdk
  }

  get version () {
    return process.env.PACKAGE_VERSION
  }
}

/**
 * @type {Zabo}
 */
module.exports = new Zabo()
