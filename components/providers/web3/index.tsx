import { ethers } from "ethers";
import React, { createContext, useContext, useEffect, useState } from "react";

import { Web3State } from "./utils";

const initialState: Web3State = {
  contract: null,
  ethereum: null,
  provider: null,
  isLoading: true,
};

const Web3Context = createContext<Web3State>(initialState);

const Web3Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(initialState);

  useEffect(() => {
    const initWeb3 = () => {
      const ethereum = window.ethereum;
      const provider = new ethers.providers.Web3Provider(ethereum as any);

      setWeb3Api({
        ethereum,
        contract: null,
        provider,
        isLoading: false,
      });
    };

    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);

export default Web3Provider;
