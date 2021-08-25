import styles from '../styles/pages/singUp.module.css';
import { motion } from "framer-motion";
import { SignUp } from '../components/signUp';

function Home() {
  return (
    <div className={styles.container}>
      <motion.div
        transition={{duration: 1}}
        className={styles.wave}
      />
      <SignUp/>
    </div>
  )
}

export default Home;
