//SPDX-License-Identifier: UNLICENSED
//choosing a version of solidity 
pragma solidity ^0.8.0;


contract Transactions {
//first  is the type second the var
 uint256 transactionCount;

//later the event has to be emitted from somewhere
 event Transfer(
   address from, address receiver, uint amount, string message, uint256 timestamp, string keyword );


//structure here we specifiyng what properties this object have and of what type are they going to be
//with that we know what properties our transaction needs to have. 
struct  TransferStruct {
  //type || name of the property/ also var?
address sender; 
address receiver; 
uint amount;
string message;
uint256 timestamp; 
string keyword;
}

// we can also define an array of different transactions, cause we want to store all of them 

//name our array :transactions; 
//type TransferStruct[] 

//this means the transactions is going to be an array. This meaning it will be an array of objects. 
TransferStruct[] transactions; 

//public means every can access this function.
//will return nothing just doing something 
function addToBlockchain(address payable receiver, uint amount, 
string memory message, string memory keyword ) public {
 transactionCount += 1; 
 transactions.push(TransferStruct( msg.sender, receiver, amount,message, block.timestamp, keyword));

 emit Transfer(msg.sender, receiver, amount,message, block.timestamp, keyword);

}


function getAllTransactions() public view returns (TransferStruct[] memory) {
  return transactions;
 
}

function getTransaactionCount() public view returns (uint256) {
  return transactionCount;
 
}

}