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

const API = require('./api')
const utils = require('./utils')
const { SDKError } = require('./err')

// SDK main class definition
class ZaboSDK {
  constructor() {
    this.status = 'offline'
    this.api = null
    this.autoConnect = true
  }

  async init(o) {
    let env = o.env ? o.env.toLowerCase() : null
    let acceptedEnvs = ['sandbox', 'live']

    if (!env || !acceptedEnvs.includes(env)) {
      return this.throwConnectError(400, '[Zabo] Please provide a valid env, should be \'sandbox\' or \'live\'. More details at: https://zabo.com/docs')
    }

    this.env = env

    if (typeof o.autoConnect !== 'undefined') {
      this.autoConnect = o.autoConnect
    }

    let isNode = utils.isNode()
    if (isNode) {
      if (!o.apiKey || !o.secretKey || typeof o.apiKey !== 'string' || typeof o.secretKey !== 'string') {
        return this.throwConnectError(401, '[Zabo] Please provide a valid Zabo app API and Secret keys. More details at: https://zabo.com/docs#app-server-authentication')
      }

      try {
        this.api = new API({
          baseUrl: o.baseUrl,
          apiKey: o.apiKey,
          secretKey: o.secretKey,
          env: this.env
        })

        this.setEndpointAliases()

        if (this.autoConnect) {
          this.status = 'connecting'
          await this.api.connect()
          this.status = 'online'
          return this.applications.id
        }

        return
      } catch (err) {
        throw err
      }
    }

    if (!o.clientId || typeof o.clientId !== 'string') {
      throw new SDKError(400, '[Zabo] Please provide a valid Zabo app clientId. More details at: https://zabo.com/docs')
    }

    this.api = new API({
      baseUrl: o.baseUrl,
      connectUrl: o.connectUrl,
      clientId: o.clientId,
      env: this.env
    })

    if (this.api.resources) {
      this.setEndpointAliases()

      try {
        let account = await this.accounts.getAccount()
        console.log(account)
        this.transactions._setAccount(account)
      } catch (e) {
        console.log(e)
      }
    }
  }

  throwConnectError(code, message) {
    this.status = 'offline'
    throw new SDKError(code, message)
  }

  setEndpointAliases() {
    Object.assign(this, this.api.resources)
  }

  connect(interfaceType = 'popup', attachTo = 'body') {
    if (this.api && utils.isBrowser()) {
      this.api.connect(interfaceType, attachTo)
      this.setEndpointAliases()
      return this
    }
    return
  }

  onConnection(fn) {
    if (typeof fn !== 'function') { return }
    this.api._onConnection = fn.bind(this)
    return this
  }

  onError(fn) {
    if (typeof fn !== 'function') { return }
    this.api._onError = fn.bind(this)
    return this
  }
}

// Export SDK instance
let _z = new ZaboSDK()
if (utils.isBrowser()) {
  window.Zabo = _z
}

module.exports = _z
