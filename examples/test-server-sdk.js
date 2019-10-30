const zabo = require('../src/index')

zabo.init({
  apiKey: '<API KEY>',
  secretKey: '<SECRET KEY>',
  baseUrl: 'https://api.zabo.com',
  env: 'sandbox',
}).then(app => {
  console.log('status:', zabo.status)
  console.log('appId:', app)

  return zabo.users.create({
    id: '<ZABO ACCOUNT ID>',
    token: '<ZABO CONNECT TOKEN>'
  })
}).then(user => {
  console.log('user:', user)

  return zabo.users.getUsers()  // HAS PAGINATION
}).then(users => {
  console.log('users:', users)
}).catch(err => {
  console.error('err:', err)
})
