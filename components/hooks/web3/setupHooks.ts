import { Web3Dependencies } from "types/hooks";

import { hookFactory as createAccountHook, UseAccountHook } from "./useAccount";

export type Web3Hooks = {
  useAccount: UseAccountHook;
};

export const setupHooks = (d: Web3Dependencies): Web3Hooks => ({
  useAccount: createAccountHook(d),
});
