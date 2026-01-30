// In production (Netlify), set VITE_API_BASE_URL to your Railway backend URL (e.g. https://your-app.railway.app)
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

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
  const url = API_BASE ? `${API_BASE}${path}` : path;

  let res;
  try {
    res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (err) {
    throw new Error('Failed to fetch. Is the backend running?');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(getMessage(res, data));
  }

  return data;
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
