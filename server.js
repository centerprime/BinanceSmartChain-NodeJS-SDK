import express from 'express';
import bodyParser from 'body-parser'
import BnbManager from "./src/centerpirme.js";
import cors from 'cors';


var bnbManager = new BnbManager("https://data-seed-prebsc-1-s1.binance.org:8545");
const app = express(),
      port = 3080;

// place holder for the data
const users = [];
app.use(cors())
app.use(bodyParser.json());

app.post('/api/createWallet', (req, res) => {
  const password = req.body.password;
  let wallet = bnbManager.createAccount(password)
  console.log(wallet);
  res.json(wallet);
});


app.post('/api/importWallet', (req, res) => {
  try {
    const password = req.body.password;
    const keystore = req.body.keystore;
    let wallet = bnbManager.importWalletByKeystore(keystore,password)
    console.log(wallet);
    res.json(wallet);
  } catch(e) {
     return res.status(401).send({
      message : e.message
   });
  }
});

app.post('/api/bnbBalance', async function(req,res) {
  try {
    const address = req.body.address;
    let balance = await bnbManager.getBnbBalance(address)
    console.log(balance);
    res.json(balance);
  } catch(e) {
     return res.status(401).send({
      message : e.message
   });
  }
});

app.post('/api/tokenBalance', async function(req,res) {
  try {
    const address = req.body.address;
    const tokenContractAddress = req.body.tokenAddress;
    let balance = await bnbManager.getBEPTokenBalance(tokenContractAddress,address)
    console.log(balance);
    res.json(balance);
  } catch(e) {
     return res.status(401).send({
      message : e.message
   });
  }
});


app.post('/api/sendBnb', async function(req,res) {
  try {
    const keystore = req.body.keystore;
    const password = req.body.password;
    const toAddress = req.body.toAddress;
    const amount = req.body.amount;
    let balance = await bnbManager.sendBNB(keystore,password,toAddress,amount,3)
    console.log(balance);
    res.json(balance);
  } catch(e) {
     return res.status(401).send({
      message : e.message
   });
  }
});

app.post('/api/sendToken', async function(req,res) {
  try {
    const keystore = req.body.keystore;
    const password = req.body.password;
    const tokenContractAddress = req.body.tokenContractAddress;
    const toAddress = req.body.toAddress;
    const amount = req.body.amount;
    let balance = await bnbManager.sendToken(keystore,password,tokenContractAddress,toAddress,parseFloat(amount),3)
    console.log(balance);
    res.json(balance);
  } catch(e) {
     return res.status(401).send({
      message : e.message
   });
  }
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});