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
const utils = require('../utils')
const { SDKError } = require('../err')

class Applications {
  constructor (api) {
    this.api = api
    this.id = null
    this.clientId = null
    this.data = null
  }

  setId (id) {
    if (!uuidValidate(id, 4)) {
      throw new SDKError(400, '[Zabo] Application id must be a valid UUID version 4. See: https://zabo.com/docs#about-the-api')
    }

    this.id = id
  }

  async get () {
    if (!this.id) {
      throw new SDKError(401, '[Zabo] SDK has not initialized properly get().')
    }
    try {
      this.data = await this.api.request('GET', `/applications/${this.id}`)
      return this.data
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

  async getInfo () {
    if (!this.api.clientId) {
      throw new SDKError(401, '[Zabo] SDK has not initialized properly getInfo().')
    }

    const origin = encodeURIComponent(window ? window.location.host : '')

    if (utils.isNode()) {
      throw new SDKError(401, '[Zabo] Method available only for client SDK. On the server-side, please use Zabo.applications.get() instead.')
    }

    try {
      this.data = await this.api.request('GET', `/applications/info?client_id=${this.api.clientId}&origin=${origin}`, {}, true)
      return this.data
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }
}

module.exports = (api, appId) => {
  if (api.decentralized) {
    return null
  }
  return new Applications(api, appId)
}
