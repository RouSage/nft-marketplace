import useSWR from "swr";

import { CryptoHookFactory } from "types/hooks";

type AccountHookFactory = CryptoHookFactory<string>;

export type UseAccountHook = ReturnType<AccountHookFactory>;

export const hookFactory: AccountHookFactory =
  ({ provider }) =>
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

    return swrResponse;
  };
