const dummy = require('./dummy')
const Currencies = require('../../src/resources/currencies')
const Users = require('../../src/resources/users')

class MockApi {
  constructor () {
    this.clientId = 'some-client-id'
    this.resources = {
      currencies: Currencies(this),
      users: Users(this)
    }
  }

  request (method, path, data = {}) {
    const map = {
      GET: [{
        regexp: /\/blockchains\/.+\/blocks\/.+/,
        data: dummy.blockchainsBlock
      }, {
        regexp: /\/blockchains\/.+\/blocks/,
        data: dummy.blockchainsBlock
      }, {
        regexp: /\/blockchains\/.+\/contracts\/.+/,
        data: dummy.blockchainsContract
      }, {
        regexp: /\/blockchains\/.+\/tokens\/.+/,
        data: dummy.blockchainsTokens
      }, {
        regexp: /\/blockchains\/.+\/tokens/,
        data: dummy.blockchainsTokens
      }, {
        regexp: /\/blockchains\/.+\/addresses\/.+\/balances/,
        data: dummy.blockchainsBalances
      }, {
        regexp: /\/blockchains\/.+\/transactions\/.+/,
        data: dummy.blockchainsTransaction
      }, {
        regexp: /\/blockchains\/.+\/addresses\/.+\/transactions/,
        data: dummy.blockchainsTransactions
      }, {
        regexp: /\/blockchains\/.+\/token-transfers\/.+/,
        data: dummy.blockchainsTokenTransfers
      }, {
        regexp: /\/blockchains\/.+\/addresses\/.+\/token-transfers/,
        data: dummy.blockchainsTokenTransfers
      }, {
        regexp: /\/teams\/.+/,
        data: dummy.team
      }, {
        regexp: /\/sessions/,
        data: dummy.account
      }, {
        regexp: /\/transfer-request/,
        data: dummy.transferRequest
      }, {
        regexp: /\/accounts\/.+\/balances/,
        data: dummy.balances
      }, {
        regexp: /\/accounts\/.+\/deposit-addresses/,
        data: [dummy.address]
      }, {
        regexp: /\/currencies\/.+/,
        data: dummy.currencies.data.find(c => path.includes(c.ticker))
      }, {
        regexp: /\/currencies/,
        data: dummy.currencies
      }, {
        regexp: /\/providers\/.+/,
        data: dummy.providers.data.find(p => path.includes(p.name))
      }, {
        regexp: /\/providers/,
        data: dummy.providers
      }, {
        regexp: /\/transactions\/.+/,
        data: dummy.transactions.data.find(tx => path.includes(tx.id))
      }, {
        regexp: /\/transactions/,
        data: dummy.transactions
      }, {
        regexp: /\/users\/.*\/accounts\/.+/,
        data: dummy.user.accounts.find(a => path.includes(a.id)) || dummy.account
      }, {
        regexp: /\/users\/.+/,
        data: dummy.users.data.find(u => path.includes(u.id))
      }, {
        regexp: /\/users/,
        data: dummy.users
      }, {
        regexp: /\/exchange-rates/,
        data: dummy.exchangeRates
      }, {
        regexp: /\/bytecode/,
        data: dummy.bytecode
      }],
      POST: [{
        regexp: /\/accounts\/.+\/deposit-addresses/,
        data: dummy.address
      }, {
        regexp: /\/users\/.+\/accounts\/.+\/transactions/,
        data: {
          ...dummy.transaction,
          amount: data.amount,
          currency: data.currency,
          other_parties: [data.to_address]
        }
      }, {
        regexp: /\/accounts\/.+\/transactions/,
        data: dummy.transaction
      }, {
        regexp: /\/users\/.+\/accounts/,
        data: {
          ...dummy.user,
          accounts: [
            ...dummy.user.accounts,
            data
          ]
        }
      }, {
        regexp: /\/accounts/,
        data: {
          ...dummy.account,
          provider: {
            ...dummy.account.provider,
            name: data.provider_name
          }
        }
      }, {
        regexp: /\/users/,
        data: dummy.user
      }],
      DELETE: [{
        regexp: /\/users\/.+\/accounts\/.+/,
        data: {
          ...dummy.user,
          accounts: dummy.user.accounts.filter(a => !path.includes(a.id))
        }
      }]
    }

    const responses = map[method] || []
    const response = responses.find(r => r.regexp.test(path))

    return new Promise(resolve =>
      setTimeout(() => resolve(response && response.data), 100)
    )
  }
}

module.exports = new MockApi()
