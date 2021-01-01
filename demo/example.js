import BnbManager from "../src/centerpirme.js";

var bnbManager = new BnbManager("https://data-seed-prebsc-1-s1.binance.org:8545");
bnbManager.getBEPTokenBalance("0x6ce8da28e2f864420840cf74474eff5fd80e65b8","0x082a2027dc16f42d6e69be8fa13c94c17c910ebe").then(
    res=>{
        console.log(res);
    }, error=>{
        console.log(error);
    }
);


let keystore = {};
let password = "";
let amount = 12
let toAddress = '0x38C1E1204C10C8be90ecA671Da8Ea8a9AEb16031'


let tokenContractAddress = '0xa1825717848bdeb9b1b2389471fe0d98c0af71a5';

bnbManager.sendToken(keystore,password,tokenContractAddress, toAddress,amount,3).then(res=>{
    console.log(res);
})   