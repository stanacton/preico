pragma solidity ^0.4.11;

import "./Ownable.sol";

contract DelegateOwner is Ownable {
    mapping(address => bool) public delegates;

    function addDelegate(address delegate) onlyOwner returns (bool) {
        delegates[delegate] = true;
        return true;
    }

    function removeDelegate(address delegate) returns (bool) {
        delete delegates[delegate];
        return true;
    }

    modifier onlyOwnerOrDelegate() {
        if (msg.sender == owner || delegates[msg.sender] == true) {
            _;
        } else {
            revert();
        }
    }
}