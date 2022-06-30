//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./LotteryTicket.sol";

contract LotteryGame {
    address public owner;
    address payable[] public players;
    uint256 public lotteryId;
    mapping(uint256 => address payable) public lotteryHistory;

    LotteryTicket[] public tickets;

    event TicketCreated(address indexed _from);

    constructor() {
        owner = msg.sender;
        lotteryId = 1;
    }

    function getWinnerByLottery(uint256 lottery)
        public
        view
        returns (address payable)
    {
        return lotteryHistory[lottery];
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function enter() public payable {
        require(msg.value > .01 ether);

        //create new ticket and safe mint
        LotteryTicket ticket = new LotteryTicket();
        ticket.safeMint(msg.sender, "metadata.json");

        emit TicketCreated(msg.sender);

        //save ticket in lotery
        tickets.push(ticket);

        // address of player entering lottery
        players.push(payable(msg.sender));
    }

    function getRandomNumber() public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(owner, block.timestamp)));
    }

    function pickWinner() public onlyowner {
        uint256 index = getRandomNumber() % players.length;
        players[index].transfer(address(this).balance);

        lotteryHistory[lotteryId] = players[index];
        lotteryId++;

        // reset the state of the contract
        players = new address payable[](0);
    }

    modifier onlyowner() {
        require(msg.sender == owner);
        _;
    }
}
