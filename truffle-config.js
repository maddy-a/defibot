/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

const fs = require('fs');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const secrets = JSON.parse(
    fs.readFileSync(".secrets.json").toString().trim()
);

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 9545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    ropsten: {
      provider: () =>
          new HDWalletProvider(
              secrets.seed,
              `https://ropsten.infura.io/v3/lala`
          ),
      network_id: 3
    },
    theta_privatenet: {
      provider: () => {
        var privateKeyTest01 = 'lalalala';
        var privateKeyTest02 = '2222222222222222222222222222222222222222222222222222222222222222';
        var privateKeyTest03 = '3333333333333333333333333333333333333333333333333333333333333333';
        var privateKeyTest04 = '4444444444444444444444444444444444444444444444444444444444444444';
        var privateKeyTest05 = '5555555555555555555555555555555555555555555555555555555555555555';
        var privateKeyTest06 = '6666666666666666666666666666666666666666666666666666666666666666';
        var privateKeyTest07 = '7777777777777777777777777777777777777777777777777777777777777777';
        var privateKeyTest08 = '8888888888888888888888888888888888888888888888888888888888888888';
        var privateKeyTest09 = '9999999999999999999999999999999999999999999999999999999999999999';
        var privateKeyTest10 = '1000000000000000000000000000000000000000000000000000000000000000';

        return new HDWalletProvider({
          privateKeys: [privateKeyTest01, privateKeyTest02, privateKeyTest03, privateKeyTest04, privateKeyTest05, privateKeyTest06, privateKeyTest07, privateKeyTest08, privateKeyTest09, privateKeyTest10],
          providerOrUrl: 'http://localhost:18888/rpc',
        });
      },
      network_id: 366,
      gasPrice: 4000000000000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.9",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },
  mocha: {
    enableTimeouts: false,
    before_timeout: 120000 // Here is 2min but can be whatever timeout is suitable for you.
  }
};
