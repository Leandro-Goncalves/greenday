import styles from '../styles/components/Login.module.css';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from 'next/router'
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { motion } from "framer-motion";
import { useAuth } from '../hook/useAuth';

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

export function Login() {

  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function ChangeScreen() {
    Router.push("/signUp")
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if(email.trim() && password.trim()){
      setLoading(true);
      await signIn({email, password})
    }else{
      toast.warning('Empty fields !');
    }
    setLoading(false);
  }

  return(
    <motion.form variants={stagger} className={styles.container} initial="initial" animate="animate">
      
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
      <motion.div variants={fadeUp} onClick={ChangeScreen} className={styles.link}>create new account</motion.div>
    </motion.form>
  )
}