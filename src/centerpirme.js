import Web3 from 'web3';
import fs from 'fs';
import os from 'os';
import process from 'process';
import axios from 'axios'


class EthManager {
    constructor(infuraUrl) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
    }

    async createAccount(password) {
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
            "status" : "SUCCESS"
        }
        this.sendToHyperledger(map);

        return responsse;
    }
    
    async getERCTokenBalance(tokenAddress , address) {
        // ABI to transfer ERC20 Token
        let abi = JSON.parse(fs.readFileSync('erc20ABI.json', 'utf-8'));
        // Get ERC20 Token contract instance
        let contract = new this.web3.eth.Contract(abi, tokenAddress);
        // Get decimal
        let decimal = await contract.methods.decimals().call();
        console.log(decimal);
        // Get Balance
        let balance = await contract.methods.balanceOf(address).call();

        /* send to hyperledger */
        const map = {
            "action_type" : "TOKEN_BALANCE",
            "wallet_address" : wallet.address,
            "balance" : balance / Math.pow(10,decimal),
            "status" : "SUCCESS"
        }
        this.sendToHyperledger(map);
       
        return balance / Math.pow(10,decimal);
    }

    async getEtherBalance(address) {
        // Get Balance
        let balance = await this.web3.eth.getBalance(address);

        /* send to hyperledger */
        const map = {
            "action_type" : "COIN_BALANCE",
            "wallet_address" : address,
            "balance" : balance / Math.pow(10,18),
            "status" : "SUCCESS"
        }
        this.sendToHyperledger(map);

        return balance / Math.pow(10,18);
    }
    
    async sendEther(keystore, password, toAddress, amount, chainId) {
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
            "action_type" : "SEND_ETHER",
            "from_wallet_address" : wallet.address,
            "to_wallet_address" : toAddress,
            "amount" : this.web3.utils.toWei(amount.toString(), 'ether'),
            "tx_hash" : createReceipt.transactionHash,
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
        let abi = JSON.parse(fs.readFileSync('../src/erc20ABI.json', 'utf-8'));
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
            'tx_type' : 'ETHEREUM',
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

}

export default EthManager;