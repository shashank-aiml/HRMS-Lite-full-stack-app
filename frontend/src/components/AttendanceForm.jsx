import { useState } from 'react'
import Button from './Button'
import styles from './Form.module.css'

const today = () => new Date().toISOString().slice(0, 10)

export default function AttendanceForm({ employees = [], onSubmit, loading }) {
  const list = Array.isArray(employees) ? employees : []
  const [employeeId, setEmployeeId] = useState('')
  const [date, setDate] = useState(today())
  const [status, setStatus] = useState('Present')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!employeeId) {
      setError('Please select an employee.')
      return
    }
    onSubmit({
      employee_id: employeeId,
      date,
      status: status === 'Present' ? 'Present' : 'Absent',
    })
      .then(() => {
        setEmployeeId('')
        setDate(today())
        setStatus('Present')
      })
      .catch((err) => setError(err.message))
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="attEmployeeId">Employee *</label>
          <select
            id="attEmployeeId"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            disabled={loading}
          >
            <option value="">Select employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.employee_id}>
                {emp.employee_id} – {emp.full_name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="attDate">Date *</label>
          <input
            id="attDate"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="attStatus">Status *</label>
          <select
            id="attStatus"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={loading}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <Button type="submit" disabled={loading || list.length === 0}>
        {loading ? 'Saving...' : 'Mark Attendance'}
      </Button>
    </form>
  )
}
