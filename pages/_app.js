
import '../app/globals.css';

// Page間共有のContextProvider
import { MyContextProvider } from '../context/MyContext';

function MyApp({ Component, pageProps }) {
  return (
    <MyContextProvider> 
      <Component {...pageProps} />
    </MyContextProvider>
  );
}

export default MyApp;