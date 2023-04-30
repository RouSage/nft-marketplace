import axios from "axios";
import useSWRMutation from "swr/mutation";

import { NftImagePayload } from "types/api";

const createNftImage = async (
  url: string,
  { arg }: { arg: NftImagePayload }
) => {
  await axios.post(url, arg);
};

export const useCreateNftImage = () => {
  const { trigger } = useSWRMutation("/api/verify-image", createNftImage, {
    onError: (error) => {
      console.error(error);
    },
  });

  return { createNftImage: trigger };
};
