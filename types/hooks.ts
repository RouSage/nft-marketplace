import { MetaMaskInpageProvider } from "@metamask/providers";
import { providers } from "ethers";
import { SWRResponse } from "swr";

import { NftMarketContract } from "./nftMarketContract";

export type Web3Dependencies = {
  contract: NftMarketContract;
  ethereum: MetaMaskInpageProvider;
  provider: providers.Web3Provider;
  isLoading: boolean;
};

export type CryptoHookFactory<D = any, R = any, P = any> = {
  (d: Partial<Web3Dependencies>): CryptoHandlerHook<D, R, P>;
};

type CryptoHandlerHook<D, R, P> = (params?: P) => CryptoSWRResponse<D, R>;
type CryptoSWRResponse<D, R> = SWRResponse<D> & R;
