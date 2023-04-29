import {
  bufferToHex,
  ecrecover,
  fromRpcSig,
  keccak,
  pubToAddress,
  toBuffer,
} from "ethereumjs-util";
import { ethers } from "ethers";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

import { NftMarketContract } from "types/nftMarketContract";

import contract from "../../public/contracts/NftMarket.json";

type NETWORK = typeof contract.networks;

const TARGET_NETWORK = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;

const abi = contract.abi;
export const contractAddress = contract.networks[TARGET_NETWORK].address;

export const withIronSession = (handler: NextApiHandler) => {
  return withIronSessionApiRoute(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: "nft-auth-session",
  });
};

// TODO: Properly type `req`
export const addressCheckMiddleware = async (
  req: NextApiRequest,
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

    const { r, s, v } = fromRpcSig(req.body.signature);
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

declare module "iron-session" {
  interface IronSessionData {
    "message-session"?: {
      contractAddress: string;
      id: string;
    };
  }
}
