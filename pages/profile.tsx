import classNames from "classnames";
import { NextPage } from "next";
import { useEffect, useState } from "react";

import { BaseLayout } from "components/ui";
import { useOwnedNfts } from "hooks/web3";
import { Nft } from "types/nft";

const TABS = [{ name: "Your Collection", href: "#", current: true }];

const Profile: NextPage = () => {
  const { nfts } = useOwnedNfts();

  const [activeNft, setActiveNft] = useState<Nft | null>(null);

  useEffect(() => {
    if (nfts.data && nfts.data.length) {
      setActiveNft(nfts.data[0]);
    }

    return () => {
      setActiveNft(null);
    };
  }, [nfts.data]);

  return (
    <BaseLayout>
      <div className="flex h-full">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 items-stretch overflow-hidden">
            <section className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                <header className="flex">
                  <h1 className="flex-1 text-2xl font-bold text-gray-900">
                    Your NFTs
                  </h1>
                </header>
                <div className="mt-3 sm:mt-2">
                  <div className="hidden sm:block">
                    <div className="flex items-center border-b border-gray-200">
                      <nav
                        className="-mb-px flex flex-1 space-x-6 xl:space-x-8"
                        aria-label="Tabs"
                      >
                        {TABS.map((tab) => (
                          <a
                            key={tab.name}
                            href={tab.href}
                            aria-current={tab.current ? "page" : undefined}
                            className={classNames(
                              "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium",
                              tab.current
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            )}
                          >
                            {tab.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>

                <section
                  className="mt-8 pb-16"
                  aria-labelledby="gallery-heading"
                >
                  <ul
                    role="list"
                    className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
                  >
                    {nfts.data?.map((nft) => {
                      const { tokenId, meta } = nft;
                      const isActive = activeNft?.tokenId === tokenId;

                      return (
                        <li
                          key={tokenId}
                          onClick={() => {
                            setActiveNft(nft);
                          }}
                          className="relative cursor-pointer"
                        >
                          <div
                            className={classNames(
                              "aspect-w-10 aspect-h-7 group block w-full overflow-hidden rounded-lg bg-gray-100",
                              isActive
                                ? "ring-2 ring-indigo-500 ring-offset-2"
                                : "focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100"
                            )}
                          >
                            <img
                              src={meta.image}
                              alt=""
                              className={classNames(
                                "pointer-events-none object-cover",
                                { "group-hover:opacity-75": isActive }
                              )}
                            />
                            <button
                              type="button"
                              className="absolute inset-0 focus:outline-none"
                            >
                              <span className="sr-only">
                                View details for {meta.name}
                              </span>
                            </button>
                          </div>
                          <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
                            {meta.name}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </div>
            </section>

            {/* Details sidebar */}
            <aside className="hidden w-96 overflow-y-auto border-l border-gray-200 bg-white p-8 lg:block">
              {activeNft && (
                <div className="space-y-6 pb-16">
                  <div>
                    <div className="aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg">
                      <img
                        src={activeNft.meta.image}
                        alt=""
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-4 flex items-start justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          <span className="sr-only">Details for </span>
                          {activeNft.meta.name}
                        </h2>
                        <p className="text-sm font-medium text-gray-500">
                          {activeNft.meta.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Information</h3>
                    <dl className="mt-2 divide-y divide-gray-200 border-t border-b border-gray-200">
                      {activeNft.meta.attributes.map(
                        ({ trait_type, value }) => (
                          <div
                            key={trait_type}
                            className="flex justify-between py-3 text-sm font-medium"
                          >
                            <dt className="text-gray-500">{trait_type}: </dt>
                            <dd className="text-right text-gray-900">
                              {value}
                            </dd>
                          </div>
                        )
                      )}
                    </dl>
                  </div>

                  <div className="flex">
                    <button
                      type="button"
                      className="flex-1 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Download Image
                    </button>
                    <button
                      type="button"
                      className="ml-3 flex-1 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-gray-400"
                      disabled={activeNft.isListed}
                      onClick={() => {
                        nfts.listNft(activeNft.tokenId, activeNft.price);
                      }}
                    >
                      List Nft
                    </button>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Profile;
