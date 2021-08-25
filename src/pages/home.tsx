import { GetServerSideProps } from 'next';
import { LateralBar } from '../components/LateralBar';
import styles from '../styles/pages/Home.module.css';
import { signOut } from '../context/Authcontext';
import { WithSSRAuth } from '../utils/WithSSRAuth';
import { setupApiClient } from '../services/api';

type User = {
  email:string,
  rotate:number,
  zoom:number,
  imageUrl:string
}

export default function Home(props:User) {
  return(
    <div className={styles.container}>
      <LateralBar userData={props} data={[
        {
          title: "Logout",
          width: 40,
          src: "/logOutBar.svg",
          padding:30,
          callback: signOut
        }
      ]}/>
      <h1 className={styles.title}>You are logged in </h1>
      <img src="/tree.svg" alt="tree"/>
    </div>
  );
}

export const getServerSideProps:GetServerSideProps = WithSSRAuth<User>(async (ctx) => {

  const apiClient = setupApiClient(ctx)
  const response = await apiClient.post("/verify")
  const {email, rotate, zoom, imageUrl} = response.data.user;

  return {
    props:{
      email,
      rotate,
      zoom,
      imageUrl
    }
  }
});