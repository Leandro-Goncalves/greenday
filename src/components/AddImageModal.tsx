import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

import styles from '../styles/components/AddImageModal.module.css';
import { SliderBar } from './SliderBar';
import { useState } from 'react';
import axios from 'axios';

import { toast } from 'react-toastify';
import { useAuth } from '../hook/useAuth';
import Loader from 'react-loader-spinner';

type AddImageModalProps =  {
  open: boolean,
  setOpen: any,
  email:string,
  password:string
}

export function AddImageModal({
  email,
  open,
  password,
  setOpen
}:AddImageModalProps) {

  const {
    signUp
  } = useAuth();

  const [zoom, setZoom] = useState([50]);
  const [rotate, setRotate] = useState([0]);
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  

  async function addUserTest() {
    try{
      setLoading(true);
      const formData = new FormData();
      formData.append("image", image.split(',')[1]);
      formData.append('name', email);
      formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY);

      const response = await axios.post(
        'https://api.imgbb.com/1/upload',
        formData
      );
      const {data: imagaData} = response.data
      if(imagaData.url){
        await signUp({
          email,
          imageUrl: imagaData.url,
          password: password,
          rotate: rotate[0],
          zoom: zoom[0]
        })
      }

    } catch (err) {
      toast.error(err.message)
    }
    setLoading(false);
    
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
    <Modal open={open} onClose={()=>setOpen(false)}>
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
        <button
          onClick={addUserTest}
          disabled={image ? false : true}
          className={styles.submitButton}
        >
          Create
          <Loader
            visible={loading}
            type="TailSpin"
            color="#FFFFFF"
            height={30}
            width={50}
          />
        </button>
      </div>
    </Modal>
  )
}