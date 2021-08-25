import styles from '../styles/pages/Index.module.css';
import { motion } from "framer-motion";

import { Login } from '../components/Login';
import { GetServerSideProps } from 'next';
import { WithSSRGuest } from '../utils/WithSSRGuest';

export default function Home() {
  return (
    <div className={styles.container}>  
      <motion.div
        transition={{duration: 1}}
        className={styles.wave}
      />
      <Login/>
    </div>
  )
}

export const getServerSideProps:GetServerSideProps = WithSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})