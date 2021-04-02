import Head from 'next/head'
import Typist from 'react-typist'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'
import styles from './Home.module.scss'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>iGalaxy | William</title>
      </Head>
      <h1><Typist>Hello, I'm <span className={styles.purpleText}>William</span></Typist></h1>
      <h2>
        <a href="https://link.igalaxy.dev/github" target="_blank" className={styles.icon}><FontAwesomeIcon icon={faGithub} /></a>
        <a href="https://link.igalaxy.dev/twitter" target="_blank" className={styles.icon}><FontAwesomeIcon icon={faTwitter} /></a>
        <a href="https://link.igalaxy.dev/youtube" target="_blank" className={styles.icon}><FontAwesomeIcon icon={faYoutube} /></a>
      </h2>
    </div>
  )
}