import axios from "axios";
import { ethers } from "ethers";
import { useCallback } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

import { CryptoHookFactory } from "types/hooks";
import { Nft, NftMeta } from "types/nft";

type UseListedNftsResponse = {
  buyNft: (tokenId: number, value: number) => Promise<void>;
};

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

          const { data: meta } = await axios.get<NftMeta>(tokenURI, {
            headers: { Accept: "text/plain" },
          });

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

    const _contract = contract;
    const buyNft = useCallback(
      async (tokenId: number, value: number) => {
        try {
          const result = await _contract?.buyNft(tokenId, {
            value: ethers.utils.parseEther(value.toString()),
          });
          await result?.wait();

          toast.success("You have bought Nft. See profile page.");
        } catch (error) {
          toast.error("Processing error");
          console.error(error);
        }
      },
      [_contract]
    );

    return {
      ...swr,
      data: data || [],
      buyNft,
    };
  };
