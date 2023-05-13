import axios from "axios";
import useSWRMutation from "swr/mutation";

import { NftMetaPayload, PinataResponse } from "types/api";

const uploadMetadata = async (
  url: string,
  { arg }: { arg: NftMetaPayload }
) => {
  const { data } = await axios.post<PinataResponse>(url, arg);

  return data;
};

export const useUploadMetadata = (
  onSuccess?: (data: PinataResponse) => void
) => {
  const { trigger } = useSWRMutation("/api/verify", uploadMetadata, {
    onSuccess,
    onError: (error) => {
      console.error(error);
    },
  });

  return { uploadMetadata: trigger };
};
