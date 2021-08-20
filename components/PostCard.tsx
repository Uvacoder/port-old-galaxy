import styles from '../styles/PostCard.module.scss'

export default function PostCard({ postData }) {
  const { id, date, title } = postData;
  return (
    <div className={styles.postCard}>
      {title}
      <br />
      {id}
      <br />
      {date}
    </div>
  )
}