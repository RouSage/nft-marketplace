import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

import { NftMeta } from "types/nft";

import {
  contractAddress,
  addressCheckMiddleware,
  withIronSession,
  PINATA_JWT,
} from "./utils";

async function verifyRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { body } = req;

      const nft = body.nft as NftMeta;

      if (
        // !nft.image ||
        !nft.name ||
        !nft.description ||
        !nft.attributes.length
      ) {
        return res
          .status(400)
          .send({ message: "Some of the form data are included!" });
      }

      await addressCheckMiddleware(req, res);

      // https://docs.pinata.cloud/pinata-api/pinning/pin-json
      const jsonRes = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          pinataMetadata: {
            name: uuidv4(),
          },
          pinataContent: nft,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PINATA_JWT}`,
          },
        }
      );

      return res.status(200).send(jsonRes.data);
    } catch {
      return res.status(422).send({ message: "Cannot create JSON!" });
    }
  } else if (req.method === "GET") {
    try {
      const message = {
        contractAddress,
        id: uuidv4(),
      };
      req.session["message-session"] = message;
      await req.session.save();

      return res.json(message);
    } catch {
      return res.status(422).send({ message: "Cannot generate a message!" });
    }
  } else {
    return res.status(200).json({ message: "Invalid API route" });
  }
}

export default withIronSession(verifyRoute);
