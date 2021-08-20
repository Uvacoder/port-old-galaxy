import Head from 'next/head'
import Link from 'next/link'
import Typist from 'react-typist'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faTwitter, faYoutube, faTwitch } from '@fortawesome/free-brands-svg-icons'
import { faBell } from '@fortawesome/free-solid-svg-icons'

import PostCard from '../components/PostCard'

import { getSortedPostsData } from '../lib/posts'
import Lanyard from '../components/Lanyard'
import styles from '../styles/Home.module.scss'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}

export default function Home({ allPostsData }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>iGalaxy | William</title>
      </Head>
      <div style={{width: '300px'}}>
        <h1><Typist>Hello, I'm <span className={styles.purpleText}>William</span></Typist></h1>
      </div>
      <Lanyard />
      <div>
        <h2>
          <a href="https://link.igalaxy.dev/github" target="_blank" className={styles.icon}><FontAwesomeIcon icon={faGithub} /></a>
          <a href="https://link.igalaxy.dev/twitter" target="_blank" className={styles.icon}><FontAwesomeIcon icon={faTwitter} /></a>
          <a href="https://link.igalaxy.dev/youtube" target="_blank" className={styles.icon}><FontAwesomeIcon icon={faYoutube} /></a>
          <a href="https://link.igalaxy.dev/twitch" target="_blank" className={styles.icon}><FontAwesomeIcon icon={faTwitch} /></a>
          {/* <a href="https://sub.to/igalaxy" target="_blank" className={styles.icon}><FontAwesomeIcon icon={faBell} /></a> */}
        </h2>
      </div>
      {/* <br />
      <div>
        <h2>My Thoughts</h2>
        {(allPostsData.map((post, i) => {
          if (i < 1) return (
            <PostCard postData={post} key={post.id} />
          )
          else return
        }))}
        <Link href="/posts"><a className="textLink">View All</a></Link>
      </div> */}
    </div>
  )
}