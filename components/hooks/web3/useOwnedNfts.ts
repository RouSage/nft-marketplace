import { ethers } from "ethers";
import useSWR from "swr";

import { CryptoHookFactory } from "types/hooks";
import { Nft, NftMeta } from "types/nft";

type UseOwnedNftsResponse = {};

type OwnedNftsHookFactory = CryptoHookFactory<Nft[], UseOwnedNftsResponse>;

export type UseOwnedNftsHook = ReturnType<OwnedNftsHookFactory>;

export const hookFactory: OwnedNftsHookFactory =
  ({ contract }) =>
  (params) => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useOwnedNfts" : null,
      async () => {
        if (!contract) return [];

        const nfts: Nft[] = [];
        const coreNfts = await contract.getOwnedNfts();

        for (const nft of coreNfts) {
          const tokenURI = await contract.tokenURI(nft.tokenId);

          const metaRes = await fetch(tokenURI);
          const meta: NftMeta = await metaRes.json();

          nfts.push({
            price: parseFloat(ethers.utils.formatEther(nft.price)),
            tokenId: nft.tokenId.toNumber(),
            creator: nft.creator,
            isListed: nft.isListed,
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
