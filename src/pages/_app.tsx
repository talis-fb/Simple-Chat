import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'

import { Provider } from 'react-redux'
import store from '../store/store'

import FirebaseProvider from '../firebase/provider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <FirebaseProvider>
          <Component {...pageProps} />
        </FirebaseProvider>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
