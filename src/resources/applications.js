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
const { SDKError } = require('../err')

class Applications {
  constructor(api) {
    this.api = api
    this.id = null
  }

  setId (id) {
    if (!uuidValidate(id, 4)) {
      throw new SDKError(400, '[Zabo] Application id must be a valid UUID version 4. See: https://zabo.com/docs#about-the-api')
    }

    this.id = id
  }

  async getApplication() {
    if (!this.id) {
      throw new SDKError(401, '[Zabo] SDK has not initialized properly.')
    }
    try {
      return this.api.request('GET', `/applications/${this.id}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

  async getApplicationInfo() {
    if (!this.api.clientId) {
      throw new SDKError(401, '[Zabo] SDK has not initialized properly.')
    }

    let origin = encodeURIComponent(window ? window.location.host : '')

    if (!origin) {
      throw new SDKError(401, '[Zabo] Method available only for client SDK. On the server-side, please use Zabo.getApplication() instead.')
    }

    try {
      return this.api.request('GET', `/applications/info?app_key=${this.api.clientId}&origin=${origin}`, {}, true)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }
}

module.exports = (api, appId) => {
  return new Applications(api, appId)
}
