import "@/styles/globals.css";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import type { AppProps } from "next/app";
import Head from "next/head";

const themeOverride: MantineThemeOverride = {
  components: {
    // Button: {},
  },
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={themeOverride} withGlobalStyles withNormalizeCSS>
      <Head>
        <title>The edifying assembly</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </MantineProvider>
  );
}
