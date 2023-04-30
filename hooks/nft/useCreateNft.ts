import axios from "axios";
import useSWRMutation from "swr/mutation";

import { NftMetaPayload } from "types/api";

const createNft = async (url: string, { arg }: { arg: NftMetaPayload }) => {
  await axios.post(url, arg);
};

export const useCreateNft = () => {
  const { trigger } = useSWRMutation("/api/verify", createNft, {
    onError: (error) => {
      console.error(error);
    },
  });

  return { createNft: trigger };
};
