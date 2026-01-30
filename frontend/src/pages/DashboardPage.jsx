import { useState, useEffect } from 'react'
import { dashboardApi } from '../api'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboard = () => {
    setError(null)
    setLoading(true)
    dashboardApi
      .get()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (loading) return <Loading message="Loading dashboard..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboard} />
  if (!data) return null

  const { total_employees, total_attendance_records, today_present_count, present_days_per_employee } = data

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of employees and attendance."
      />
      <div className={styles.cards}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{total_employees}</span>
          <span className={styles.statLabel}>Total Employees</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{total_attendance_records}</span>
          <span className={styles.statLabel}>Total Attendance Records</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{today_present_count}</span>
          <span className={styles.statLabel}>Present Today</span>
        </div>
      </div>

      <Card title="Present Days per Employee" className={styles.tableCard}>
        {!present_days_per_employee.length ? (
          <p className={styles.empty}>No employees yet. Add employees to see present days.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Full Name</th>
                  <th>Department</th>
                  <th>Present Days</th>
                </tr>
              </thead>
              <tbody>
                {present_days_per_employee.map((row) => (
                  <tr key={row.employee_id}>
                    <td>{row.employee_id}</td>
                    <td>{row.full_name}</td>
                    <td>{row.department}</td>
                    <td>{row.present_days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  )
}
