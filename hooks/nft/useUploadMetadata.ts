import axios from "axios";
import { toast } from "react-toastify";
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
  const { isMutating, trigger } = useSWRMutation(
    "/api/verify",
    uploadMetadata,
    {
      onSuccess: (data) => {
        toast.success("Metadata uploaded");
        onSuccess?.(data);
      },
      onError: (error) => {
        toast.error("Metadata upload error");
        console.error(error);
      },
    }
  );

  return { isUploadingMetadata: isMutating, uploadMetadata: trigger };
};
