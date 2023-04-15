import { Web3Dependencies } from "types/hooks";

import { hookFactory as createAccountHook, UseAccountHook } from "./useAccount";
import {
  hookFactory as createListedNftsHook,
  UseListedNftsHook,
} from "./useListedNfts";
import { hookFactory as createNetworkHook, UseNetworkHook } from "./useNetwork";
import {
  hookFactory as createOwnedNftsHook,
  UseOwnedNftsHook,
} from "./useOwnedNfts";

export type Web3Hooks = {
  useAccount: UseAccountHook;
  useNetwork: UseNetworkHook;
  useListedNfts: UseListedNftsHook;
  useOwnedNfts: UseOwnedNftsHook;
};

export const setupHooks = (d: Web3Dependencies): Web3Hooks => ({
  useAccount: createAccountHook(d),
  useNetwork: createNetworkHook(d),
  useListedNfts: createListedNftsHook(d),
  useOwnedNfts: createOwnedNftsHook(d),
});
