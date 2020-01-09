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
const resources = require('./resources')
const { SDKError } = require('./err')

// SDK main class definition
class ZaboSDK {
  constructor() {
    this.status = 'offline'
    this.api = null
    this.autoConnect = true
  }

  async init(o) {
    if (typeof o.autoConnect !== 'undefined') {
      this.autoConnect = o.autoConnect
    } else {
      this.autoConnect = true
    }

    if (utils.isNode()) {
      if (!o.apiKey || !o.secretKey || typeof o.apiKey !== 'string' || typeof o.secretKey !== 'string') {
        return this.throwConnectError(401, '[Zabo] Please provide a valid Zabo app API and Secret keys. More details at: https://zabo.com/docs#app-server-authentication')
      }

      this.env = this.checkZaboEnv(o.env)

      try {
        this.api = new API({
          baseUrl: o.baseUrl,
          apiKey: o.apiKey,
          secretKey: o.secretKey,
          env: this.env,
          sendAppCryptoData: true
        })
        await this.setEndpointAliases()

        if (this.autoConnect) {
          this.status = 'connecting'
          await this.api.connect()
          this.status = 'online'

          if (!this.applications.id) {
            return this.throwConnectError(400, '[Zabo] Unable to connect with Zabo API. Please check your credentials and try again. More details at: https://zabo.com/docs')
          }

          if (this.autoConnect) {
            return this.applications.get()
          }
        }
      } catch (err) {
        throw err
      }
    }

    if (o.decentralized) {
      try {
        this.status = 'connecting'
        if (o.sendAppCryptoData) {
          this.api = new API({
            baseUrl: o.baseUrl,
            clientId: o.clientId,
            env: o.env,
            decentralized: true,
            useNode: o.useNode,
            useAddress: o.useAddress,
            sendAppCryptoData: true
          })
          await this.setEndpointAliases()
          let trackingAccount = await this.accounts.create({
            clientId: o.clientId,
            credentials: [this.accounts.data.address],
            provider: 'address-only',
            origin: window.location.host
          })
          this.accounts.create = () => { throw new SDKError(400, '[Zabo] Not available in decentralized mode. See: https://zabo.com/docs#decentralized-mode') }

          return trackingAccount
        }

        let resourcesReturn = await resources({
          decentralized: true,
          clientId: o.clientId,
          useNode: o.useNode,
          useAddress: o.useAddress,
          baseUrl: o.baseUrl
        }, false)
        Object.assign(this, resourcesReturn)
        this.status = 'online'
        return this.accounts.data
      } catch (err) {
        console.error(err)
      }
      return
    }

    this.env = this.checkZaboEnv(o.env)

    if (!o.clientId || typeof o.clientId !== 'string') {
      throw new SDKError(400, '[Zabo] Please provide a valid Zabo app clientId. More details at: https://zabo.com/docs')
    }

    try {
      this.api = new API({
        baseUrl: o.baseUrl,
        connectUrl: o.connectUrl,
        clientId: o.clientId,
        env: this.env,
      })
      await this.setEndpointAliases()
    } catch (err) {
      console.error(err)
    }

    try {
      let account = await this.accounts.get()
      this.transactions._setAccount(account)
      return this.applications.getInfo()
    } catch (err) {
      console.error('[Zabo] No account connected yet.')
      return this.applications.getInfo()
    }
  }

  throwConnectError(code, message) {
    this.status = 'offline'
    throw new SDKError(code, message)
  }

  async setEndpointAliases() {
    while (!this.api.resources) {
      await utils.sleep(500)
    }
    Object.assign(this, this.api.resources)
  }

  checkZaboEnv(env) {
    env = env ? env.toLowerCase() : null

    let acceptedEnvs = ['sandbox', 'live']
    if (!env || !acceptedEnvs.includes(env)) {
      return this.throwConnectError(400, '[Zabo] Please provide a valid env, should be \'sandbox\' or \'live\'. More details at: https://zabo.com/docs')
    }

    return env
  }

  connect(config = {}) {
    // TODO: Remove warnings
    if (config.interfaceType) {
      console.warn('[ZABO] "interfaceType" has been deprecated. More details at: https://zabo.com/docs/#connecting-a-user')
    }

    if (this.api && utils.isBrowser()) {
      this.api.connect(config)
      return this
    }

    this.status = 'connecting'

    return this.api.connect().then(appId => {
      this.status = 'online'
      return appId
    }).catch(err => {
      throw err
    })
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

// Export ZaboSDK class
module.exports = new ZaboSDK()