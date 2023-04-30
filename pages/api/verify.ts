import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

import { NftMetaPayload } from "types/api";

import {
  contractAddress,
  addressCheckMiddleware,
  withIronSession,
  PINATA_JWT,
  SessionMessage,
} from "./utils";

interface VerifyNftMetaReq extends NextApiRequest {
  body: NftMetaPayload;
}

async function verifyRoute(req: VerifyNftMetaReq, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { nft } = req.body;

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
      const message: SessionMessage = {
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
