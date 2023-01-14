import { useEffect } from "react";
import useSWR from "swr";

import { CryptoHookFactory } from "types/hooks";

type UseAccountResponse = {
  connect: () => Promise<void>;
  isLoading: boolean;
  isInstalled: boolean;
};

type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>;

export type UseAccountHook = ReturnType<AccountHookFactory>;

export const hookFactory: AccountHookFactory =
  ({ ethereum, provider, isLoading }) =>
  (params) => {
    const { data, isValidating, mutate, ...swr } = useSWR(
      provider ? "web3/useAccount" : null,
      async () => {
        const accounts = await provider?.listAccounts();
        const account = accounts?.[0];

        if (!account) {
          throw "Cannot retrieve account! Please, connect to web3 wallet.";
        }

        return account;
      },
      { revalidateOnFocus: false, shouldRetryOnError: false }
    );

    const connect = async () => {
      try {
        ethereum?.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.error(error);
      }
    };

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];

      if (!accounts.length) {
        console.error("Please, connect to Web3 Wallet");
      } else if (accounts[0] !== data) {
        mutate(accounts[0]);
      }
    };

    useEffect(() => {
      ethereum?.on("accountsChanged", handleAccountsChanged);

      return () => {
        ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      };
    });

    return {
      ...swr,
      data,
      isValidating,
      isLoading: isLoading || isValidating,
      isInstalled: ethereum?.isMetaMask || false,
      mutate,
      connect,
    };
  };
