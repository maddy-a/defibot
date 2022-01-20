import Web3 from 'web3';
import ManchiPrivateSale from '../build/contracts/ManchiPrivateSale.json';
import ManchiCoin from '../build/contracts/ManchiCoin.json';

let web3;
let privateSale;
let accounts = [];
let manchiCoin;

const initWeb3 = () => {
    return new Promise((resolve, reject) => {
        if(typeof window.ethereum !== 'undefined') {
            web3 = new Web3(window.ethereum);
            window.ethereum.enable()
                .then(() => {
                    resolve(
                        new Web3(window.ethereum)
                    );
                })
                .catch(e => {
                    reject(e);
                });
            return;
        }
        if(typeof window.web3 !== 'undefined') {
            return resolve(
                new Web3(window.web3.currentProvider)
            );
        }
        resolve(new Web3('http://localhost:9545'));
    });
};

const initPrivateSaleContract = async () => {
    const networkId = await web3.eth.net.getId();
    return new web3.eth.Contract(
        ManchiPrivateSale.abi,
        ManchiPrivateSale
            .networks[networkId]
            .address
    );
};


const loadMetamaskAccounts = async () => {
    await window.ethereum.enable();

    web3.eth.getAccounts(function (error, _accounts) {
        accounts = _accounts;
    });

    window.ethereum.on('accountsChanged', function () {
        web3.eth.getAccounts(function (error, _accounts) {
            accounts = _accounts;
        });
    });
}

const initSaleInfo = () => {
    const $tokenName = document.getElementById('token-name');
    const $tokenSymbol = document.getElementById('token-symbol');
    const $decimals = document.getElementById('decimals');
    const $tokenSupply = document.getElementById('supply');
    const $status = document.getElementById('status');
    const $availableT = document.getElementById('available-tokens');
    const $tokensSold = document.getElementById('tokens-sold');
    const $price = document.getElementById('price');

    manchiCoin.methods.name().call().then(_name => {
        $tokenName.innerHTML = _name;
    }).catch(_er => {
        $tokenName.innerHTML = _er
    });
    manchiCoin.methods.symbol().call().then(_name => {
        $tokenSymbol.innerHTML = _name;
    }).catch(_er => {
        $tokenSymbol.innerHTML = _er
    });
    manchiCoin.methods.decimals().call().then(_name => {
        $decimals.innerHTML = _name;
    }).catch(_er => {
        $decimals.innerHTML = _er
    });
    manchiCoin.methods.totalSupply().call().then(_name => {
        $tokenSupply.innerHTML = _name;
    }).catch(_er => {
        $tokenSupply.innerHTML = _er
    });
    privateSale.methods.status().call().then(_status => {
        let s;
        console.log(_status)
        switch (_status) {
            case '0':
                s = "INIT";
                break;
            case '1':
                s = "ACTIVE";
                break;
            case '2':
                s = "ENDED";
                break;
            case '3':
                s = "AIRDROPPED";
                break;
        }
        $status.innerHTML = s;
    }).catch(_er => {
        $status.innerHTML = _er
    });
    privateSale.methods.availableTokens().call().then(_availableTokens => {
        $availableT.innerHTML = _availableTokens;
    }).catch(_er => {
        $availableT.innerHTML = _er
    });
    privateSale.methods.price().call().then(_price => {
        $price.innerHTML = _price;
    }).catch(_er => {
        $price.innerHTML = _er
    });
    privateSale.methods.totalTokensSold().call().then(_sold => {
        $tokensSold.innerHTML = _sold;
    }).catch(_er => {
        $tokensSold.innerHTML = _er
    });
};

const initApp = () => {
    const $whitelist = document.getElementById('whitelist');
    const $transactionResult = document.getElementById('transaction-result');

    $whitelist.addEventListener('submit', (e) => {
        e.preventDefault();
        const investorAddress = e.target.elements[0].value;
        privateSale.methods.whitelist(investorAddress).send({from: accounts[0]}).then(result => {
            $transactionResult.innerHTML = `Address Whitelisted`;
            refreshInvestors();
        }).catch(_e => {
            console.log(e);
            $transactionResult.innerHTML = `ERROR whitelisting`;
        })
    });

    const $airdrop = document.getElementById('airDrop');
    $airdrop.addEventListener('submit', (e) => {
        e.preventDefault();
        privateSale.methods.release().send({from: accounts[0]}).then(result => {
            $transactionResult.innerHTML = `All the funds have been airdropped`;
        }).catch(_e => {
            console.log(e);
            $transactionResult.innerHTML = `Airdropping failed`;
        })
    });

    const $withdraw = document.getElementById('withdraw');
    $withdraw.addEventListener('submit', (e) => {
        e.preventDefault();
        const account = e.target.elements[0].value;
        const amount = e.target.elements[1].value;
        privateSale.methods.withdraw(account, amount).send({from: accounts[0]}).then(result => {
            $transactionResult.innerHTML = `Withdrawal Successfull`;
        }).catch(_e => {
            console.log(e);
            $transactionResult.innerHTML = `ERROR withdrawing`;
        })
    });

    const $endPrivateSale = document.getElementById('markICOASEnded');
    $endPrivateSale.addEventListener('submit', (e) => {
        privateSale.methods.markICOAsEnded().send({from: accounts[0]}).then(result => {
            $transactionResult.innerHTML = `Private Sale ended Successfull`;
        }).catch(_e => {
            console.log(e);
            $transactionResult.innerHTML = `ERROR ending private sale`;
        })
    });
    refreshInvestors();
}

const refreshInvestors = async() => {
    const $allSales = document.getElementById('allSales');

    privateSale.methods.getAllInvestors().call().then(_allSales => {
        if (_allSales.length == 0) {
            document.getElementById("allSalesDiv").style.display="none";
        }
        loadInvestorstable(_allSales);
    });
}

const loadInvestorstable = async (_allSales) => {
    for(var i=0; i <_allSales.length; i++){
        var table = document.getElementById('allSales');
        var rowCount = table.rows.length;
        var row = table.insertRow(rowCount);
        var cell1 = row.insertCell(0);
        cell1.innerHTML = _allSales[i];
        var cell2 = row.insertCell(1);
        await privateSale.methods.sales(_allSales[i]).call().then(_saleStruct => {
            cell2.innerHTML = _saleStruct.quantity;
        })
        var cell3 = row.insertCell(2);
        await manchiCoin.methods.balanceOf(_allSales[i]).call().then(bal => {
            cell3.innerHTML = bal;
        })
    }
}
const getSaleStruct = async (addr) => {
    const a =  await privateSale.methods.sales(addr).call().then(_saleStruct => {
        return _saleStruct;
    });

    return a;
}
const getTokenAddress = async () => {
    const a =  await privateSale.methods.manchiCoinAddress().call().then(_addr => {
        return _addr;
    });
    return new web3.eth.Contract(
        ManchiCoin.abi,
        a
    );
}

const initTokenContract = async() => {
    return await getTokenAddress();
}

document.addEventListener('DOMContentLoaded', () => {
    initWeb3()
        .then(_web3 => {
            web3 = _web3;
            return initPrivateSaleContract();
        })
        .then(_privateSale => {
            privateSale = _privateSale;
            return initTokenContract();
        }).then(_tokenContract => {
            manchiCoin = _tokenContract;
        loadMetamaskAccounts();
        initSaleInfo();
        initApp();
    });
});