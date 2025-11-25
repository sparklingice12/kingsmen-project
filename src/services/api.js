const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function api(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}

api.get = (path, opts) => api(path, { method: 'GET', ...opts });
api.post = (path, body, opts) => api(path, { method: 'POST', body: JSON.stringify(body), ...opts });
