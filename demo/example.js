import BnbManager from "../src/centerpirme.js";

var bnbManager = new BnbManager("https://data-seed-prebsc-1-s1.binance.org:8545");
bnbManager.getBEPTokenBalance("0x6ce8da28e2f864420840cf74474eff5fd80e65b8","0x082a2027dc16f42d6e69be8fa13c94c17c910ebe").then(
    res=>{
        console.log(res);
    }, error=>{
        console.log(error);
    }
);


// let keystore = {"address":"07da59bf9aec3d9fe3feab247c8522254a08a9d2","crypto":{"cipher":"aes-128-ctr","ciphertext":"4e5e90aac0855c0e608df649c90eabf1830eda5acaa92e4b0e40c35a78c32306","cipherparams":{"iv":"c2c6c212dfb31d4a98b2c84eef8f9199"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":4096,"p":6,"r":8,"salt":"52ead110bbec5556bf089411de3f1d268bd3605a03ca746e50b6a760b6dd13eb"},"mac":"1c5739ff59d5075c95a743563b42132b60ca12cef583f6ec924f7432d2622f38"},"id":"2cb2f27f-d358-451d-81fe-7a825ebf069e","version":3}
// let password = "12345";
// let amount = 12
// let toAddress = '0x38C1E1204C10C8be90ecA671Da8Ea8a9AEb16031'


// let tokenContractAddress = '0xa1825717848bdeb9b1b2389471fe0d98c0af71a5';

// bnbManager.sendToken(keystore,password,tokenContractAddress, toAddress,amount,3).then(res=>{
//     console.log(res);
// })   