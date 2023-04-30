import axios from "axios";
import useSWRMutation from "swr/mutation";

import { NftImagePayload, PinataResponse } from "types/api";

const createNftImage = async (
  url: string,
  { arg }: { arg: NftImagePayload }
) => {
  const { data } = await axios.post<PinataResponse>(url, arg);

  return data;
};

export const useCreateNftImage = (
  onSuccess?: (data: PinataResponse) => void
) => {
  const { trigger } = useSWRMutation("/api/verify-image", createNftImage, {
    onSuccess,
    onError: (error) => {
      console.error(error);
    },
  });

  return { createNftImage: trigger };
};
