import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { FC, ReactNode } from 'react'
import { GlobalStore } from '../store'

require( '@solana/wallet-adapter-react-ui/styles.css' )
require( './notification.css' )


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
        <GlobalStore>
          <Head>
            <link rel="shortcut icon" href="/favicon.ico" />
          </Head>
          <ChakraProvider>
            <Component { ...pageProps } />
          </ChakraProvider>
        </GlobalStore>
      </WalletModalProvider>
    </WalletConnectionProvider>
  )
}

export default App
