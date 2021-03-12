import styles from '../styles/components/signUp.module.css';
import { toast } from 'react-toastify';
import { useState } from 'react';
import * as EmailValidator from 'email-validator';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import { AddImageModal } from './AddImageModal';
import { motion } from 'framer-motion';

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

export function SignUp(props : {isChangeScreen : (state:boolean)=> void}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatePassword, setRepeatePassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if(email.trim() && password.trim() && password.trim()){
      if(password.trim() === repeatePassword.trim()){
        if(EmailValidator.validate(email.trim())){
          setLoading(true);
          const signUp = await axios.post('/api/verify', {email});
          const signUpdData = signUp.data;
          if(!signUpdData.error){
            setOpen(true);
          }else{
            if(signUpdData.errorMessage){
              toast.error(signUpdData.errorMessage);
            }
            else {
              toast.error("Something is wrong");
            }
          }
          setLoading(true);
        }else{
          toast.warning('Invalid email !');
        }
      }else{
        toast.warning('Passwords do not match !');
      }
    }else{
      toast.warning('Empty fields !');
    }
    setLoading(false);
  }

  return(
    <motion.form variants={stagger} exit={{opacity: 0}} className={styles.container} initial="initial" animate="animate">
      <AddImageModal open={open} setOpen={setOpen} email={email} password={password}/>
      <motion.img
        className={styles.logo}
        src="/logo.svg"
        alt="logo"

        initial={{y: -60, opacity: 0}}
        transition={{duration: 1}}
        animate={{y: 0, opacity: 1}}
      />

      <h2 className={styles.subTitle}>SignUp</h2>

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

      <motion.div variants={fadeUp} className={styles.input}>
        <div><img src="/icons/lock.svg" alt="lock"/></div>
        <input
          className={styles.inputItem}
          type="password"
          placeholder="Repeat Password"
          value={repeatePassword}
          onChange={(e)=>setRepeatePassword(e.target.value)}
        />
      </motion.div>

      <motion.button variants={fadeUp} whileTap={{scale: 0.9}} onClick={handleSubmit} className={styles.submitButton}>
        Create
        <Loader
          visible={loading}
          type="TailSpin"
          color="#FFFFFF"
          height={30}
          width={50}
        />
      </motion.button>
      <motion.div variants={fadeUp} onClick={()=>{props.isChangeScreen(true)}} className={styles.link}>Login</motion.div>
    </motion.form>
  )
}