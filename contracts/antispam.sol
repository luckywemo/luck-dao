// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DMs {
    event Message(address from, address to, string content);

    function send(address to, string memory message) public payable {
        require(msg.value == 0.001 ether, "Fee = 0.001 ETH");
        emit Message(msg.sender, to, message);
        payable(to).transfer(msg.value);
    }
}
