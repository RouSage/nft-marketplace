import React from "react";

import Navbar from "../navbar";

type Props = {
  children: React.ReactNode;
};

const BaseLayout = ({ children }: Props) => (
  <>
    <Navbar />
    <main className="py-16 bg-gray-50 overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  </>
);

export default BaseLayout;
