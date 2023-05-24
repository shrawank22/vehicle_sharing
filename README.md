<p align="center">
<!--   <a href="" rel="noopener">
    <img width=200px height=200px src="#" alt="Project logo">
 </a> -->
 <h1 style="text-align:center;">Vehicle tokenization for efficient sharing/renting</h1>
</p>

<p align="center">
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Built Using](#built_using)
- [References](#references)

## 🧐 About <a name = "about" id="about"></a>
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

## 🏁 Getting Started <a name = "getting_started" id= "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Bootstrap](https://getbootstrap.com/docs/4.5/getting-started/introduction/)
- [NodeJs](https://nodejs.org/)
- [NPM](https://www.npmjs.com/)
- [Ganche](https://trufflesuite.com/docs/ganache/quickstart/)
- [Sepolia TestNet](https://sepoliafaucet.com/)
- [Metamask wallet](https://metamask.io/)
- [Visual Studio Code](https://code.visualstudio.com/)

### Installing
Follow the below steps to install all the dependencies and run the project
1. Clone the project repository
    ```
    git clone https://github.com/shrawank22/vehicle-sharing.git
    ``` 
2. Go to root directory of the project folder
    ```
    cd vehicle-sharing
    ```
3. To insall all the dependencies which are there in package.json file, run the following command
    ```
    npm install
    ```
4. For compiling and deploying smart contracts, sepolia testnet is used. So go to truffle-config.js file and find line 
    ```
    provider: () => new HDWalletProvider(MNEMONIC, `wss://eth-sepolia.g.alchemy.com/v2/${PROJECT_ID}`),
    ``` 
    Here you need to add your own metamask ```MNEMONIC``` and also you need to replace the ```PROJECT_ID``` with your own Alchemy project id. 
    The best practice is that you should create a ```.env``` file and add both ```MNEMONIC``` and ```PROJECT_ID``` to that file only and this way you don't have to change truffle-config file.
5. When you are done setting up truffle-config file, run the below commands for compiling the smart contract. 
    ```
    truffle compile
    ```
6. Then for deploying on sepolia testnet, run command
    ```
    truffle migrate --network sepolia
    ```
    - For deploying on ganache (For this you need to open Ganache GUI), use command ```truffle migrate```. 
    - If you are using ganache CLI, make sure to update PORT in development to ```8545```
7. Once contract is deployed successfully, You will be getting something like this:
    ```
    1_deploy_contracts.js
    =====================
       Replacing 'VehicleSharing'
       --------------------------
       > transaction hash:    0xe59324306fa78ce97bed9320a92bb7f4ca8abcc0e5271be69dcac5941a329a7e
       > Blocks: 0            Seconds: 8
       > contract address:    0x33de9d83eB96778Ca66370e69a4A88C44D287597
       > block number:        3517239
       > block timestamp:     1684501656
       > account:             0x14e833f0b66B9Fc76c87C4346cada5f214d4A83e
       > balance:             1.454903994834678383
       > gas used:            3212103 (0x310347)
       > gas price:           2.500000009 gwei
       > value sent:          0 ETH
       > total cost:          0.008030257528908927 ETH

       Pausing for 2 confirmations...
    ```
    Copy the contract address from here, and go to js file and replace the contract address with your address. 
    
8. Now to run the project, use command
    ```
    npm start
    ```
    If everything works well then you will get ``` Server started at port 8080``` in terminal after running command npm start. So you need to visit ```http://localhost:8080/``` to view the      application. 

9. To run test files for smart contracts, use  ```truffle test```


## 🎈 Usage <a name="usage" id="usage"></a>

## ⛏️ Built Using <a name = "built_using" id="built_using"></a>

- [Ganache](https://trufflesuite.com/ganache/) - Ethereun Test Network
- [Sepolia TestNet](https://sepoliafaucet.com/) - Sepolia Test network
- [Tuffle](https://trufflesuite.com/) - Ethereum compiler and deployer
- [Solidity](https://docs.soliditylang.org/) - Blockchain smart contracts framework
- [Metamask wallet](https://metamask.io/) - Metamask wallet
- [Express](https://expressjs.com/) - Server Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment


## 🎉 References <a name = "references" id="references"></a>

- https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
- https://medium.com/coinmonks/5-minute-guide-to-deploying-smart-contracts-with-truffle-and-ropsten-b3e30d5ee1e
