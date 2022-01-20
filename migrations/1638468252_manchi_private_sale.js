const ManchiPrivateSale = artifacts.require("ManchiPrivateSale");

module.exports = function(deployer, _network, accounts) {
    deployer.deploy(ManchiPrivateSale, 'ManchiCoin', 'MANCHI', 10, 1000000000000000);
};