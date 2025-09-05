// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FeedbackBoard {
    string[] public messages;

    function submit(string memory message) public {
        messages.push(message);
    }

    function get(uint index) public view returns (string memory) {
        return messages[index];
    }

    function count() public view returns (uint) {
        return messages.length;
    }
}
