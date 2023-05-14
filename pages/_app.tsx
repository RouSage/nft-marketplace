import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

import { Web3Provider } from "components/providers";

import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer />
      <Web3Provider>
        <Component {...pageProps} />
      </Web3Provider>
    </>
  );
}
