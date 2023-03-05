export type NftAttribute = {
  trait_type: "attack" | "health" | "speed";
  value: string;
};

export type NftMeta = {
  name: string;
  description: string;
  image: string;
  attributes: NftAttribute[];
};

export type NftCore = {
  tokenId: number;
  price: number;
  creator: string;
  isListed: boolean;
};

export type Nft = {
  meta: NftMeta;
} & NftCore;
