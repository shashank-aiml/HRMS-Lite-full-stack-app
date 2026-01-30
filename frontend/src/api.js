// In production (Netlify), set VITE_API_BASE_URL to your Railway backend URL (e.g. https://your-app.railway.app)
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

// In production we must have API_BASE set, or requests go to the frontend origin (wrong)
if (import.meta.env.PROD && !API_BASE) {
  console.error(
    'VITE_API_BASE_URL is not set. Set it in Netlify Environment variables to your Railway backend URL and redeploy.'
  )
}

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

  if (import.meta.env.PROD && !API_BASE) {
    throw new Error(
      'API URL not configured. In Netlify, set VITE_API_BASE_URL to your Railway backend URL (e.g. https://your-app.railway.app), then redeploy.'
    )
  }

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
        'Cannot reach the backend. Check: (1) VITE_API_BASE_URL in Netlify points to your Railway URL, (2) Railway backend is running, (3) CORS_ORIGINS in Railway includes your Netlify site URL (e.g. https://your-site.netlify.app).'
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
  list: ({ employeeId, startDate, endDate } = {}) => {
    const params = new URLSearchParams();
    if (employeeId) params.set('employee_id', employeeId);
    if (startDate) params.set('start_date', startDate);
    if (endDate) params.set('end_date', endDate);
    const qs = params.toString();
    return request(qs ? `/api/attendance?${qs}` : '/api/attendance');
  },

  mark: (body) =>
    request('/api/attendance', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

export const dashboardApi = {
  get: () => request('/api/dashboard'),
};
