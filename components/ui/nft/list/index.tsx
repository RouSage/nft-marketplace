import React from "react";

import { useListedNfts } from "components/hooks/web3";
import { NftItem } from "components/ui";

const NftList = () => {
  const { nfts } = useListedNfts();

  return (
    <section className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
      {nfts.data?.map(({ meta, price, tokenId }) => (
        <NftItem
          key={tokenId}
          attributes={meta.attributes}
          description={meta.description}
          image={meta.image}
          name={meta.name}
          price={price}
          onBuy={() => nfts.buyNft(tokenId, price)}
        />
      ))}
    </section>
  );
};

export default NftList;
