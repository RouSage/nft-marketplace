import { Menu } from "@headlessui/react";
import classNames from "classnames";
import Link from "next/link";

import { shortenWalletAddress } from "helpers/wallet";
import { Routes } from "routes";

type Props = {
  account: string | undefined;
  isLoading: boolean;
  isInstalled: boolean;
  connect: () => void;
};

const WalletBar = ({ isInstalled, isLoading, connect, account }: Props) => {
  if (isLoading) {
    return (
      <div>
        <button
          onClick={() => {}}
          type="button"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Loading...
        </button>
      </div>
    );
  }

  if (account) {
    return (
      <Menu as="div" className="ml-3 relative">
        <div>
          <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
            <span className="sr-only">Open user menu</span>
            <img
              className="h-8 w-8 rounded-full"
              src="/images/default_user_image.png"
              alt=""
            />
          </Menu.Button>
        </div>

        <Menu.Items className="z-10 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {() => (
              <button
                disabled={true}
                className="disabled:text-gray-500 text-xs block px-4 pt-2 text-gray-700"
              >
                {shortenWalletAddress(account)}
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                href={Routes.Profile}
                className={classNames("block px-4 py-2 text-sm text-gray-700", {
                  ["bg-gray-100"]: active,
                })}
              >
                Profile
              </Link>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    );
  }

  if (isInstalled) {
    return (
      <div>
        <button
          onClick={() => {
            connect();
          }}
          type="button"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Connect Wallet
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <button
          onClick={() => {
            window.open("https://metamask.io", "_blank");
          }}
          type="button"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          No Wallet
        </button>
      </div>
    );
  }
};

export default WalletBar;
