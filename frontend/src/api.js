// In production: use env var if set, otherwise fallback to deployed Railway backend URL
const FALLBACK_API_BASE = 'https://hrms-lite-full-stack-app-production.up.railway.app'
const raw = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? FALLBACK_API_BASE : '')
const API_BASE = (raw || '').replace(/\/$/, '')

function getMessage(res, data) {
  if (Array.isArray(data?.detail)) {
    return data.detail.map((e) => e.msg || e.message).join(', ');
  }

  if (typeof data?.detail === 'string') {
    return data.detail;
  }

  if (res.status === 502 || res.status === 503) {
    return 'Server unavailable. Is the backend running?';
  }

  if (res.status >= 500) {
    return data.detail || 'Server error. Please try again.';
  }

  return data.detail || 'Request failed';
}

async function request(path, options = {}) {
  const url = API_BASE ? `${API_BASE}${path}` : path

  let res
  try {
    res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })
  } catch (err) {
    const msg = (err && err.message) || ''
    const isNetworkError = /failed to fetch|networkerror|load failed/i.test(msg)
    if (isNetworkError) {
      throw new Error(
        'Cannot reach the backend. In Railway → Variables, set CORS_ORIGINS to your Netlify URL (e.g. https://silly-cranachan-7ca8e7.netlify.app), then redeploy. Also check the backend is running.'
      )
    }
    throw new Error(msg || 'Cannot reach server. Check VITE_API_BASE_URL and CORS.')
  }

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await res.json().catch(() => ({})) : {}

  if (!res.ok) {
    throw new Error(getMessage(res, data))
  }

  // If we got HTML (e.g. SPA fallback from wrong origin), treat as error
  if (!isJson && res.ok) {
    const hint = !API_BASE
      ? 'VITE_API_BASE_URL is not set. Set it in Netlify → Site configuration → Environment variables to your Railway backend URL (e.g. https://your-app.railway.app), then trigger a new deploy.'
      : 'The request may be going to the wrong URL. In Netlify, set VITE_API_BASE_URL to your Railway backend URL only (no trailing slash), then trigger a new deploy so the build picks it up.'
    throw new Error(`Server returned non-JSON. ${hint}`)
  }

  return data
}

export const employeesApi = {
  list: () => request('/api/employees'),

  add: (body) =>
    request('/api/employees', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  delete: (employeeId) =>
    request(`/api/employees/${encodeURIComponent(employeeId)}`, {
      method: 'DELETE',
    }),
};

export const attendanceApi = {
  list: (employeeId) =>
    request(employeeId ? `/api/attendance?employee_id=${encodeURIComponent(employeeId)}` : '/api/attendance'),

  mark: (body) =>
    request('/api/attendance', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
