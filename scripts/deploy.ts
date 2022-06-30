import { ethers } from "hardhat";

async function main() {

  //get current block number so we can start the lottery
  const currentBlockNumber = await ethers.provider.getBlockNumber()

  //get user accounts to buy tickets
  const signers = await ethers.getSigners();
  const ticketHolder1 = signers[1]
  const ticketHolder2 = signers[2]
  const ticketHolder3 = signers[3]
  const ticketHolder4 = signers[4]

  //deploy lottery game
  const LotteryGameFactory = await ethers.getContractFactory("LotteryGame")
  const lotteryGameContract = await LotteryGameFactory.deploy(currentBlockNumber, currentBlockNumber + 5)

  //attach filter for lotery events
  lotteryGameContract
    .on("TicketCreated", async (to: any, transaction: any) => {
      console.log(to, transaction);
      console.log("TicketCreated")
    });

  //buy a ticket for atleast 0.1 ether
  const options = { value: ethers.utils.parseEther("0.011") }
  lotteryGameContract.connect(ticketHolder1).enter(options)
  lotteryGameContract.connect(ticketHolder2).enter(options)
  lotteryGameContract.connect(ticketHolder3).enter(options)
  lotteryGameContract.connect(ticketHolder4).enter(options)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

