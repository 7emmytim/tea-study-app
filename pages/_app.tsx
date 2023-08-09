import "@/styles/globals.css";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import type { AppProps } from "next/app";

const themeOverride: MantineThemeOverride = {
  components: {
    // Button: {},
  },
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={themeOverride} withGlobalStyles withNormalizeCSS>
      <Component {...pageProps} />
    </MantineProvider>
  );
}
