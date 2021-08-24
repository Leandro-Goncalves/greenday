import '../styles/global.css'
import React from "react";
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '../context/Authcontext';
function MyApp({ Component, pageProps, router }) {
  return (
    <AuthProvider>
      <ToastContainer/>
      <Component {...pageProps}  key={router.route}/>
    </AuthProvider>
  )
}

export default MyApp;