import React from "react";

import Navbar from "../navbar";

type Props = {
  children: React.ReactNode;
};

const BaseLayout = ({ children }: Props) => (
  <>
    <Navbar />
    <main className="min-h-screen overflow-hidden bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  </>
);

export default BaseLayout;
