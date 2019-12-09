module.exports = (addresses = []) => {
  window.ethereum = {
    isMetaMask: true,
    enable: () => addresses
  }

  window.web3 = {
    eth: {
      sendTransaction: (tx, cb) => cb(null, 'tx-hash')
    }
  }
}
