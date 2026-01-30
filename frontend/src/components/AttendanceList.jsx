import styles from './Table.module.css'

export default function AttendanceList({ records }) {
  if (!records.length) return null

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.employee_id}</td>
              <td>{r.date}</td>
              <td>
                <span
                  className={
                    r.status === 'Present'
                      ? styles.statusPresent
                      : styles.statusAbsent
                  }
                >
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
