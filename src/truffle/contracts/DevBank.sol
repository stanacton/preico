pragma solidity ^0.4.11;

contract DevBank {
    uint256 public currentBalance;
    
    function deposit() payable returns (bool success) {
        currentBalance += msg.value;
        return true;
    }
    
    function withdraw(uint256 _amount) payable returns(bool success) {
        if (currentBalance >= _amount) {
            msg.sender.transfer(_amount);
            currentBalance -= _amount;
            return true;
        } else {
            return false;
        }
    }

    function() payable {
        revert();
    }
}
