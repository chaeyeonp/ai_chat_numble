import { Global, css } from "@emotion/react";
import { AppProps } from "next/app";

const globalStyles = css`
  body {
    background-color: #000000;
  }
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Global styles={globalStyles} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
