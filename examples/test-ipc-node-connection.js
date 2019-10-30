const zabo = require('../src/index')

zabo.init({
  apiKey: '<API KEY>',
  secretKey: '<SECRET KEY>',
  baseUrl: 'https://api.zabo.com',
  env: 'sandbox',

  decentralized: true,
  sendAppCryptoData: false,
  useNode: '<IPC FILE PATH>'
}).then(appId => {
  console.log('zabo status:', zabo.status)
  console.log('zabo application id:', appId)

  return zabo.ethereum.sendTransaction('0xe69282B67bda8b62723cF51A9dB47bdfDc61C65d', '0.0001')
}).then(tx => {
  console.log('tx:', tx.hash)
}).catch(err => {
  console.error('err:', err)
})
