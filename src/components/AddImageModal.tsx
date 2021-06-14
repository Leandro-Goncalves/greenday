import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

import styles from '../styles/components/AddImageModal.module.css';
import { SliderBar } from './SliderBar';
import { useState } from 'react';
import axios from 'axios';

import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export function AddImageModal(props : {open: boolean, setOpen: any, email:string, password:string}) {

  const router = useRouter();

  const [zoom, setZoom] = useState([50]);
  const [rotate, setRotate] = useState([0]);

  const [image, setImage] = useState(null);

  async function addUser() {
    const signUp = await axios.post('/api/signUp', {
      email:props.email,
      password: props.password,
      image,
      zoom: zoom[0],
      rotate: rotate[0]
    });
    const signUpdData = signUp.data;
    if(!signUpdData.error){
      Cookies.set("token",signUpdData.token);
      router.push("/home")
    }else{
      toast.error(signUpdData.errorMessage);
    }
  }

  const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
  });

  async function convertAndSetImage(data){
    try{
      setImage(await toBase64(data[0]));
    } catch(err) {
      
    }
  }

  return(
    <Modal open={props.open} onClose={()=>props.setOpen(false)}>
      <div className={styles.container}>
        <h1>Select your image</h1>
        <section>
          <input id="input-file" className={styles.input} type="file" accept=".png, .jpg, .jpeg" onChange={files => convertAndSetImage(files.target.files)} style={{outline:"none"}}/>
          <label htmlFor='input-file' className={styles.image}>
              {image 
                ?
                <>
                  <img src={image} alt="user" width={`${zoom[0] * 10}%`} style={{transform:`rotate(${rotate[0]}deg)`}}/>
                </>
                : 
                <>
                  <img src="/icons/user.svg" alt="user" className={styles.imageIcon}/>
                  <div className={styles.imageHover}>
                    change Image
                  </div>
                </>
              }
              
            </label>

          <div className={styles.sliderContainer}>
            Zoom
            <SliderBar range={zoom} changeRange={setZoom} max={100}/>
            Rotate
            <SliderBar range={rotate} changeRange={setRotate} max={360}/>
          </div>
        </section>
        <button onClick={addUser} disabled={image ? false : true} className={styles.submitButton}>Create</button>
      </div>
    </Modal>
  )
}