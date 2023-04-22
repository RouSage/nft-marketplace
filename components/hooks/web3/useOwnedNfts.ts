import { ethers } from "ethers";
import { useCallback } from "react";
import useSWR from "swr";

import { CryptoHookFactory } from "types/hooks";
import { Nft, NftMeta } from "types/nft";

type UseOwnedNftsResponse = {
  listNft: (tokenId: number, price: number) => Promise<void>;
};

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

    const _contract = contract;
    const listNft = useCallback(
      async (tokenId: number, price: number) => {
        try {
          const result = await _contract?.placeNftOnSale(
            tokenId,
            ethers.utils.parseEther(price.toString()),
            {
              value: ethers.utils.parseEther((0.025).toString()),
            }
          );
          await result?.wait();

          alert("Item has been listed");
        } catch (error) {
          console.error(error);
        }
      },
      [_contract]
    );

    return {
      ...swr,
      data: data || [],
      listNft,
    };
  };
