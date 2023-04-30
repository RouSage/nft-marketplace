import { NextApiRequest, NextApiResponse } from "next";

import { NftImagePayload } from "types/api";

import { addressCheckMiddleware, withIronSession } from "./utils";

interface VerifyNftImageReq extends NextApiRequest {
  body: NftImagePayload;
}

async function verifyRoute(req: VerifyNftImageReq, res: NextApiResponse) {
  if (req.method === "POST") {
    const { bytes, contentType, fileName } = req.body;

    if (!bytes || !contentType || !fileName) {
      return res.status(400).send({ message: "Image data is missing!" });
    }

    await addressCheckMiddleware(req, res);

    return res.status(200).send({ message: "Message has been created!" });
  } else {
    return res.status(422).send({ message: "Invalid endpoint!" });
  }
}

export default withIronSession(verifyRoute);
