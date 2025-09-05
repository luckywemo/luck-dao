// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bookmarks {
    mapping(address => string[]) public bookmarks;

    function add(string memory link) public {
        bookmarks[msg.sender].push(link);
    }

    function get(uint index) public view returns (string memory) {
        return bookmarks[msg.sender][index];
    }

    function count() public view returns (uint) {
        return bookmarks[msg.sender].length;
    }
}
