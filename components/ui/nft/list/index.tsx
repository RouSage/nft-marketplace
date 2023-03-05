import React from "react";

import { NftItem } from "components/ui";
import { Nft } from "types/nft";

type Props = {
  nfts: Nft[] | undefined;
};

const NftList = ({ nfts }: Props) => (
  <section className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
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
