import axios from "axios";
import { toast } from "react-toastify";
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
  const { isMutating, trigger } = useSWRMutation(
    "/api/verify-image",
    createNftImage,
    {
      onSuccess: (data) => {
        toast.success("Image uploaded");
        onSuccess?.(data);
      },
      onError: (error) => {
        toast.error("Image upload error");
        console.error(error);
      },
    }
  );

  return { isCreatingNftImage: isMutating, createNftImage: trigger };
};
