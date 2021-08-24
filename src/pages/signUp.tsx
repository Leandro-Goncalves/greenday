import styles from '../styles/pages/singUp.module.css';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

import 'react-toastify/dist/ReactToastify.css';
import { SignUp } from '../components/signUp';

function Home() {

  const router = useRouter()
  const [ChangeScreen, useChangeScreen] = useState(false);

  useEffect(()=>{
    if(ChangeScreen){
      router.push("/")
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
      <SignUp isChangeScreen={useChangeScreen}/>
    </div>
  )
}

export default Home;
