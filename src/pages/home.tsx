import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { LateralBar } from '../components/LateralBar';
import styles from '../styles/pages/Home.module.css';

export default function Home() {

  const router = useRouter();

  const [data, setData] = useState({});

  function logOut() {
    Cookies.remove("token");
    router.push("/")
  }

  useEffect(()=>{
    async function verify(){
      const token = Cookies.get('token');
      if(token){
        
        const verify = await axios.post('/api/verify', {token});
        
        if(verify.data.error){
          router.push("/")
        }else{
          setData(
            {
              image:verify.data.user.image,
              rotate:verify.data.user.rotate,
              zoom:verify.data.user.zoom
            })
        }
      }else{
        router.push("/")
      }
    }
    verify()
  },[])

  return(
    <div className={styles.container}>
      <LateralBar userData={data} data={[
        {
          title: "Logout",
          width: 40,
          src: "/logOutBar.svg",
          padding:30,
          callback: logOut
        }
      ]}/>
      <h1 className={styles.title}>You are logged in </h1>
      <img src="/tree.svg" alt="tree"/>
    </div>
  );
}