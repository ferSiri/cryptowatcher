import '../styles/tailwind.css'
import { SessionProvider } from 'next-auth/react';
import { UserContext } from '../context/userContext';

function MyApp({ Component, pageProps }) {
  
  return (
    <SessionProvider session={pageProps.session}>
      <UserContext>
        <Component {...pageProps} />
      </UserContext>
    </SessionProvider>
  )
}

export default MyApp
