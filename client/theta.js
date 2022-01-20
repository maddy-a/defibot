import * as thetajs from "@thetalabs/theta-js";
const BigNumber = require('bignumber.js');

const testThetaConnection = async() => {
    const {ChainIds} = thetajs.networks;
    var privatenet = new thetajs.providers.HttpProvider(ChainIds.Privatenet);
    const provider = new thetajs.providers.HttpProvider(privatenet, 'http://localhost:16888/rpc');
    const result = await provider.getAccount("ACC");
    console.log(result);
    const blockHeight = await provider.getBlockNumber();
    console.log(blockHeight)

    // Wallet

    const Wallet = thetajs.Wallet;

    var testWallet = new Wallet('WALL', privatenet);
    // console.log(testWallet.connect(provider));
    console.log(testWallet);

    // send transactions
    const ten18 = (new BigNumber(10)).pow(18); // 10^18, 1 Theta = 10^18 ThetaWei, 1 Gamma = 10^ TFuelWei
    const thetaWeiToSend = (new BigNumber(0));
    const tfuelWeiToSend = (new BigNumber(0.0001)).multipliedBy(ten18);
    const from =  "FROM";
    const to = "TO";
    const txData = {
        from: from,
        outputs: [
            {
                address: to,
                thetaWei: thetaWeiToSend,
                tfuelWei: tfuelWeiToSend,
            }
        ],
        sequence: 104
    }

    const transaction = new thetajs.transactions.SendTransaction(txData);
    const txnRes = await testWallet.sendTransaction(transaction);
    console.log(txnRes);

}


document.addEventListener('DOMContentLoaded', () => {
   testThetaConnection();
});