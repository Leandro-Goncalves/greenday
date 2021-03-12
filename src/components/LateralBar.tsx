import styles from '../styles/components/LateralBar.module.css';

export function LateralBar(props : {data : any, userData: {
  image: string,
  rotate: number,
  zoom: number
}}) {
  return(
    <div className={styles.container}>
      <div className={styles.userContainer}>
        <div className={styles.user}>
          <img className={props.userData.image === undefined && styles.userIcon} src={props.userData.image || "/userBar.svg"} alt="user"
          width={`${props.userData.zoom * 10}%`}
          style={{transform:`rotate(${props.userData.rotate}deg)`}}/>
        </div>
      </div>
      <ul>
        {props.data.map((iten : {
          title: string,
          width: number,
          src: string,
          padding: string,
          callback: ()=> void
        }, k: any) => (
          <li key={k} style={{paddingLeft: iten.padding}} onClick={iten.callback}>
            <img src={iten.src} alt={iten.title} width={iten.width}/>
            <div>
              {iten.title}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}