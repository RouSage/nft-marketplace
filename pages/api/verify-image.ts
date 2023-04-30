import axios from "axios";
import FormData from "form-data";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

import { NftImagePayload, PinataResponse } from "types/api";

import { PINATA_JWT, addressCheckMiddleware, withIronSession } from "./utils";

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

    const buffer = Buffer.from(Object.values(bytes));

    const formData = new FormData();
    formData.append("file", buffer, {
      contentType,
      filename: `${fileName}-${uuidv4()}`,
    });

    // https://docs.pinata.cloud/pinata-api/pinning/pin-file-or-directory#uploading-and-pinning-a-single-file
    const jsonRes = await axios.post<PinataResponse>(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      }
    );

    return res.status(200).send(jsonRes.data);
  } else {
    return res.status(422).send({ message: "Invalid endpoint!" });
  }
}

export default withIronSession(verifyRoute);
