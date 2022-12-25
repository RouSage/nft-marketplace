import { providers } from "ethers";
import React, { createContext, useContext, useEffect, useState } from "react";

import { setupHooks } from "components/hooks/web3/setupHooks";

import { loadContract, Web3State } from "./utils";

const initialState: Web3State = {
  contract: null,
  ethereum: null,
  provider: null,
  isLoading: true,
  hooks: setupHooks({} as any),
};

const Web3Context = createContext<Web3State>(initialState);

const Web3Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(initialState);

  useEffect(() => {
    const initWeb3 = async () => {
      const ethereum = window.ethereum;
      const provider = new providers.Web3Provider(ethereum as any);
      const contract = await loadContract("NftMarket", provider);

      setWeb3Api({
        ethereum,
        contract,
        provider,
        isLoading: false,
        hooks: setupHooks({ contract, ethereum, provider }),
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
