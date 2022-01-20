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
        resolve(new Web3('http://localhost:18888/rpc'));
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
    const $buyTokens = document.getElementById('buyTokens');
    const $tokenSaleStatus = document.getElementById('tokenSaleStatus');

    $buyTokens.addEventListener('submit', (e) => {
        e.preventDefault();
        const ethValue = e.target.elements[0].value;
        privateSale.methods.buy().send({from: accounts[0], value: ethValue}).then(result => {
            $tokenSaleStatus.innerHTML = `Transaction successfull`;
        }).catch(_e => {
            console.log(e);
            $tokenSaleStatus.innerHTML = `ERROR starting private sale`;
        })
    });

    privateSale.methods.status().call().then(_status => {
        if (_status != '0') {
            document.getElementById("startPrivateSale").style.display="none";
            document.getElementById('privateSaleResult').innerHTML = "Private Sale has already started";
        }
    });
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