import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import '@/styles/globals.css'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/logos/nj-logo-black.svg" type="image/svg+xml" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, shrink-to-fit=no" />
  <meta name="format-detection" content="telephone=no" />
      </Head>
      <SessionProvider session={session}>
        <FluentProvider theme={webLightTheme}>
          <Component {...pageProps} />
        </FluentProvider>
      </SessionProvider>
    </>
  )
}
