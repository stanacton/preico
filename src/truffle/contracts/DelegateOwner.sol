pragma solidity ^0.4.11;

import "./WhitelistPauseableToken.sol";

contract DelegateOwner is WhitelistPauseableToken {

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

    function transferAsDelegate(address _to, uint256 _value) onlyOwnerOrDelegate returns (bool) {
        require(_to != address(0));

        // SafeMath.sub will throw if there is not enough balance.
        balances[owner] = balances[owner].sub(_value);
        balances[_to] = balances[_to].add(_value);
        Transfer(owner, _to, _value);
        return true;    
    }
}