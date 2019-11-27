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

const SDK = require('./sdk')

// Zabo main class definition
class Zabo {
  #sdkInstance

  async init (config = {}) {
    const sdkInstance = new SDK()
    await sdkInstance.init(config)
    return this.#sdkInstance = sdkInstance
  }

  get instance () {
    return this.#sdkInstance
  }

  get version () {
    return process.env.PACKAGE_VERSION
  }
}

// Export Zabo instance
module.exports = new Zabo()
