import { ethers } from "ethers";
import useSWR from "swr";

import { CryptoHookFactory } from "types/hooks";
import { Nft, NftMeta } from "types/nft";

type UseListedNftsResponse = {};

type ListedNftsHookFactory = CryptoHookFactory<Nft[], UseListedNftsResponse>;

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>;

export const hookFactory: ListedNftsHookFactory =
  ({ contract }) =>
  (params) => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useListedNfts" : null,
      async () => {
        if (!contract) return [];

        const nfts: Nft[] = [];
        const coreNfts = await contract.getAllNftsOnSale();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          const tokenURI = await contract.tokenURI(item.tokenId);

          const metaRes = await fetch(tokenURI);
          const meta: NftMeta = await metaRes.json();

          nfts.push({
            price: parseFloat(ethers.utils.formatEther(item.price)),
            tokenId: item.tokenId.toNumber(),
            creator: item.creator,
            isListed: item.isListed,
            meta,
          });
        }

        return nfts;
      }
    );

    return {
      ...swr,
      data: data || [],
    };
  };
