import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";

import contract from "../../public/contracts/NftMarket.json";

type NETWORK = typeof contract.networks;

const TARGET_NETWORK = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;
export const CONTRACT_ADDRESS = contract.networks[TARGET_NETWORK].address;

export const withIronSession = (handler: NextApiHandler) => {
  return withIronSessionApiRoute(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: "nft-auth-session",
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
