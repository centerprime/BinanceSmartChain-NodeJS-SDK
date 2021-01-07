import Web3 from 'web3';
import fs from 'fs';
import os from 'os';
import process from 'process';
import axios from 'axios'

let bep20ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
]

class BnbManager {
    constructor(infuraUrl) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
    }

     createAccount(password) {
        let account = this.web3.eth.accounts.create(password);
        let wallet = this.web3.eth.accounts.wallet.add(account);
        let keystore = wallet.encrypt(password);

        const response = {
            account: account,
            wallet: wallet,
            keystore: keystore,
        }

        /* send to hyperledger */
        const map = {
            "action_type" : "WALLET_CREATE",
            "wallet_address" : wallet.address,
            "network" : this.isMainNet() ? "MAINNET" : "TESTNET",
            "status" : "SUCCESS"
        }
        this.sendToHyperledger(map);

        return response;

    }
    
    importWalletByKeystore(keystore, password) {
        let account = this.web3.eth.accounts.decrypt(keystore, password,false);
        let wallet = this.web3.eth.accounts.wallet.add(account);
        const response = {
            account: account,
            wallet: wallet,
            keystore: keystore,
        };

        /* send to hyperledger */
        const map = {
            "action_type" : "WALLET_IMPORT_KEYSTORE",
            "wallet_address" : wallet.address,
            "network" : this.isMainNet() ? "MAINNET" : "TESTNET",
            "status" : "SUCCESS"
        }
        this.sendToHyperledger(map);
        

        return response;
    }
    
    
    importWalletByPrivateKey(privateKey) {
        const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
        let wallet = this.web3.eth.accounts.wallet.add(account);
        let keystore = wallet.encrypt(this.web3.utils.randomHex(32));
        const responsse = {
            account: account,
            wallet: wallet,
            keystore: keystore,
        };

        /* send to hyperledger */
        const map = {
            "action_type" : "WALLET_IMPORT_PRIVATE_KEY",
            "wallet_address" : wallet.address,
            "network" : this.isMainNet() ? "MAINNET" : "TESTNET",
            "status" : "SUCCESS"
        }
        this.sendToHyperledger(map);

        return responsse;
    }
    
    async getBEPTokenBalance(tokenAddress , address) {
        // ABI to transfer ERC20 Token
        let abi = bep20ABI;
        // Get ERC20 Token contract instance
        let contract = new this.web3.eth.Contract(abi, tokenAddress);
        // Get decimal
        let decimal = await contract.methods.decimals().call();
        console.log(decimal);
        // Get Balance
        let balance = await contract.methods.balanceOf(address).call();
        // Get Name
        let name = await contract.methods.name().call();
        // Get Symbol
        let symbol = await contract.methods.symbol().call();
        /* send to hyperledger */
        const map = {
            "action_type" : "TOKEN_BALANCE",
            "wallet_address" : address,
            "balance" : balance / Math.pow(10,decimal),
            "token_name" : name,
            "token_symbol" : symbol,
            "token_smart_contract" : tokenAddress,
            "network" : this.isMainNet() ? "MAINNET" : "TESTNET",
            "status" : "SUCCESS"
        }
        this.sendToHyperledger(map);
       
        return balance / Math.pow(10,decimal);
    }

    async getBnbBalance(address) {
        // Get Balance
        let balance = await this.web3.eth.getBalance(address);

        /* send to hyperledger */
        const map = {
            "action_type" : "COIN_BALANCE",
            "wallet_address" : address,
            "balance" : balance / Math.pow(10,18),
            "network" : this.isMainNet() ? "MAINNET" : "TESTNET",
            "status" : "SUCCESS"
        }
        this.sendToHyperledger(map);

        return balance / Math.pow(10,18);
    }
    
    async sendBNB(keystore, password, toAddress, amount, chainId) {
        let account = this.web3.eth.accounts.decrypt(keystore, password,false);
        let wallet = this.web3.eth.accounts.wallet.add(account);

        // The gas price is determined by the last few blocks median gas price.
        const avgGasPrice = await this.web3.eth.getGasPrice();
        console.log(avgGasPrice);

        const createTransaction = await this.web3.eth.accounts.signTransaction(
            {
               from: wallet.address,
               to: toAddress,
               value: this.web3.utils.toWei(amount.toString(), 'ether'),
               gas: 21000,
               gasPrice : avgGasPrice
            },
            wallet.privateKey
         );

         console.log(createTransaction);
      
         // Deploy transaction
        const createReceipt = await this.web3.eth.sendSignedTransaction(
            createTransaction.rawTransaction
        );

        console.log(
            `Transaction successful with hash: ${createReceipt.transactionHash}`
        );

        /* send to hyperledger */
        const map = {
            "action_type" : "SEND_BNB",
            "from_wallet_address" : wallet.address,
            "to_wallet_address" : toAddress,
            "amount" : this.web3.utils.toWei(amount.toString(), 'ether'),
            "tx_hash" : createReceipt.transactionHash,
            "network" : this.isMainNet() ? "MAINNET" : "TESTNET",
            "gasLimit" : 21000,
            "gasPrice" : avgGasPrice,
            "fee" : avgGasPrice * 21000,
            "status" : "SUCCESS"
        }
        this.sendToHyperledger(map);
       
        return createReceipt.transactionHash;
    }

    async sendToken(keystore, password, tokenContractAddress , toAddress , amount , chainId) {
        let account = this.web3.eth.accounts.decrypt(keystore, password,false);
        let wallet = this.web3.eth.accounts.wallet.add(account);
        // ABI to transfer ERC20 Token
        let abi = bep20ABI;
        // calculate ERC20 token amount
        let tokenAmount = this.web3.utils.toWei(amount.toString(), 'ether')
        // Get ERC20 Token contract instance
        let contract = new this.web3.eth.Contract(abi, tokenContractAddress, {from: wallet.address});
        const data = await contract.methods.transfer(toAddress, tokenAmount).encodeABI();
        // The gas price is determined by the last few blocks median gas price.
        const gasPrice = await this.web3.eth.getGasPrice();
	    const gasLimit = 90000;
        // Build a new transaction object.
        const rawTransaction = {
            'from': wallet.address,
            'nonce': this.web3.utils.toHex(this.web3.eth.getTransactionCount(wallet.address)),
            'gasPrice': this.web3.utils.toHex(gasPrice),
            'gasLimit': this.web3.utils.toHex(gasLimit),
            'to': tokenContractAddress,
            'value': 0,
            'data': data,
            'chainId': chainId
        };
        const res = await contract.methods.transfer(toAddress, tokenAmount).send({
            from: wallet.address,
            gas: 150000
        });

        console.log(res);

        // Get Name
        let name = await contract.methods.name().call();
        // Get Symbol
        let symbol = await contract.methods.symbol().call();

        /* send to hyperledger */
        const map = {
            "action_type" : "SEND_TOKEN",
            "from_wallet_address" : wallet.address,
            "to_wallet_address" : toAddress,
            "amount" : this.web3.utils.toWei(amount.toString(), 'ether'),
            "tx_hash" : res.transactionHash,
            "gasLimit" : 21000,
            "gasPrice" : gasPrice,
            "fee" : gasPrice * 21000,
            "token_smart_contract" : tokenContractAddress,
            "network" : this.isMainNet() ? "MAINNET" : "TESTNET",
            "token_name" : name,
            "token_symbol" : symbol,
            "status" : "SUCCESS"
        }
        this.sendToHyperledger(map);

        return res;
    }


    async sendToHyperledger(map){

        let url = 'http://34.231.96.72:8081/createTransaction/'
        var osName = '';
        var opsys = process.platform;
        if (opsys == "darwin") {
            osName = "MacOS";
        } else if (opsys == "win32" || opsys == "win64") {
            osName = "Windows";
        } else if (opsys == "linux") {
            osName = "Linux";
        }
        var deviceInfo = {
            'ID' : '910-239lsakd012039-jd9234902',
            'OS' : osName,
            'MODEL': os.type(),
            "SERIAL" : os.release(),
            'MANUFACTURER' : ''
        }
        map['DEVICE_INFO'] = deviceInfo;

        const submitModel = {
            'orgname' : 'org1',
            'username' : 'user1',
            'tx_type' : 'BINANCE',
            'body' : map
        }
        console.log(submitModel);

        axios({
            method: 'post',
            url: url,
            data: submitModel
          }).then(function (response) {
            console.log(response);
        });

    }

    isMainNet() {
        return this.infuraUrl.toString().includes("https://bsc-dataseed1.binance.org:443");
    }

}

export default BnbManager;