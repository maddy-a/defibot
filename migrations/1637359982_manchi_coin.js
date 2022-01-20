const ManchiCoin = artifacts.require("ManchiCoin");

module.exports = function(deployer, _network, accounts) {
    deployer.deploy(ManchiCoin, 'ManchiCoin', 'MANCHI', 10, 1000000000000000);
};