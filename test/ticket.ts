import { expect } from "chai";
import { ethers as Ethers } from "ethers";
import { ethers } from "hardhat";

describe("Lottery ticket", function () {
  let create2FactoryContract: Ethers.Contract;
  let ticketHolder1: Ethers.Signer;
  let ticketHolder2: Ethers.Signer;
  let ticketHolder3: Ethers.Signer;
  let ticketHolder4: Ethers.Signer;

  this.beforeAll(async () => {
    // get current block number so we can start the lottery
    const currentBlockNumber = await ethers.provider.getBlockNumber();
    const salt = "10=-dx1h2=x208";

    // get user accounts to buy tickets
    const signers = await ethers.getSigners();
    ticketHolder1 = signers[1];
    ticketHolder2 = signers[2];
    ticketHolder3 = signers[3];
    ticketHolder4 = signers[4];

    // deploy lottery game
    // create lottery game factory
    const Create2Factory = await ethers.getContractFactory("Create2Factory");

    // deploy the contract
    create2FactoryContract = await Create2Factory.deploy();

    // deploy the lottery game with start configuration
    await create2FactoryContract.deployGame(
      ethers.utils.formatBytes32String(salt),
      currentBlockNumber,
      currentBlockNumber + 8
    );
  });

  it("Run a lottery and make sure half the reward stays in the contract after a valid winner is chosen and funds have been transfered", async function () {
    // buy a ticket for atleast 0.1 ether
    const options = {
      value: ethers.utils.parseEther("0.011"),
      gasLimit: ethers.utils.parseEther("0.000000000003"),
    };
    await create2FactoryContract.connect(ticketHolder1).buyTicket(options);
    await create2FactoryContract.connect(ticketHolder2).buyTicket(options);
    await create2FactoryContract.connect(ticketHolder3).buyTicket(options);
    await create2FactoryContract.connect(ticketHolder4).buyTicket(options);

    await create2FactoryContract.pickWinner();

    console.log(`ballance: ${await create2FactoryContract.getBalance()}`);

    const winnerBalances = [
      await ticketHolder1.getBalance(),
      await ticketHolder2.getBalance(),
      await ticketHolder3.getBalance(),
      await ticketHolder4.getBalance(),
    ].sort();

    const lotteryWinner = winnerBalances[0];
    expect(await create2FactoryContract.getBalance()).to.equal(
      ethers.BigNumber.from("22000000000000000")
    );
    expect(
      lotteryWinner.gt(ethers.BigNumber.from("10000000000000000000000"))
    ).to.eq(true, "someone must be a winner");
  });

  it("Once lottery has ended no more transactions are accepted", async function () {
    // buy a ticket for atleast 0.1 ether
    const options = {
      value: ethers.utils.parseEther("0.011"),
      gasLimit: ethers.utils.parseEther("0.000000000003"),
    };
    await create2FactoryContract.connect(ticketHolder1).buyTicket(options);
    await expect(
      create2FactoryContract.connect(ticketHolder2).buyTicket(options)
    ).to.be.revertedWith("Lottery Ended");
  });
});
