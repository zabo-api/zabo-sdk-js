const Zabo = require('../src/index')

async function main () {
  const zabo = await Zabo.init({
    apiKey: '<API KEY>',
    secretKey: '<SECRET KEY>',
    env: 'sandbox',
  })
  
  console.log('status:', zabo.status)
  console.log('appId:', zabo.applications.data.id)
  
  zabo.users.create({
    id: '<ZABO ACCOUNT ID>',
    token: '<ZABO CONNECT TOKEN>'
  }).then(user => {
    console.log('user:', user)
    return zabo.users.getList()  // HAS PAGINATION
  }).then(users => {
    console.log('users:', users)
  }).catch(err => {
    console.error('err:', err)
  })
}

main()
