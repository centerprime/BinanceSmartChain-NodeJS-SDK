import EthManager from '../Node-Ethereum-SDK/src/centerpirme.js';

var ethManager = new EthManager("Infura Url");
ethManager.createAccount("12345").then(
    res=>{
        console.log(res);
    }, error=>{
        console.log(error);
    }
);