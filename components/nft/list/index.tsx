import React from "react";

import { NftItem } from "components";
import { NftMeta } from "types/nft";

type Props = {
  nfts: NftMeta[];
};

const NftList = ({ nfts }: Props) => (
  <section className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
    {nfts.map(({ attributes, description, image, name }) => (
      <NftItem
        key={image}
        attributes={attributes}
        description={description}
        image={image}
        name={name}
      />
    ))}
  </section>
);

export default NftList;
