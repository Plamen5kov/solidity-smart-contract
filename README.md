# Description
A simple project representin a lottery game consisting of 2 main contracts.

* `Lottey.sol` - a smart contract representing a lottery nft minting contract
* `Create2Factory` - a lottery game factory to create a lottery game and deploy the `Lottery.sol` contract

Used: 
* hardhat - provider - to create a local blockchain environment with a few ready accounts to use
* ethers - a client to manage blockchain operations
* Clones - to create a minimal proxy also called a clone of the Lottery smart contract
* Create2 - to deploy a the Lottery smart contract

# How to run:
`git clone git@github.com:Plamen5kov/solidity-smart-contract.git`
`yarn`
`npx hardhat run scripts/lottery.js` OR `npx hardhat test`

# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```