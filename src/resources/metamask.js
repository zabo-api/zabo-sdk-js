/**
 * Copyright (c) 2019-present, Zabo & Modular, Inc. All rights reserved.
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
 *
 * @description: Zabo bridge with Metamask
 */
'use strict'

class Metamask {
  constructor() {
    this.ethereum = window.ethereum
    this.accounts = []
  }

  isSupported() {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask
  }

  async connect() {
    if (!this.isSupported()) { return }

    const accounts = await this.ethereum.enable()

    if (accounts.length > 0) {
      accounts.forEach(a => {
        if (this.accounts.includes(a)) {
          return
        }

        this.accounts.push(a)
      })

      if (this.accounts[0] != accounts[0]) {
        this._onAccountSwitch(accounts[0])
      }
    }
  }

  onConnect(data) {
    console.log('[Zabo] Account connected with metamask.')
  }

  _onAccountSwitch(account) {
    // TODO: Bubble event up to Zabo SDK and store new address in user's settings
  }
}

module.exports = () => {
  return new Metamask()
}
