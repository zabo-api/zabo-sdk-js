module.exports = {
  account: require('./account.json'),
  address: require('./address.json'),
  team: require('./team.json'),
  balances: require('./balances.json'),
  currencies: require('./currencies.json'),
  exchangeRates: require('./exchange-rates.json'),
  transaction: require('./transaction.json'),
  transactions: require('./transactions.json'),
  user: require('./user.json'),
  users: require('./users.json'),
  providers: require('./providers.json'),
  // Blockchains
  blockchainsBlock: require('./blockchains/block.json'),
  blockchainsBalances: require('./blockchains/balances.json'),
  blockchainsContract: require('./blockchains/contract.json'),
  blockchainsTokenTransfers: require('./blockchains/token-transfers.json'),
  blockchainsTokens: require('./blockchains/tokens.json'),
  blockchainsTransaction: require('./blockchains/transaction.json'),
  blockchainsTransactions: require('./blockchains/transactions.json'),
  // Trading
  tradingOrder: require('./trading/order.json'),
  tradingOrders: require('./trading/orders.json'),
  tradingSymbols: require('./trading/symbols.json'),
  tradingTicker: require('./trading/ticker.json')
}
