//we are destructuring ethereum from window
//window.ethereum
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

//Connecting to Ethereum with MetaMask
const getEthereumContract = () => {
  // In ethers, a provider provides an abstraction for a connection to the Ethereum Network. It can be used to issue read only queries and send signed state changing transactions to the Ethereum Network.
  const provider = new ethers.providers.Web3Provider(ethereum);
  // The MetaMask plugin also allows signing transactions to - send ether, pay, change state within the blockchain. For this, you need the account signer...
  const signer = provider.getSigner();

  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  //console.log(contractAddress, contractABI, signer, transactionsContract);

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  
  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(accounts);

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        //getAllTransactions()
        getAllTransactions();
      } else {
        console.log("no account found");
      }
    } catch (error) {
      throw new Error("No ethereum object");
    }
  };

  const checkIfTransactionExist = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.getEthereumCount();

      window.localStorage.setItem("transactionCount", transactionCount);
    } catch (error) {
      console.log;
      throw new Error("No ethereum object");
    }
  };

 

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };


  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask."); 
      const transactionContract = getEthereumContract();
      const availableTransactions = await transactionContract.getAllTransactions()


      const structuredTransactions = availableTransactions.map((transaction)=> ({
        addressTo: transaction.receiver, 
        addressFrom: transaction.sender, 
        timestamp: new Date(transaction.timestamp.toNumber()*1000).toLocaleString(), 
        message: transaction.message, 
        keyword: transaction.keyword, 
        amount: parseInt(transaction.amount._hex)/(10 **18)
      }))
      
      setTransactions(structuredTransactions);
      //console.log( 'get all available Transactions', availableTransactions)

      console.log( 'get all available Transactions', structuredTransactions)

      
    } catch (error) {
      console.log(error)
    }
  }

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      //get the data from the form;
      //1.destructuring
      const { addressTo, amount, keyword, message } = formData;

      const transactionContract = getEthereumContract();
      // to convert it from ether (as a string) to wei (as a BigNumber)
      const parsedAmount = ethers.utils.parseEther(amount);

      // Send  ether from one adress to another
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", //2100 GWEI
            value: parsedAmount._hex, //0.000001 <= we need to convert the decimal to GWEI or Hex.
          },
        ],
      });

      // store transaction
      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);

      const transactionCount = await transactionContract.getEthereumCount();

      setTransactionCount(transactionCount.toNumber());
      
      window.reload()
    } catch (error) {
      console.lof(error);
      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionExist();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        handleChange,
        sendTransaction,
        transactions, 
        isLoading


      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
