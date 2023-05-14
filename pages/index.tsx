import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";

import { BaseLayout, NftList } from "components/ui";
import { useNetwork } from "hooks/web3";

const Home: NextPage = () => {
  const { network } = useNetwork();

  return (
    <BaseLayout>
      <div className="relative bg-gray-50 px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0">
          <div className="h-1/3 bg-white sm:h-2/3" />
        </div>
        <div className="relative">
          <section className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Amazing Creatures NFTs
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
              Mint a NFT to get unlimited ownership forever!
            </p>
          </section>
          {network.isConnectedToNetwork ? (
            <NftList />
          ) : (
            <section className="mt-10 rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon
                    className="h-5 w-5 text-yellow-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Attention needed
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      {network.isLoading
                        ? "Loading..."
                        : `Connect to ${network.targetNetwork}`}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </BaseLayout>
  );
};

export default Home;
