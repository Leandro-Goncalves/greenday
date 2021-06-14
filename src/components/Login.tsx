import styles from '../styles/components/Login.module.css';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router'
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { motion } from "framer-motion";

const fadeUp = {
  initial: {
    y: 60
  },
  animate: {
    y: 0,
    transition: {
      duratuon: 0.6
    }
  }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: .12
    }
  }
}

export function Login(props : {isChangeScreen : (state:boolean)=> void}) {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if(email.trim() && password.trim()){
      setLoading(true);
      const signUp = await axios.post('/api/signIn', {email, password});
      const signUpdData = signUp.data;
      if(!signUpdData.error){
        Cookies.set("token",signUpdData.token);
        router.push("/home");
      }else{
        toast.error(signUpdData.errorMessage);
      }
    }else{
      toast.warning('Empty fields !');
    }
    setLoading(false);
  }

  return(
    <motion.form variants={stagger} exit={{opacity: 0}} className={styles.container} initial="initial" animate="animate">
      
      <motion.img
        className={styles.logo}
        src="/logo.svg"
        alt="logo"

        initial={{y: -60, opacity: 0}}
        transition={{duration: 1}}
        animate={{y: 0, opacity: 1}}
      />

      <motion.h2 variants={fadeUp} className={styles.subTitle}>Login</motion.h2>

      <motion.div variants={fadeUp} className={styles.input}>
        <div><img src="/icons/user.svg" alt="user"/></div>
        <input
          className={styles.inputItem}
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
      </motion.div>
      <motion.div variants={fadeUp} className={styles.input}>
        <div><img src="/icons/lock.svg" alt="lock"/></div>
        <input
          className={styles.inputItem}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
      </motion.div>

      <motion.button
        variants={fadeUp}
        whileTap={{scale: 0.9}}
        onClick={handleSubmit}
        className={styles.submitButton}
        whileHover={{scale:0.95}}
      >
        Login 
        <Loader
          visible={loading}
          type="TailSpin"
          color="#FFFFFF"
          height={30}
          width={50}
        />
      </motion.button>
      <motion.div variants={fadeUp} onClick={()=>{props.isChangeScreen(true)}} className={styles.link}>create new account</motion.div>
    </motion.form>
  )
}