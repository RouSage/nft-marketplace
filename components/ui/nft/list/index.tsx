import React from "react";

import { NftItem } from "components/ui";
import { Nft } from "types/nft";

type Props = {
  nfts: Nft[] | undefined;
};

const NftList = ({ nfts }: Props) => (
  <section className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
    {nfts?.map(({ meta }) => (
      <NftItem
        key={meta.name}
        attributes={meta.attributes}
        description={meta.description}
        image={meta.image}
        name={meta.name}
      />
    ))}
  </section>
);

export default NftList;
