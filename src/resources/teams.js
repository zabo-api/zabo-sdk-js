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

/**
 * Teams API.
 */
class Teams {
  constructor (api) {
    this.api = api
    this.id = null
    this.data = null
  }

  setId (id) {
    if (!utils.uuidValidate(id)) {
      throw new SDKError(400, '[Zabo] Team id must be a valid UUID version 4. See: https://zabo.com/docs')
    }

    this.id = id
  }

  async get () {
    if (utils.isNode()) {
      if (!this.id) {
        throw new SDKError(401, '[Zabo] SDK has not initialized properly.')
      }

      try {
        this.data = await this.api.request('GET', `/teams/${this.id}`)
      } catch (err) {
        throw new SDKError(err.error_type, err.message, err.request_id)
      }
    } else {
      if (!this.api.clientId) {
        throw new SDKError(401, '[Zabo] SDK has not initialized properly.')
      }

      try {
        const origin = encodeURIComponent(window ? window.location.host : '')
        this.data = await this.api.request('GET', `/teams/info?client_id=${this.api.clientId}&origin=${origin}`, '', true)
      } catch (err) {
        throw new SDKError(err.error_type, err.message, err.request_id)
      }
    }

    return this.data
  }

  async getSession () {
    const session = this.data && this.data.session

    if (session && new Date(session.expires_at) > Date.now()) {
      return session
    }

    const team = await this.get()
    return team.session
  }
}

/**
 * @typedef {Teams} TeamsAPI
 * @type {(api) => TeamsAPI}
 */
module.exports = (api, appId) => {
  return new Teams(api, appId)
}
