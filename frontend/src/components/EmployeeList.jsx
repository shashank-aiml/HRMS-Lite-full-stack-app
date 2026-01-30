import Button from './Button'
import styles from './Table.module.css'

export default function EmployeeList({ employees, onDelete, deletingId }) {
  const list = Array.isArray(employees) ? employees : []
  if (!list.length) return null

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Department</th>
            <th className={styles.actions}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.employee_id}</td>
              <td>{emp.full_name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td className={styles.actions}>
                <Button
                  variant="danger"
                  disabled={deletingId === emp.employee_id}
                  onClick={() => onDelete(emp.employee_id)}
                >
                  {deletingId === emp.employee_id ? 'Deleting...' : 'Delete'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
