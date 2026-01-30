import { useState } from 'react'
import Button from './Button'
import styles from './Form.module.css'

export default function EmployeeForm({ onSubmit, loading }) {
  const [employeeId, setEmployeeId] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!employeeId.trim() || !fullName.trim() || !email.trim() || !department.trim()) {
      setError('All fields are required.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    onSubmit({
      employee_id: employeeId.trim(),
      full_name: fullName.trim(),
      email: email.trim(),
      department: department.trim(),
    })
      .then(() => {
        setEmployeeId('')
        setFullName('')
        setEmail('')
        setDepartment('')
      })
      .catch((err) => setError(err.message))
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="employeeId">Employee ID *</label>
          <input
            id="employeeId"
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="e.g. EMP001"
            disabled={loading}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="fullName">Full Name *</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            disabled={loading}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@company.com"
            disabled={loading}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="department">Department *</label>
          <input
            id="department"
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="e.g. Engineering"
            disabled={loading}
          />
        </div>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Employee'}
      </Button>
    </form>
  )
}
