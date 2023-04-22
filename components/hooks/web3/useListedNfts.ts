import { ethers } from "ethers";
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

    const buyNft = async (tokenId: number, value: number) => {
      try {
        const result = await contract?.buyNft(tokenId, {
          value: ethers.utils.parseEther(value.toString()),
        });
        await result?.wait();

        alert("You have bought Nft. See profile page.");
      } catch (error) {
        console.error(error);
      }
    };

    return {
      ...swr,
      data: data || [],
      buyNft,
    };
  };
