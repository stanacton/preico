pragma solidity ^0.4.11;

import "./zeppelin-solidity/contracts/token/PausableToken.sol";

contract WhitelistPauseableToken is PausableToken {
    mapping(address => bool) public whitelist;
    bool public whitelistEnabled;

    function WhitelistPauseableToken() {
      whitelistEnabled = false;
    }

    event AddedToWhitelist(address indexed user, address indexed owner);
    event RemovedFromWhitelist(address indexed user, address indexed owner);

    function addToWhitelist(address user) onlyOwner returns (bool) {
        whitelist[user] = true;
        AddedToWhitelist(user, owner);
        return true;
    }

    function removeFromWhitelist(address user) onlyOwner returns (bool) {
        whitelist[user] = false;
        RemovedFromWhitelist(user, owner);
        return true;
    }

    function enableWhitelist() onlyOwner returns (bool) {
      whitelistEnabled = true;
      return true;
    }

    function disableWhitelist() onlyOwner returns (bool) {
      whitelistEnabled = false;
      return true;
    }

    modifier inWhitelist() {
      if (whitelistEnabled == false) {
        _;
      } else if (whitelist[msg.sender] == true) {
        _;
      } else if (msg.sender == owner) {
        _;
      } else {
        revert();
      }
    } 

  function transfer(address _to, uint256 _value) public inWhitelist returns (bool) {
    return super.transfer(_to, _value);
  }

  function transferFrom(address _from, address _to, uint256 _value) public inWhitelist returns (bool) {
    return super.transferFrom(_from, _to, _value);
  }

  function approve(address _spender, uint256 _value) public inWhitelist returns (bool) {
    return super.approve(_spender, _value);
  }

  function increaseApproval(address _spender, uint _addedValue) public inWhitelist returns (bool success) {
    return super.increaseApproval(_spender, _addedValue);
  }

  function decreaseApproval(address _spender, uint _subtractedValue) public inWhitelist returns (bool success) {
    return super.decreaseApproval(_spender, _subtractedValue);
  }
}