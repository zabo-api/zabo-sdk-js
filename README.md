What is Zabo? A unified cryptocurrency API.
=========================
[![CircleCI](https://circleci.com/gh/zabo-api/zabo-sdk-js/tree/master.svg?style=svg)](https://circleci.com/gh/zabo-api/zabo-sdk-js/tree/master)
[![Discord](https://img.shields.io/discord/533336922970521600)](https://discord.gg/vGHYuUT)
[![Discourse](https://img.shields.io/discourse/https/forum.zabo.com/status)](https://forum.zabo.com)   

[Zabo](https://zabo.com) is an API for connecting with cryptocurrency exchanges, wallets and protocols like Bitcoin. Instead of manually integrating with [Coinbase API](https://zabo.com/integrations/coinbase), [Binance API](https://zabo.com/integrations/binance), [Bitcoin APIs](https://zabo.com/integrations/bitcoin) or the hundreds of other cryptocurrency APIs - you can simply use Zabo for them all.  

We believe teams and developers should focus on building great products, not worry about the fragmented landscape of exchange APIs and blockchain protocols.  

For our updated list of integrations, [check out our Zabo integrations](https://zabo.com/integrations).

# Zabo API Javascript (JS) SDK

The Zabo SDK for JS provides convenient access to the Zabo API from applications written in browser and server-side JavaScript.  

Please keep in mind that [you must register](https://zabo.com/login) and receive a team id to use in your client application, or if you are using the server side functions, [generate an API keypair from your dashboard](https://zabo.com/dashboard).

## Documentation
See the [Zabo API docs](https://zabo.com/docs).

## Installation
For a standard browser application, add the script tag to your html file:
```html
<script src="https://cdn.zabo.com/develop/latest/zabo.js">
```

As a package:
```
npm install zabo-sdk-js --save
```

## Usage
The first step is always to allow a user to connect from your front-end:
```html
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
  <meta charset="utf-8">
  <title>My Website</title>

  <link rel="stylesheet" href="example.css" type="text/css" />
</head>

<body>
  <section>
    <header>
      <h2>My Zabo Application</h2>
    </header>

    <button id="connect" type="button">Connect</button>

    <div>
      <h4>Other SDK methods</h4>
      <button id="getBalance" type="button">Crypto Balances</button>
      <button id="getHistory" type="button">Account History</button>
      <button id="getExchangeRates" type="button">Exchange Rates</button>
    </div>

  </section>

  <!--Add this script to your html file-->
  <script src="https://cdn.zabo.com/latest/zabo.js"></script>

  <script type="text/javascript">
    // Wait for document to fully load
    document.onreadystatechange = async () => {
      if (document.readyState !== 'complete') { return }

      const output = document.querySelector('#output')

      // Initiate Zabo SDK, replace the `clientId` field with your team client id.
      const zabo = await Zabo.init({
        clientId: 'YourClientIDFromTheZaboDotComDashboard',
        env: 'sandbox'
      })
      // Bind "connect" button
      document.querySelector('#connect').addEventListener('click', ev => {
        // Call connect when pressed and provide default .connect() window.
        zabo.connect().onConnection(account => {
          console.log('account connected:', account)
          bindOtherMethods()
        }).onError(error => {
          console.error('account connection error:', error.message)
        })
      })

      // Bind buttons for the other SDK example methods [Requires a successful zabo.connect() first]
      function bindOtherMethods () {
        document.querySelector('#getBalance').addEventListener('click', ev => {
          // Get ETH balance
          zabo.accounts.getBalances({ tickers: ["ETH"] }).then(balances => {
            console.log(balances)
          }).catch(error => {
            /* User has not yet connected or doesn't have an ether wallet */
            console.error(error)
          })
        })

        document.querySelector('#getHistory').addEventListener('click', ev => {
          // Get account transactions history
          zabo.transactions.getList({ ticker: 'ETH' }).then(history => {
            console.log(history)
          }).catch(error => {
            /* User has not yet connected */
            console.error(error)
          })
        })

        document.querySelector('#getExchangeRates').addEventListener('click', ev => {
          // Get crypto USD exchange rates
          zabo.currencies.getExchangeRates().then(rates => {
            console.log(rates)
          }).catch(error => {
            console.error(error)
          })
        })
      }
    }
  </script>
</body>

</html>
```

Or importing as a package:
```js
const Zabo = require('zabo-sdk-js')

const zabo = await Zabo.init({
  clientId: 'YourClientIDFromTheZaboDotComDashboard',
  env: 'sandbox'
})

zabo.connect().onConnection(account => {
  console.log('account connected:', account)
}).onError(error => {
  console.error('account connection error:', error.message)
})
```
Or using ES6 modules:
```js
import Zabo from 'zabo-sdk-js'
```

### After connecting
After a user connects, the client SDK can continued to be used for the connected wallet:
```js
zabo.transactions.getList({ ticker: 'ETH' }).then(history => {
  console.log(history)
}).catch(error => {
  /* User has not yet connected */
  console.error(error)
})
```
Or you can send the account to your server for the server-side SDK to create a unique user:
```js
zabo.connect().onConnection(account => {
  sendToYourServer(account)
}).onError(error => {
  console.error('account connection error:', error.message)
})

// Then in your server
const Zabo = require('zabo-sdk-js')
let account = accountReceivedFromTheClient

Zabo.init({
  apiKey: 'YourPublicAPIKeyGeneratedInYourZaboDotComDashboard',
  secretKey: 'YourSecretAPIKey',
  env: 'sandbox'
}).then(zabo => {
  zabo.users.create(account)
}).catch(e => {
  console.log(e.message)
})
```

### Zabo.init() Configuration
While instantiating your new Zabo SDK instance, you have a few configuration options that can be changed to best suit your needs. Please note that some options are available only when running the SDK from the browser while others are available when running the SDK on your node.js code.

| Key           | Description   | Platform   |
| ------------- | ------------- |----------- |
| clientId      | App Key acquired when registering a team in [Zabo Dashboard](https://zabo.com/login/). | Browser |
| env           | Zabo API environment the SDK is connecting with. Could be either `sandbox` or `live`. Only `sandbox` is available unless a `live` connection is approved. | Both |
| apiKey        | API Key generated via the Developer Settings section at [Zabo Dashboard](https://zabo.com/login/). | Node |
| secretKey     | Secret Key generated via the Developer Settings section at [Zabo Dashboard](https://zabo.com/login/). | Node |
| autoConnect   | Optional boolean useful if you wish to stop the SDK from fetching the team data during Zabo.init(). Defaults to `true`. | Both |

### Server vs Client
The SDK can be used in either the client or server environment after a user connects their wallet, however, they have different functions available to them and utilize different authentication methods. See [the Zabo API docs](https://zabo.com/docs) for more information.


### Using Promises
Every method returns a chainable promise which can be used:
```js
zabo.getTeam().then(a => {
  console.log(a)
}).catch(e => {
  console.log(e.message)
})
```
Or with async/await:
```js
let exchangeRates = await zabo.currencies.exchangeRates()
console.log(exchangeRates)
```

## Help and Further Information
Please [read our docs](https://zabo.com/docs) and reach out to us in any or all of the following forums for questions:

* [Discord](https://discord.gg/vGHYuUT)
* [Discourse](https://forum.zabo.com)
* [Gitter](https://gitter.im/zabo-api/community)
* [Email](mailto:contact@zabo.com)

## Issues
If you notice any issues with our docs, this README, or the SDK, feel free to open an issue and/or a PR. We welcome community contributions!
