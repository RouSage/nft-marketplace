import { providers } from "ethers";
import React, { createContext, useContext, useEffect, useState } from "react";

import {
  createInitialState,
  createWeb3State,
  loadContract,
  Web3State,
} from "./utils";

const Web3Context = createContext<Web3State>(createInitialState());

const Web3Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createInitialState());

  useEffect(() => {
    const initWeb3 = async () => {
      const ethereum = window.ethereum;
      const provider = new providers.Web3Provider(ethereum as any);
      const contract = await loadContract("NftMarket", provider);

      setWeb3Api(
        createWeb3State({ contract, ethereum, provider, isLoading: false })
      );
    };

    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);

export default Web3Provider;
