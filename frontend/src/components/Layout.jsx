import { NavLink, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>HR</span>
          <span className={styles.brandText}>HRMS Lite</span>
        </div>
        <nav className={styles.nav}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? styles.navLinkActive : styles.navLink)}
            end
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/employees"
            className={({ isActive }) => (isActive ? styles.navLinkActive : styles.navLink)}
            end
          >
            Employees
          </NavLink>
          <NavLink
            to="/attendance"
            className={({ isActive }) => (isActive ? styles.navLinkActive : styles.navLink)}
          >
            Attendance
          </NavLink>
        </nav>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
