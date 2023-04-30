import { Maybe } from "@metamask/providers/dist/utils";

import { NftMeta } from "./nft";

export type VerifyPayload = {
  address: string;
  signature: Maybe<string>;
};

export type NftMetaPayload = {
  nft: NftMeta;
} & VerifyPayload;

export type NftImagePayload = {
  bytes: Uint8Array;
  contentType: string;
  fileName: string;
} & VerifyPayload;
