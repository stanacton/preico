pragma solidity ^0.4.11;

import "./WhitelistPauseableToken.sol";

contract DelegateableOwnerToken is WhitelistPauseableToken {

    function transferAsDelegate(address _to, uint256 _value) onlyOwnerOrDelegate returns (bool) {
        require(_to != address(0));

        // SafeMath.sub will throw if there is not enough balance.
        balances[owner] = balances[owner].sub(_value);
        balances[_to] = balances[_to].add(_value);
        Transfer(owner, _to, _value);
        return true;    
    }
}