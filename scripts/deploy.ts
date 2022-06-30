import { ethers } from "hardhat";

async function main() {

  //get a user account to buy a ticket
  const signers = await ethers.getSigners();
  const ticketHolder = signers[1]

  //deploy lottery game
  const LotteryGameFactory = await ethers.getContractFactory("LotteryGame")
  const lotteryGameContract = await LotteryGameFactory.deploy()

  //attach filter for lotery events
  lotteryGameContract
    .on("TicketCreated", async (to: any, amount: any, from: any) => {
      // console.log(to, amount, from);
      console.log("TicketCreated")
    });

  //connect to the lotery contract
  const connectedGameContract = lotteryGameContract.connect(ticketHolder)

  //buy a ticket for atleast 0.1 ether
  const options = { value: ethers.utils.parseEther("0.011") }
  connectedGameContract.enter(options)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

