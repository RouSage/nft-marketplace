import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Link from "next/link";
import { Fragment } from "react";

import { useAccount } from "components/hooks/web3";
import ActiveLink from "components/ui/link";
import { Routes } from "routes";

import WalletBar from "./WalletBar";

const NAVIGATION = [
  { name: "Marketplace", href: Routes.Marketplace },
  { name: "Create", href: Routes.NftCreate },
];

const Navbar = () => {
  const { account } = useAccount();

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="hidden lg:block h-10 w-auto"
                    src="/images/page_logo.png"
                    alt="Workflow"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {NAVIGATION.map(({ href, name }) => (
                      <ActiveLink
                        key={name}
                        href={href}
                        className="text-gray-400 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        activeClassName="bg-gray-900 text-indigo-400"
                      >
                        {name}
                      </ActiveLink>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <WalletBar
                  account={account.data}
                  connect={account.connect}
                  isInstalled={account.isInstalled}
                  isLoading={account.isLoading}
                />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {NAVIGATION.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  href={item.href}
                  as={ActiveLink}
                  activeClassName="bg-gray-900 text-indigo-400"
                  className={
                    "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  }
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
