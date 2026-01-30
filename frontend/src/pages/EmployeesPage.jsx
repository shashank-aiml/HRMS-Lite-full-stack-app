import { useState, useEffect } from 'react'
import { employeesApi } from '../api'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import EmployeeForm from '../components/EmployeeForm'
import EmployeeList from '../components/EmployeeList'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchEmployees = () => {
    setError(null)
    setLoading(true)
    employeesApi
      .list()
      .then((data) => setEmployees(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleAdd = (data) => {
    setAdding(true)
    return employeesApi.add(data).then(() => fetchEmployees()).finally(() => setAdding(false))
  }

  const handleDelete = (employeeId) => {
    if (!window.confirm(`Delete employee ${employeeId}? This will also remove their attendance records.`)) return
    setDeletingId(employeeId)
    employeesApi
      .delete(employeeId)
      .then(() => fetchEmployees())
      .catch((err) => alert(err.message))
      .finally(() => setDeletingId(null))
  }

  return (
    <>
      <PageHeader
        title="Employee Management"
        description="Add and manage employee records."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Card title="Add Employee">
          <EmployeeForm onSubmit={handleAdd} loading={adding} />
        </Card>

        <Card title="All Employees">
          {loading && <Loading message="Loading employees..." />}
          {error && <ErrorMessage message={error} onRetry={fetchEmployees} />}
          {!loading && !error && (!employees || employees.length === 0) && (
            <EmptyState
              icon="👥"
              title="No employees yet"
              description="Add your first employee using the form above."
            />
          )}
          {!loading && !error && employees?.length > 0 && (
            <EmployeeList
              employees={employees}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          )}
        </Card>
      </div>
    </>
  )
}
