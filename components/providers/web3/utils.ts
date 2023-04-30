import { MetaMaskInpageProvider } from "@metamask/providers";
import axios from "axios";
import { Contract, providers } from "ethers";

import { setupHooks, Web3Hooks } from "hooks/web3/setupHooks";
import { Web3Dependencies } from "types/hooks";

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type Web3State = {
  hooks: Web3Hooks;
} & Nullable<Web3Dependencies>;

export const createInitialState = (): Web3State => ({
  contract: null,
  ethereum: null,
  provider: null,
  isLoading: true,
  hooks: setupHooks({ isLoading: true } as any),
});

export const createWeb3State = ({
  contract,
  ethereum,
  provider,
  isLoading,
}: Web3Dependencies): Web3State => ({
  contract,
  ethereum,
  provider,
  isLoading,
  hooks: setupHooks({ contract, ethereum, provider, isLoading }),
});

export const loadContract = async (
  name: string, // NftMarket
  provider: providers.Web3Provider
): Promise<Contract> => {
  if (!NETWORK_ID) {
    return Promise.reject("Network ID is not defined");
  }

  // API request goes to `./public/contracts/${name}.json`
  const { data: Artifact } = await axios.get(`/contracts/${name}.json`);

  if (!Artifact.networks[NETWORK_ID].address) {
    return Promise.reject(`Contract [${name}] cannot be loaded!`);
  }

  return new Contract(
    Artifact.networks[NETWORK_ID].address,
    Artifact.abi,
    provider
  );
};
