import useSWR from "swr";

import { CryptoHookFactory } from "types/hooks";

const NETWORKS: Record<string, string> = {
  1: "Ethereum Main Network",
  3: "Ropsten Test Network",
  4: "Rinkeby Test Network",
  5: "Goerli Test Network",
  42: "Koven Test Network",
  56: "Binance Smart Chain",
  11155111: "Sepolia Test Network",
  1337: "Ganache",
};

const TARGET_CHAIN_ID = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID as string;
const TARGET_NETWORK = NETWORKS[TARGET_CHAIN_ID];

type UseNetworkResponse = {
  isLoading: boolean;
  isSupported: boolean;
  targetNetwork: string;
};

type NetworkHookFactory = CryptoHookFactory<string, UseNetworkResponse>;

export type UseNetworkHook = ReturnType<NetworkHookFactory>;

export const hookFactory: NetworkHookFactory =
  ({ provider, isLoading }) =>
  (params) => {
    const { data, isValidating, ...swr } = useSWR(
      provider ? "web3/useNetwork" : null,
      async () => {
        if (!provider) return "";

        const chainId = (await provider.getNetwork()).chainId;

        if (!chainId) {
          throw "Cannot retrieve network! Please refresh the browser or connect to other one.";
        }

        return NETWORKS[chainId];
      },
      { revalidateOnFocus: false }
    );

    return {
      ...swr,
      data,
      targetNetwork: TARGET_NETWORK,
      isValidating,
      isSupported: data === TARGET_NETWORK,
      isLoading: isLoading || isValidating,
    };
  };
