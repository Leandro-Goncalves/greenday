import '../styles/global.css'
import React from "react";
import { AnimatePresence } from "framer-motion";
function MyApp({ Component, pageProps, router }) {
  return (
    <AnimatePresence exitBeforeEnter>
      <Component {...pageProps}  key={router.route}/>
    </AnimatePresence>
  )
}

export default MyApp;