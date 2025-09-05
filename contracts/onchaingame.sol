// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RPS {
    enum Move { None, Rock, Paper, Scissors }
    mapping(address => Move) public moves;
    address[] public players;

    function play(Move _move) public {
        require(moves[msg.sender] == Move.None, "Already played");
        require(_move != Move.None, "Invalid move");
        players.push(msg.sender);
        moves[msg.sender] = _move;
    }

    function winner() public view returns (address) {
        require(players.length == 2, "Need 2 players");
        Move m1 = moves[players[0]];
        Move m2 = moves[players[1]];
        if (m1 == m2) return address(0);
        if ((m1 == Move.Rock && m2 == Move.Scissors) ||
            (m1 == Move.Paper && m2 == Move.Rock) ||
            (m1 == Move.Scissors && m2 == Move.Paper)) {
            return players[0];
        }
        return players[1];
    }
}
