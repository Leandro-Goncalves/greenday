import styles from '../styles/components/signUp.module.css';
import { toast } from 'react-toastify';
import { useState } from 'react';
import Loader from 'react-loader-spinner';
import { AddImageModal } from './AddImageModal';
import { motion } from 'framer-motion';
import * as yup from 'yup';
import { api } from "../services/apiClient";
import Router from 'next/router';

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

let schema = yup.object().shape({
  email: yup.string().email("Email is invalid!").required("Empty fields !"),
  password: yup.string().required("Empty fields !"),
  repeatePassword: yup.string().required("Empty fields !")
  .oneOf([yup.ref('password'), null], 'Passwords do not match !')

});

export function SignUp() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatePassword, setRepeatePassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  
  function ChangeScreen() {
    Router.push("/")
  }

  async function handleSubmit(e) {
    e.preventDefault();
    schema.validate({
      email,
      password,
      repeatePassword
    }).then(async ({email}) => {
      setLoading(true);
      const checkEmail = await api.post('/CheckEmail', {email});
      const { error, errorMessage } = checkEmail.data;
      if(error){
        toast.error(errorMessage);
        return
      }
      setOpen(true);
      setLoading(false);
    })
    .catch((err) => {
      err.errors.forEach((name: string) => toast.warning(name));
    })
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

      <motion.h2 variants={fadeUp} className={styles.subTitle}>SignUp</motion.h2>

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

      <motion.button
        variants={fadeUp}
        whileTap={{scale: 0.9}}
        onClick={handleSubmit}
        className={styles.submitButton}
        whileHover={{scale:0.95}}
      >
        Create
        <Loader
          visible={loading}
          type="TailSpin"
          color="#FFFFFF"
          height={30}
          width={50}
        />
      </motion.button>
      <motion.div variants={fadeUp} onClick={ChangeScreen} className={styles.link}>Login</motion.div>
    </motion.form>
  )
}