import { MetaMaskInpageProvider } from "@metamask/providers";
import { providers } from "ethers";
import React, { createContext, useContext, useEffect, useState } from "react";

import {
  createInitialState,
  createWeb3State,
  loadContract,
  Web3State,
} from "./utils";

const pageReload = () => window.location.reload();

const handleAccountsChanged =
  (ethereum: MetaMaskInpageProvider) => async () => {
    const isUnlocked = await ethereum._metamask.isUnlocked();

    if (!isUnlocked) {
      pageReload();
    }
  };

const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum.on("chainChanged", pageReload);
  ethereum.on("accountsChanged", handleAccountsChanged(ethereum));
};

const removeGlobalListeners = (
  ethereum: MetaMaskInpageProvider | undefined
) => {
  ethereum?.removeListener("chainChanged", pageReload);
  ethereum?.removeListener("accountsChanged", handleAccountsChanged);
};

const Web3Context = createContext<Web3State>(createInitialState());

const Web3Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createInitialState());

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const ethereum = window.ethereum;
        const provider = new providers.Web3Provider(ethereum as any);
        const contract = await loadContract("NftMarket", provider);

        setGlobalListeners(ethereum);
        setWeb3Api(
          createWeb3State({ contract, ethereum, provider, isLoading: false })
        );
      } catch (error) {
        console.error("Please, install Web3 wallet");
        setWeb3Api((prevApi) =>
          createWeb3State({
            ...(prevApi as any),
            isLoading: false,
          })
        );
      }
    };

    initWeb3();

    return () => removeGlobalListeners(window.ethereum);
  }, []);

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);

export const useHooks = () => {
  const { hooks } = useWeb3();

  return hooks;
};

export default Web3Provider;
