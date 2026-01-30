import { useState, useEffect } from 'react'
import { employeesApi, attendanceApi } from '../api'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import AttendanceForm from '../components/AttendanceForm'
import AttendanceList from '../components/AttendanceList'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import styles from './AttendancePage.module.css'

export default function AttendancePage() {
  const [employees, setEmployees] = useState([])
  const [attendance, setAttendance] = useState([])
  const [filterEmployeeId, setFilterEmployeeId] = useState('')
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [loadingAttendance, setLoadingAttendance] = useState(true)
  const [errorEmployees, setErrorEmployees] = useState(null)
  const [errorAttendance, setErrorAttendance] = useState(null)
  const [marking, setMarking] = useState(false)

  const fetchEmployees = () => {
    setErrorEmployees(null)
    setLoadingEmployees(true)
    employeesApi
      .list()
      .then((data) => setEmployees(Array.isArray(data) ? data : []))
      .catch((err) => setErrorEmployees(err.message))
      .finally(() => setLoadingEmployees(false))
  }

  const fetchAttendance = () => {
    setErrorAttendance(null)
    setLoadingAttendance(true)
    attendanceApi
      .list(filterEmployeeId || undefined)
      .then((data) => setAttendance(Array.isArray(data) ? data : []))
      .catch((err) => setErrorAttendance(err.message))
      .finally(() => setLoadingAttendance(false))
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    fetchAttendance()
  }, [filterEmployeeId])

  const handleMarkAttendance = (data) => {
    setMarking(true)
    return attendanceApi
      .mark(data)
      .then(() => fetchAttendance())
      .finally(() => setMarking(false))
  }

  const displayAttendance = Array.isArray(attendance) ? attendance : []
  const hasRecords = displayAttendance.length > 0

  return (
    <>
      <PageHeader
        title="Attendance Management"
        description="Mark and view daily attendance records."
      />
      <div className={styles.grid}>
        <Card title="Mark Attendance">
          {loadingEmployees && <Loading message="Loading employees..." />}
          {errorEmployees && (
            <ErrorMessage message={errorEmployees} onRetry={fetchEmployees} />
          )}
          {!loadingEmployees && !errorEmployees && (
            <AttendanceForm
              employees={employees}
              onSubmit={handleMarkAttendance}
              loading={marking}
            />
          )}
          {!loadingEmployees && !errorEmployees && (!employees || employees.length === 0) && (
            <p className={styles.hint}>
              Add employees from the Employees page first.
            </p>
          )}
        </Card>

        <Card title="Attendance Records">
          <div className={styles.filters}>
            <div className={styles.filter}>
              <label htmlFor="filterEmp">Filter by employee</label>
              <select
                id="filterEmp"
                value={filterEmployeeId}
                onChange={(e) => setFilterEmployeeId(e.target.value)}
              >
                <option value="">All employees</option>
                {(Array.isArray(employees) ? employees : []).map((emp) => (
                  <option key={emp.id} value={emp.employee_id}>
                    {emp.employee_id} – {emp.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loadingAttendance && <Loading message="Loading attendance..." />}
          {errorAttendance && (
            <ErrorMessage message={errorAttendance} onRetry={fetchAttendance} />
          )}
          {!loadingAttendance && !errorAttendance && !hasRecords && (
            <EmptyState
              icon="📋"
              title="No attendance records"
              description={
                filterEmployeeId
                  ? 'No records for this employee yet.'
                  : 'Mark attendance using the form on the left.'
              }
            />
          )}
          {!loadingAttendance && !errorAttendance && hasRecords && (
            <AttendanceList records={displayAttendance} />
          )}
        </Card>
      </div>
    </>
  )
}
