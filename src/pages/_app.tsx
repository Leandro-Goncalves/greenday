import '../styles/global.css'
import 'react-toastify/dist/ReactToastify.css';
import React from "react";
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '../context/Authcontext';
import NextNProgress from 'nextjs-progressbar'
function MyApp({ Component, pageProps, router }) {
  return (
    <AuthProvider>
      <ToastContainer/>
      <NextNProgress
        color="#67b39e"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
      />
      <Component {...pageProps}  key={router.route}/>
    </AuthProvider>
  )
}

export default MyApp;