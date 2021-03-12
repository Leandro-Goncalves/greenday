import styles from '../styles/pages/Index.module.css';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Login } from '../components/Login';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Home() {
  const router = useRouter();

  useEffect(()=>{
    async function verify(){
      const token = Cookies.get('token');
      if(token){
        
        const verify = await axios.post('/api/verify', {token});
        if(!verify.data.error){
          router.push("/home")
        }
      }
    }
    verify()
  },[])

  const [ChangeScreen, useChangeScreen] = useState(false);

  useEffect(()=>{
    if(ChangeScreen){
      router.push("/signUp")
    }
  },[ChangeScreen])

  return (
    <div className={styles.container}>
      <motion.div
        exit={{ left: 0 }}
        transition={{duration: 1}}
        className={styles.wave}
        animate={{left: "-90%"}}
      />
      <Login isChangeScreen={useChangeScreen}/>
      <ToastContainer/>
    </div>
  )
}

//animate={ChangeScreen ? { left: isCellphone ? "-90%" : 0 } : { left: "-90%"}}