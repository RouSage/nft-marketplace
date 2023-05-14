import { Switch } from "@headlessui/react";
import axios from "axios";
import classNames from "classnames";
import { ethers } from "ethers";
import { NextPage } from "next";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";

import { useWeb3 } from "components/providers/web3";
import { BaseLayout } from "components/ui";
import { useCreateNftImage } from "hooks/nft/useCreateNftImage";
import { useUploadMetadata } from "hooks/nft/useUploadMetadata";
import { SessionMessage } from "pages/api/utils";
import { NftMeta } from "types/nft";

const PINATA_DOMAIN = process.env.NEXT_PUBLIC_PINATA_DOMAIN;
const ALLOWED_FIELDS = ["name", "description", "image", "attributes"];

const NftCreate: NextPage = () => {
  const { ethereum, contract } = useWeb3();

  const [nftURI, setNftURI] = useState("");
  const [hasURI, setHasURI] = useState(false);
  const [price, setPrice] = useState("");
  const [nftMeta, setNftMeta] = useState<NftMeta>({
    name: "",
    description: "",
    image: "",
    attributes: [
      {
        trait_type: "attack",
        value: "0",
      },
      {
        trait_type: "health",
        value: "0",
      },
      {
        trait_type: "speed",
        value: "0",
      },
    ],
  });

  const { isCreatingNftImage, createNftImage } = useCreateNftImage(
    ({ IpfsHash }) => {
      setNftMeta((prevMeta) => ({
        ...prevMeta,
        image: `${PINATA_DOMAIN}/ipfs/${IpfsHash}`,
      }));
    }
  );
  const { isUploadingMetadata, uploadMetadata } = useUploadMetadata(
    ({ IpfsHash }) => {
      setNftURI(`${PINATA_DOMAIN}/ipfs/${IpfsHash}`);
    }
  );

  const getSignedData = async () => {
    const messageToSign = await axios.get<SessionMessage>("/api/verify");
    const accounts = (await ethereum?.request({
      method: "eth_requestAccounts",
    })) as string[];
    const account = accounts[0];

    const signedData = await ethereum?.request<string>({
      method: "personal_sign",
      params: [
        JSON.stringify(messageToSign.data),
        account,
        messageToSign.data.id,
      ],
    });

    return { signedData, account };
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNftMeta((prevMeta) => ({ ...prevMeta, [name]: value }));
  };

  const handleAttributeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const attributeIdx = nftMeta.attributes.findIndex(
      ({ trait_type }) => trait_type === name
    );
    if (attributeIdx !== -1) {
      const newAttributes = [...nftMeta.attributes];
      newAttributes[attributeIdx].value = value;

      setNftMeta((prevMeta) => ({
        ...prevMeta,
        attributes: newAttributes,
      }));
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;

    if (!target.files || !target.files.length) {
      console.error("Select a file");

      return;
    }

    const file = target.files[0];
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const { account, signedData } = await getSignedData();
    createNftImage({
      address: account,
      signature: signedData,
      bytes,
      contentType: file.type,
      fileName: file.name.replace(/\.[^\/.]+$/, ""),
    });
  };

  const handleCreateNft = async () => {
    const { account, signedData } = await getSignedData();
    uploadMetadata({ address: account, nft: nftMeta, signature: signedData });
  };

  const handleListNft = async () => {
    try {
      const { data } = await axios.get(nftURI, {
        headers: { Accept: "text/plain" },
      });

      Object.keys(data).forEach((key) => {
        if (!ALLOWED_FIELDS.includes(key)) {
          throw new Error("Invalid JSON structure!");
        }
      });

      const transaction = await contract?.mintToken(
        nftURI,
        ethers.utils.parseEther(price),
        {
          value: ethers.utils.parseEther((0.025).toString()),
        }
      );

      await transaction?.wait();
      toast.success("NFT listed");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <BaseLayout>
      <div>
        <div className="py-4">
          {!nftURI && (
            <section className="flex">
              <h5 className="mr-2 font-bold underline">
                Do you have meta data already?
              </h5>
              <Switch
                checked={hasURI}
                onChange={() => setHasURI(!hasURI)}
                className={classNames(
                  "relative inline-flex h-[28px] w-[64px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75",
                  hasURI ? "bg-indigo-900" : "bg-indigo-700"
                )}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    "pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                    hasURI ? "translate-x-9" : "translate-x-0"
                  )}
                />
              </Switch>
            </section>
          )}
        </div>
        {nftURI || hasURI ? (
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <aside className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  List NFT
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>
            </aside>
            <section className="mt-5 md:col-span-2 md:mt-0">
              <form>
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                  {hasURI && (
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                      <div>
                        <label
                          htmlFor="uri"
                          className="block text-sm font-medium text-gray-700"
                        >
                          URI Link
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            onChange={(e) => setNftURI(e.target.value)}
                            type="text"
                            name="uri"
                            id="uri"
                            className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="http://link.com/data.json"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {nftURI && (
                    <div className="mb-4 p-4">
                      <div className="font-bold">Your metadata: </div>
                      <div>
                        <a
                          href={nftURI}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 underline"
                        >
                          {nftURI}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Price (ETH)
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="number"
                          name="price"
                          id="price"
                          className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="0.8"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={handleListNft}
                    >
                      List
                    </button>
                  </div>
                </div>
              </form>
            </section>
          </div>
        ) : (
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <aside className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Create NFT Metadata
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>
            </aside>
            <section className="mt-5 md:col-span-2 md:mt-0">
              <form>
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="My Nice NFT"
                          value={nftMeta.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Some nft description..."
                          value={nftMeta.description}
                          onChange={handleChange}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Brief description of NFT
                      </p>
                    </div>
                    {!!nftMeta.image ? (
                      <img
                        src={nftMeta.image}
                        alt="nft image"
                        className="h-40"
                      />
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Image
                        </label>
                        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  onChange={handleImageChange}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-6 gap-6">
                      {nftMeta.attributes.map(({ trait_type, value }) => (
                        <div
                          key={trait_type}
                          className="col-span-6 sm:col-span-6 lg:col-span-2"
                        >
                          <label
                            htmlFor={trait_type}
                            className="block text-sm font-medium text-gray-700"
                          >
                            {trait_type}
                          </label>
                          <input
                            type="text"
                            name={trait_type}
                            id={trait_type}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={value}
                            onChange={handleAttributeChange}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="!mt-2 text-sm text-gray-500">
                      Choose value from 0 to 100
                    </p>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={handleCreateNft}
                      disabled={isUploadingMetadata || isCreatingNftImage}
                    >
                      List
                    </button>
                  </div>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </BaseLayout>
  );
};

export default NftCreate;
