import {
  bufferToHex,
  ecrecover,
  fromRpcSig,
  keccak,
  pubToAddress,
  toBuffer,
} from "ethereumjs-util";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

import { VerifyPayload } from "types/api";

import contract from "../../public/contracts/NftMarket.json";

type NETWORK = typeof contract.networks;

const TARGET_NETWORK = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;
export const PINATA_JWT = process.env.PINATA_JWT as string;

export const contractAddress = contract.networks[TARGET_NETWORK].address;

export const withIronSession = (handler: NextApiHandler) => {
  return withIronSessionApiRoute(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: "nft-auth-session",
  });
};

interface AddressCheckReq extends NextApiRequest {
  body: VerifyPayload;
}

export const addressCheckMiddleware = async (
  req: AddressCheckReq,
  res: NextApiResponse
) => {
  return new Promise(async (resolve, reject) => {
    const message = req.session["message-session"];
    // Can access contract on the server
    // const provider = new ethers.providers.JsonRpcProvider(
    //   "HTTP://127.0.0.1:7545"
    // );
    // const contract = new ethers.Contract(
    //   contractAddress,
    //   abi,
    //   provider
    // ) as unknown as NftMarketContract;

    let nonce: string | Buffer = `\x19Ethereum Signed Message:\n${
      JSON.stringify(message).length
    }${JSON.stringify(message)}`;
    nonce = keccak(Buffer.from(nonce, "utf-8"));

    const { r, s, v } = fromRpcSig(req.body.signature as string);
    const pubKey = ecrecover(toBuffer(nonce), v, r, s);
    const addrBuffer = pubToAddress(pubKey);
    const address = bufferToHex(addrBuffer);

    if (address === req.body.address) {
      resolve("Correct Address");
    } else {
      reject("Wrong Address");
    }
  });
};

export type SessionMessage = {
  contractAddress: string;
  id: string;
};

declare module "iron-session" {
  interface IronSessionData {
    "message-session"?: SessionMessage;
  }
}
