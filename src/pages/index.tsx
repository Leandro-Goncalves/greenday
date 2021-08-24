import styles from '../styles/pages/Index.module.css';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

import 'react-toastify/dist/ReactToastify.css';
import { Login } from '../components/Login';
import { GetServerSideProps } from 'next';
import { WithSSRGuest } from '../utils/WithSSRGuest';

export default function Home() {
  const router = useRouter();
  const [ChangeScreen, useChangeScreen] = useState(false);

  useEffect(()=>{
    if(ChangeScreen){
      router.push("/signUp")
    }
  },[ChangeScreen])

  return (
    <div className={styles.container}>  
      <motion.div
        transition={{duration: 1}}
        className={styles.wave}
      />
      <Login isChangeScreen={useChangeScreen}/>
    </div>
  )
}

export const getServerSideProps:GetServerSideProps = WithSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})