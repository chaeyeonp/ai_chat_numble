import {Global, css} from '@emotion/react';
import {AppProps} from "next/app";

const globalStyles = css`
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #000000;
    margin: 0;
  }
`;

function MyApp({Component, pageProps}:AppProps) {
    return (
        <>
            <Global styles={globalStyles}/>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
