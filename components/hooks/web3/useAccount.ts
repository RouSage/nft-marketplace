import useSWR from "swr";

import { CryptoHookFactory } from "types/hooks";

type UseAccountResponse = {
  connect: () => Promise<void>;
};

type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>;

export type UseAccountHook = ReturnType<AccountHookFactory>;

export const hookFactory: AccountHookFactory =
  ({ ethereum, provider }) =>
  (params) => {
    const swrResponse = useSWR(
      provider ? "web3/useAccount" : null,
      async () => {
        const accounts = await provider?.listAccounts();
        const account = accounts?.[0];

        if (!account) {
          throw "Cannot retrieve account! Please, connect to web3 wallet.";
        }

        return account;
      },
      { revalidateOnFocus: false }
    );

    const connect = async () => {
      try {
        ethereum?.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.error(error);
      }
    };

    return { ...swrResponse, connect };
  };
