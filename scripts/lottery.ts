import { ethers } from "hardhat";

async function main() {
  // get current block number so we can start the lottery
  const currentBlockNumber = await ethers.provider.getBlockNumber();

  // get user accounts to buy tickets
  const signers = await ethers.getSigners();
  const ticketHolder1 = signers[1];
  const ticketHolder2 = signers[2];
  const ticketHolder3 = signers[3];
  const ticketHolder4 = signers[4];
  const salt = "10=-dx1h2=x208";

  // create lottery game factory
  const Create2Factory = await ethers.getContractFactory("Create2Factory");

  // deploy the contract
  const create2FactoryContract = await Create2Factory.deploy();

  // deploy the lottery game with start configuration
  await create2FactoryContract.deployGame(
    ethers.utils.formatBytes32String(salt),
    currentBlockNumber,
    currentBlockNumber + 20
  );

  // attach filter for lotery events
  create2FactoryContract.on("GameWon", async (address: any) => {
    console.log(`game won by: ${address}`);
    console.log(await ticketHolder1.getBalance());
    console.log(await ticketHolder2.getBalance());
    console.log(await ticketHolder3.getBalance());
    console.log(await ticketHolder4.getBalance());
    console.log(`game ballance: ${await create2FactoryContract.getBalance()}`);
  });

  // buy tickets 0.1 ether
  const options = {
    value: ethers.utils.parseEther("0.01"),
    gasLimit: ethers.utils.parseEther("0.000000000003"),
  };
  await create2FactoryContract.connect(ticketHolder1).buyTicket(options);
  await create2FactoryContract.connect(ticketHolder2).buyTicket(options);
  await create2FactoryContract.connect(ticketHolder3).buyTicket(options);
  await create2FactoryContract.connect(ticketHolder4).buyTicket(options);

  // pick lottery winner
  await create2FactoryContract.pickWinner();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
