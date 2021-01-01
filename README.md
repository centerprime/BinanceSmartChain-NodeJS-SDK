# Binance SmartChain NodeJS SDK

## Prerequisites

This project requires NodeJS (version 8 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
6.4.1
v8.16.0
```

## Table of contents

- [Project Name](#project-name)
  - [Prerequisites](#prerequisites)
  - [Table of contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Installation](#installation)
  - [API](#api)
    - [Create Wallet](#createwallet)
    - [Import Wallet](#importwallet)
      - [Keystore](#keystore)
      - [Private Key](#keystore)
    - [Balance](#balance)
      - [BNB Balance](#etherbalance)
      - [BEP20 Token Balance](#erc20tokenbalance)
    - [Send](#send)
      - [Send BNB](#sendether)
      - [Send BEP20 Token](#senderc20token)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/centerprime/Node-Binance-SDK.git
```

To install and set up the library, run:

```sh
$ npm install node-binance-sdk
```

## API

### Create Wallet

```js
import BnbManager from "../src/centerprime.js";

var bnbManager = new BnbManager("Infura Url");
bnbManager.createAccount("12345")
  .then(res => {
     console.log(res);
  });
```


### Import Wallet by Keystore

```js
import BnbManager from "../src/centerprime.js";

var bnbManager = new BnbManager("Infura Url");
let keystore = {};
let password = '';
bnbManager.importWalletByKeystore(keystore,password)
  .then(res => {
      console.log(res);
    });
```

### Import Wallet by Private key

```js
import BnbManager from "../src/centerprimeSDK.js";

var bnbManager = new BnbManager("Infura Url");
let privateKey = '';
bnbManager.importWalletByPrivateKey(privateKey)
  .then(res => {
        console.log(res);
      });
```

### Get BNB balance

```js
import BnbManager from "../src/centerprimeSDK.js";

var bnbManager = new BnbManager("Infura Url");
let address = '';
bnbManager.getBnbBalance(address)
  .then(res => {
          console.log(res);
        });
```


### Get BEP20 token balance

```js
import BnbManager from "../src/centerprimeSDK.js";

var bnbManager = new BnbManager("Infura Url");
let tokenContractAddress = '';
let address = '';
bnbManager.getBEPTokenBalance(tokenContractAddress, address)
  .then(res => {
            console.log(res);
        });
```

### Send BEP20 token

```js
import BnbManager from "../src/centerprimeSDK.js";

var bnbManager = new BnbManager("Infura Url");
let keystore = {};
let password = '';
let tokenContractAddress = '';
let toAddress = '';
let amount = '';
let chainId = ''; // 1 : Mainnet 3 : Ropsten
bnbManager.sendToken(keystore, password, tokenContractAddress , toAddress , amount , chainId)
  .then(res => {
            console.log(res);
        });
```


### Send BNB

```js
import BnbManager from "../src/centerprimeSDK.js";

var bnbManager = new BnbManager("Infura Url");
let keystore = {};
let password = '';
let toAddress = '';
let amount = '';
let chainId = ''; // 1 : Mainnet 3 : Ropsten
bnbManager.sendBNB(keystore, password , toAddress , amount , chainId)
  .then(res => {
            console.log(res);
        });
```
