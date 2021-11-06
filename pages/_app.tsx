import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { FC, ReactNode } from 'react'

require( '@solana/wallet-adapter-react-ui/styles.css' )


const WalletConnectionProvider = dynamic<{ children: ReactNode }>(
  () =>
    import( '../components/WalletConnectionProvider' ).then(
      ({ WalletConnectionProvider }) => WalletConnectionProvider,
    ),
  {
    ssr: false,
  },
)

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <WalletConnectionProvider>
      <WalletModalProvider>
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <ChakraProvider>
          <Component { ...pageProps } />
        </ChakraProvider>
      </WalletModalProvider>
    </WalletConnectionProvider>
  )
}

export default App
