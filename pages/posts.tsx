import Link from 'next/link'

import PostCard from '../components/PostCard'

import styles from './Posts.module.scss'
import { getSortedPostsData } from '../lib/posts'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}

export default function Posts({ allPostsData }) {
  return (
    <div className={styles.postsContainer}>
      <Link href="/"><a className="textLink">Back</a></Link>
      <h2>My Thoughts</h2>
      {(allPostsData.map(post => (
        <PostCard postData={post} key={post.id} />
      )))}
    </div>
  )
}