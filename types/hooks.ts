import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";
import { SWRResponse } from "swr";

export type Web3Dependencies = {
  contract: Contract;
  ethereum: MetaMaskInpageProvider;
  provider: providers.Web3Provider;
  isLoading: boolean;
};

export type CryptoHookFactory<D = any, R = any, P = any> = {
  (d: Partial<Web3Dependencies>): CryptoHandlerHook<D, R, P>;
};

type CryptoHandlerHook<D, R, P> = (params?: P) => CryptoSWRResponse<D, R>;
type CryptoSWRResponse<D, R> = SWRResponse<D> & R;
