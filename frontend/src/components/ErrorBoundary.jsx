import { Component } from 'react'
import styles from './ErrorBoundary.module.css'

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Something went wrong</h1>
          <p className={styles.message}>
            The app encountered an error. This often happens when the API URL is not set correctly in production.
          </p>
          <p className={styles.hint}>
            If you deployed on Netlify, set <strong>VITE_API_BASE_URL</strong> to your backend URL (e.g. Railway) in Site settings → Environment variables, then redeploy.
          </p>
          <button
            type="button"
            className={styles.button}
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
