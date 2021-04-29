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
const ZaboSDK = require('./core/SDK')
const utils = require('./utils')
const { SDKError } = require('./err')

/**
 * SDK main class definition
 */
class SDK extends ZaboSDK {
  constructor () {
    super()

    this.status = 'offline'
    this.api = null
    this.autoConnect = true
  }

  /**
   * Initialize the Zabo SDK.
   * @param {Object} params Zabo initialization config.
   * @returns The Zabo SDK.
   */
  async initAPI (params) {
    this.env = this.checkZaboEnv(params.env)
    this.apiVersion = this.checkApiVersion(params.apiVersion)

    if (typeof params.autoConnect !== 'undefined') {
      this.autoConnect = params.autoConnect
    } else {
      this.autoConnect = true
    }

    if (utils.isNode()) {
      if (!params.apiKey || !params.secretKey || typeof params.apiKey !== 'string' || typeof params.secretKey !== 'string') {
        return this.throwConnectError(401, '[Zabo] Please provide a valid Zabo app API and Secret keys. More details at: https://zabo.com/docs#app-server-authentication')
      }

      this.api = new API({
        baseUrl: params.baseUrl,
        apiKey: params.apiKey,
        secretKey: params.secretKey,
        apiVersion: this.apiVersion,
        env: this.env,
        ...params
      })

      await this.setEndpointAliases()

      if (this.autoConnect) {
        this.status = 'connecting'
        await this.api.connect()
        this.status = 'online'

        if (!this.api.resources.teams.id) {
          return this.throwConnectError(400, '[Zabo] Unable to connect with Zabo API. Please check your credentials and try again. More details at: https://zabo.com/docs')
        }

        return this.api.resources.teams.get()
      }
    } else {
      if (!params.clientId || typeof params.clientId !== 'string') {
        throw new SDKError(400, '[Zabo] Please provide a valid Zabo app clientId. More details at: https://zabo.com/docs')
      }

      try {
        this.api = new API({
          baseUrl: params.baseUrl,
          connectUrl: params.connectUrl,
          clientId: params.clientId,
          apiVersion: this.apiVersion,
          env: this.env
        })
        await this.setEndpointAliases()
      } catch (err) {
        console.error(err)
      }

      try {
        const account = await this.accounts.get()
        this.transactions._setAccount(account)
        this.trading._setAccount(account)
      } catch (err) {
        console.info('[Zabo] No account connected yet.')
      }

      return this.api.resources.teams.get()
    }
  }

  /**
   * Throw an error for the SDK.
   * @param {Number} code A status code relating to the error.
   * @param {String} message A message detailing the error.
   */
  throwConnectError (code, message) {
    this.status = 'offline'
    throw new SDKError(code, message)
  }

  /**
   * Set up the API endpoints.
   */
  async setEndpointAliases () {
    while (!this.api.resources) {
      await utils.sleep(500)
    }

    const { teams, ...apiResources } = this.api.resources
    Object.assign(this, apiResources)
  }

  /**
   * Checks if the environment is a valid environment.
   * @param {String} env The environment to use.
   * @returns The environment used, lowercased.
   */
  checkZaboEnv (env) {
    env = env ? env.toLowerCase() : null

    const acceptedEnvs = ['sandbox', 'live']
    if (!env || !acceptedEnvs.includes(env)) {
      return this.throwConnectError(400, '[Zabo] Please provide a valid env, should be \'sandbox\' or \'live\'. More details at: https://zabo.com/docs')
    }

    return env
  }

  checkApiVersion (version) {
    if (version && !['v0', 'v1'].includes(version)) {
      return this.throwConnectError(400, '[Zabo] Please provide a valid apiVersion, should be \'v0\' or \'v1\'. More details at: https://zabo.com/docs')
    }

    return version
  }

  /**
   * Connect the SDK to the Zabo API.
   * @param {{
   *  provider?: string,
   *  [key: string]: any
   * }} config Zabo API connection config.
   * @returns A connected SDK object for browsers, an appId for servers.
   */
  connect (config = {}) {
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

  /**
   * Callback function for when a new connection is made to the API.
   * @param {Function} fn The function to run on connections.
   * @returns An instance of the SDK.
   */
  onConnection (fn) {
    if (typeof fn !== 'function') { return }
    this.api._onConnection = fn.bind(this)
    return this
  }

  /**
   * Callback function for when an error occurs.
   * @param {Function} fn The function to run on errors.
   * @returns An instance of the SDK.
   */
  onError (fn) {
    if (typeof fn !== 'function') { return }
    this.api._onError = fn.bind(this)
    return this
  }

  /**
   * Callback function for when events are triggered.
   * @param {Function} fn The function to run on events.
   * @returns An instance of the SDK.
   */
  onEvent (fn) {
    if (typeof fn !== 'function') { return }
    this.api._onEvent = fn.bind(this)
    return this
  }

  getTeam () {
    return this.api.resources.teams.get()
  }

  get data () {
    return this.api.resources.teams.data
  }
}

module.exports = new SDK()
