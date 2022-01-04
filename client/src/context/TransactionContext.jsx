//we are destructuring ethereum from window
//window.ethereum
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  console.log(contractAddress, contractABI, signer);
};

export const TransactionsProvider = ({ children }) => {
  const [connectedAccount, setConnectedAccount] = useState("");


  



  const checkIfWalletIsConnect = async () => {

      if (!ethereum) return alert("Please install MetaMask.");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(accounts);
  };

  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);


  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  return (
    <TransactionContext.Provider value={{connectWallet}}>
      {children}
    </TransactionContext.Provider>
  );
};
