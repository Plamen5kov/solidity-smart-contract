import { expect } from 'chai';
import { BigNumber, ethers as Ethers } from 'ethers';
import { ethers, waffle, upgrades } from 'hardhat';

const { deployContract } = waffle;

describe('Lottery ticket', function () {
    let lotteryGameContract: Ethers.Contract;
    let ticketHolder1: Ethers.Signer;
    let ticketHolder2: Ethers.Signer;
    let ticketHolder3: Ethers.Signer;
    let ticketHolder4: Ethers.Signer;

    this.beforeAll(async () => {
        //get current block number so we can start the lottery
        const currentBlockNumber = await ethers.provider.getBlockNumber()

        //get user accounts to buy tickets
        const signers = await ethers.getSigners();
        ticketHolder1 = signers[1]
        ticketHolder2 = signers[2]
        ticketHolder3 = signers[3]
        ticketHolder4 = signers[4]

        //deploy lottery game
        const LotteryGameFactory = await ethers.getContractFactory("LotteryGame")
        lotteryGameContract = await LotteryGameFactory.deploy(currentBlockNumber, currentBlockNumber + 5)
    });

    it('Run a lottery and make sure half the reward stays in the contract after a winner is chosen', async function () {

        //buy a ticket for atleast 0.1 ether
        const options = { value: ethers.utils.parseEther("0.011") }
        await lotteryGameContract.connect(ticketHolder1).enter(options)
        await lotteryGameContract.connect(ticketHolder2).enter(options)
        await lotteryGameContract.connect(ticketHolder3).enter(options)
        await lotteryGameContract.connect(ticketHolder4).enter(options)

        //pick lottery winner
        await lotteryGameContract.pickWinner()

        //show lottery ballance
        console.log(`ballance: ${await lotteryGameContract.getBalance()}`)

        expect(await lotteryGameContract.getBalance()).to.equal(ethers.BigNumber.from("22000000000000000"))
    });
});