
require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity:'0.8.0', 
  networks: {
    ropsten: {
      url:'https://eth-ropsten.alchemyapi.io/v2/2rVIJuKK3EIhID0rwBnbx3oGzTMgXAE3', 
      accounts: ['d883b1228efe2d85928f62bfba7e724cef1168e855d7a5b92c8a5375f94ef2ac'] 
    }
  }

}