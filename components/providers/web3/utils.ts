import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";

import { setupHooks, Web3Hooks } from "components/hooks/web3/setupHooks";
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
  isLoading: boolean;
  hooks: Web3Hooks;
} & Nullable<Web3Dependencies>;

export const createInitialState = (): Web3State => ({
  contract: null,
  ethereum: null,
  provider: null,
  isLoading: true,
  hooks: setupHooks({} as any),
});

export const createWeb3State = ({
  contract,
  ethereum,
  provider,
  isLoading,
}: Web3Dependencies & Pick<Web3State, "isLoading">): Web3State => ({
  contract,
  ethereum,
  provider,
  isLoading,
  hooks: setupHooks({ contract, ethereum, provider }),
});

export const loadContract = async (
  name: string, // NftMarket
  provider: providers.Web3Provider
): Promise<Contract> => {
  if (!NETWORK_ID) {
    return Promise.reject("Network ID is not defined");
  }

  // API request goes to `./public/contracts/${name}.json`
  const response = await fetch(`/contracts/${name}.json`);
  const Artifact = await response.json();

  if (!Artifact.networks[NETWORK_ID].address) {
    return Promise.reject(`Contract [${name}] cannot be loaded!`);
  }

  return new Contract(
    Artifact.networks[NETWORK_ID].address,
    Artifact.abi,
    provider
  );
};
