import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";

import { Web3Hooks } from "components/hooks/web3/setupHooks";

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

type Web3Params = {
  ethereum: MetaMaskInpageProvider | null;
  provider: providers.Web3Provider | null;
  contract: Contract | null;
};

export type Web3State = {
  isLoading: boolean;
  hooks: Web3Hooks;
} & Web3Params;

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
