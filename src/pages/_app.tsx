import '../styles/global.css'
import React from "react";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '../context/Authcontext';
function MyApp({ Component, pageProps, router }) {
  return (
    <AuthProvider>
      <AnimatePresence exitBeforeEnter>
        <ToastContainer/>
        <Component {...pageProps}  key={router.route}/>
      </AnimatePresence>
    </AuthProvider>
  )
}

export default MyApp;