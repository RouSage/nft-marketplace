import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

import { CONTRACT_ADDRESS, withIronSession } from "./utils";

async function verifyRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const message = {
        contractAddress: CONTRACT_ADDRESS,
        id: uuidv4(),
      };
      req.session["message-session"] = message;
      await req.session.save();

      res.json(message);
    } catch {
      res.status(422).send({ message: "Cannot generate a message!" });
    }
  } else {
    res.status(200).json({ message: "Invalid API route" });
  }
}

export default withIronSession(verifyRoute);
