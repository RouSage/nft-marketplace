import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";
import { SWRResponse } from "swr";

export type Web3Dependencies = {
  contract: Contract;
  ethereum: MetaMaskInpageProvider;
  provider: providers.Web3Provider;
};

export type CryptoHookFactory<D = any, P = any> = {
  (d: Partial<Web3Dependencies>): CryptoHandlerHook<D, P>;
};

type CryptoHandlerHook<D, P> = (params: P) => CryptoSWRResponse<D>;
type CryptoSWRResponse<D> = SWRResponse<D>;
