import styles from './Loading.module.css'

export default function Loading({ message = 'Loading...' }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} aria-hidden />
      <p className={styles.message}>{message}</p>
    </div>
  )
}
