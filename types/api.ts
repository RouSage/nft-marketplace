import { Maybe } from "@metamask/providers/dist/utils";

import { NftMeta } from "./nft";

export type PinataResponse = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
};

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
