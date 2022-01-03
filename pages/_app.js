// import { Auth0Provider } from '@auth0/auth0-react'
import { useRouter } from 'next/router';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const redirectUri = typeof window !== 'undefined'
    ? `${window.location.origin}/callback`
    : undefined

  const onRedirectCallback = (appState) => {
    router.replace(appState?.returnTo || '/');
  };

  return (
    // <Auth0Provider
    //   domain="dev-9wuscf07.us.auth0.com"
    //   clientId="C4J1f0XteYvU0hH9nMY3rnpQ9LZNWB96"
    //   redirectUri={redirectUri}
    //   onRedirectCallback={onRedirectCallback}
    // >
      <Component {...pageProps} />
    // </Auth0Provider>
  )
}

export default MyApp
